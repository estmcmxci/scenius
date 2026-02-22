"""Simulation engine extracted from generate_figures.py."""

import numpy as np
from scipy.optimize import brentq


def sigmoid(x):
    return np.where(x >= 0, 1.0 / (1.0 + np.exp(-x)), np.exp(x) / (1.0 + np.exp(x)))


def logit(p):
    p = np.clip(p, 1e-12, 1 - 1e-12)
    return np.log(p / (1 - p))


def tune_bias(alpha, beta=1.0, target=0.10, seed=42):
    rng_t = np.random.default_rng(seed)
    q = rng_t.pareto(alpha, size=200_000) + 1
    return brentq(lambda bv: sigmoid(beta * np.log(q) + bv).mean() - target, -15, 15)


def calibration_curve(predictions, outcomes, n_bins=10):
    edges = np.linspace(0, 1, n_bins + 1)
    centers, freqs, counts = [], [], []
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (predictions >= lo) & (predictions < hi)
        if m.sum() > 0:
            centers.append(predictions[m].mean())
            freqs.append(outcomes[m].mean())
            counts.append(m.sum())
        else:
            centers.append((lo + hi) / 2)
            freqs.append(np.nan)
            counts.append(0)
    return np.array(centers), np.array(freqs), np.array(counts)


def generate_stakes(n, sigma_s, seed=0):
    rng = np.random.default_rng(seed)
    raw = rng.lognormal(mean=0, sigma=sigma_s, size=n)
    return raw / raw.mean()


def assign_stakes_regime(stakes, n_good, regime='uncorrelated', seed=0):
    rng = np.random.default_rng(seed + 7777)
    n = len(stakes)
    n_bad = n - n_good
    sorted_idx = np.argsort(stakes)[::-1]
    if regime == 'uncorrelated':
        perm = rng.permutation(n)
        good_indices = set(perm[:n_good])
    elif regime == 'anti_correlated':
        good_slots, bad_slots = n_good, n_bad
        good_indices = set()
        for idx in sorted_idx:
            if bad_slots == 0:
                good_indices.add(idx); good_slots -= 1
            elif good_slots == 0:
                bad_slots -= 1
            elif rng.random() < 0.8:
                bad_slots -= 1
            else:
                good_indices.add(idx); good_slots -= 1
    elif regime == 'correlated':
        good_slots, bad_slots = n_good, n_bad
        good_indices = set()
        for idx in sorted_idx:
            if good_slots == 0:
                bad_slots -= 1
            elif bad_slots == 0:
                good_indices.add(idx); good_slots -= 1
            elif rng.random() < 0.8:
                good_indices.add(idx); good_slots -= 1
            else:
                bad_slots -= 1
    else:
        raise ValueError(f"Unknown regime: {regime}")
    good_list = sorted(good_indices)
    bad_list = sorted(set(range(n)) - good_indices)
    return np.concatenate([stakes[good_list], stakes[bad_list]])


def run_simulation(N, J, alpha, beta, b, agent_sigmas, stakes,
                   rep_init=1.0, lam=0.05, k=5.0, seed=0):
    rng = np.random.default_rng(seed)
    n_ag = len(agent_sigmas)
    n_g = (agent_sigmas < (agent_sigmas.min() + agent_sigmas.max()) / 2).sum()
    s_sum = stakes.sum()
    pE = np.zeros(J); pC = np.zeros(J); pR = np.zeros(J)
    brier_E = np.zeros(J); brier_C = np.zeros(J); brier_R = np.zeros(J)
    outcomes = np.zeros(J, dtype=np.int8)
    reps = np.full(n_ag, rep_init)
    for j in range(J):
        q_j = rng.pareto(alpha) + 1
        theta_j = float(sigmoid(beta * np.log(q_j) + b))
        p_ij = sigmoid(logit(theta_j) + rng.normal(0, agent_sigmas))
        pE[j] = p_ij.mean()
        pC[j] = np.dot(stakes, p_ij) / s_sum
        w_R = reps * stakes
        pR[j] = np.dot(w_R, p_ij) / w_R.sum()
        Y_j = rng.binomial(1, theta_j)
        outcomes[j] = Y_j
        for ba, pv in [(brier_E, pE[j]), (brier_C, pC[j]), (brier_R, pR[j])]:
            ba[j] = (pv - Y_j) ** 2
        reps = (1 - lam) * reps + lam * np.exp(-k * (p_ij - Y_j) ** 2)
    return {
        'pE': pE, 'pC': pC, 'pR': pR,
        'brier_E': brier_E, 'brier_C': brier_C, 'brier_R': brier_R,
        'outcomes': outcomes, 'reputations': reps.copy(),
        'n_good': n_g,
    }


# Default parameters matching the paper
DEFAULTS = {
    'N': 50, 'J': 5000, 'alpha': 1.7, 'beta': 1.0,
    'sigma_good': 0.6, 'sigma_bad': 1.6, 'frac_good': 0.2,
    'sigma_s': 1.0, 'rep_init': 1.0, 'lam': 0.05, 'k': 5.0,
}


def run_multiseed_regime(
    alpha=1.7, sigma_s=1.0, regime='uncorrelated',
    n_seeds=10, sigma_bad=1.6,
    N=50, sigma_good=0.6, frac_good=0.2, beta=1.0,
):
    """Run simulation across multiple seeds with safety caps."""
    J = min(5000, DEFAULTS['J'])
    n_seeds = min(n_seeds, 10)
    n_good = int(N * frac_good)
    b = tune_bias(alpha, beta)
    agent_sigmas = np.array([sigma_good] * n_good + [sigma_bad] * (N - n_good))

    results = []
    for seed in range(n_seeds):
        raw_stakes = generate_stakes(N, sigma_s, seed=seed)
        stakes = assign_stakes_regime(raw_stakes, n_good, regime=regime, seed=seed)
        sim = run_simulation(N, J, alpha, beta, b, agent_sigmas, stakes, seed=seed)
        results.append({
            'seed': seed,
            'brier_E': float(sim['brier_E'].mean()),
            'brier_C': float(sim['brier_C'].mean()),
            'brier_R': float(sim['brier_R'].mean()),
            'rep_sep': float(sim['reputations'][:n_good].mean() / sim['reputations'][n_good:].mean()),
        })

    # Aggregate
    bE = np.array([r['brier_E'] for r in results])
    bC = np.array([r['brier_C'] for r in results])
    bR = np.array([r['brier_R'] for r in results])
    r_vs_c = (bC - bR) / bC * 100
    c_vs_e = (bE - bC) / bE * 100

    return {
        'regime': regime,
        'alpha': alpha,
        'sigma_s': sigma_s,
        'sigma_bad': sigma_bad,
        'n_seeds': n_seeds,
        'J': J,
        'mean_brier_E': float(bE.mean()),
        'mean_brier_C': float(bC.mean()),
        'mean_brier_R': float(bR.mean()),
        'R_vs_C_pct': float(r_vs_c.mean()),
        'R_vs_C_std': float(r_vs_c.std()),
        'C_vs_E_pct': float(c_vs_e.mean()),
        'rep_sep': float(np.mean([r['rep_sep'] for r in results])),
        'per_seed': results,
    }
