"""Simulation tools — query pre-computed data and run live simulations."""

import json
from pathlib import Path

import pandas as pd
from agents import function_tool

from ..simulation.engine import DEFAULTS, run_multiseed_regime
from ..simulation.figures import (
    plot_calibration,
    plot_reputation_separation,
    plot_learning_dynamics,
    plot_inequality_sensitivity,
)

_CSV_DIR = Path(__file__).parent.parent / "data" / "csv"

# Load CSVs at module level
_main_results = pd.read_csv(_CSV_DIR / "scenius_main_results.csv")
_perseed = pd.read_csv(_CSV_DIR / "scenius_main_perseed.csv")
_sweep = pd.read_csv(_CSV_DIR / "scenius_sweep_results.csv")
_inequality = pd.read_csv(_CSV_DIR / "inequality_sweep_results.csv")

_REGIME_MAP = {
    'a': 'uncorrelated', 'uncorrelated': 'uncorrelated',
    'b': 'anti_correlated', 'anti_correlated': 'anti_correlated', 'anti-correlated': 'anti_correlated',
    'c': 'correlated', 'correlated': 'correlated',
}


def _normalize_regime(regime: str) -> str:
    return _REGIME_MAP.get(regime.lower().strip(), regime.lower().strip())


@function_tool
def query_results(regime: str, metric: str = "Brier") -> str:
    """Query the main results table for a specific regime (A/B/C or uncorrelated/anti_correlated/correlated) and metric (Brier or LogLoss)."""
    regime_norm = _normalize_regime(regime)
    metric = metric.strip().title()
    if metric == "Logloss":
        metric = "LogLoss"

    # Match regime label in the CSV
    regime_labels = {
        'uncorrelated': 'A: Uncorrelated',
        'anti_correlated': 'B: Anti-correlated',
        'correlated': 'C: Correlated',
    }
    label = regime_labels.get(regime_norm, regime)
    row = _main_results[(_main_results['Regime'] == label) & (_main_results['Metric'] == metric)]

    if row.empty:
        return f"No results found for regime='{regime}', metric='{metric}'. Available regimes: {list(_main_results['Regime'].unique())}"

    r = row.iloc[0]
    return (
        f"**{r['Regime']} — {r['Metric']}**\n"
        f"- R vs C improvement: {r['R vs C (%)']:.4f}% {r['95% CI']}\n"
        f"- p-value: {r['p-value']:.2e} ({r['Sig']})\n"
        f"- C vs E delta: {r['C vs E (%)']:.4f}%\n"
        f"- Reputation separation: {r['Rep Sep']:.4f}\n"
        f"- Questions: {r['J']}, Seeds: {r['Seeds']}"
    )


@function_tool
def compare_mechanisms(regime: str, sigma_s: float = 1.0) -> str:
    """Compare E, C, R mechanisms for a regime. If sigma_s != 1.0, uses the inequality sweep data."""
    regime_norm = _normalize_regime(regime)

    if abs(sigma_s - 1.0) < 0.01:
        # Use perseed data for default sigma_s
        sub = _perseed[_perseed['regime'] == regime_norm]
        if sub.empty:
            return f"No perseed data for regime '{regime}'."

        lines = [f"**Per-seed comparison — {regime_norm}** (σ_s=1.0)\n"]
        lines.append("| Seed | Brier E | Brier C | Brier R | R vs C (%) | Rep Sep |")
        lines.append("|------|---------|---------|---------|------------|---------|")
        for _, r in sub.head(10).iterrows():
            lines.append(
                f"| {r['seed']} | {r['mean_brier_E']:.6f} | {r['mean_brier_C']:.6f} | "
                f"{r['mean_brier_R']:.6f} | {r['impr_R_vs_C_brier']:.4f} | {r['rep_separation']:.4f} |"
            )
        return "\n".join(lines)
    else:
        # Use inequality sweep data
        sub = _inequality[
            (_inequality['regime'] == regime_norm) &
            ((_inequality['sigma_s'] - sigma_s).abs() < 0.05)
        ]
        if sub.empty:
            available = sorted(_inequality['sigma_s'].unique())
            return f"No inequality data for σ_s={sigma_s}. Available: {available}"

        lines = [f"**Inequality sweep — {regime_norm}** (σ_s={sigma_s})\n"]
        for _, r in sub.iterrows():
            lines.append(
                f"- **{r['metric']}**: R vs C = {r['R_vs_C_pct']:.4f}% "
                f"[{r['R_vs_C_ci_lo']:.4f}, {r['R_vs_C_ci_hi']:.4f}], "
                f"C vs E = {r['C_vs_E_pct']:.4f}%, Rep Sep = {r['rep_sep']:.4f}"
            )
        return "\n".join(lines)


@function_tool
def get_parameters() -> str:
    """Return the default simulation parameters used in the paper."""
    lines = ["**Default Simulation Parameters**\n"]
    lines.append("| Parameter | Symbol | Value |")
    lines.append("|-----------|--------|-------|")
    params = [
        ("Agents", "N", DEFAULTS['N']),
        ("Questions", "J", DEFAULTS['J']),
        ("Pareto tail index", "α", DEFAULTS['alpha']),
        ("Signal coefficient", "β", DEFAULTS['beta']),
        ("Good agent noise", "σ_good", DEFAULTS['sigma_good']),
        ("Bad agent noise", "σ_bad", DEFAULTS['sigma_bad']),
        ("Fraction good", "f_good", DEFAULTS['frac_good']),
        ("Stake dispersion", "σ_s", DEFAULTS['sigma_s']),
        ("Initial reputation", "r_0", DEFAULTS['rep_init']),
        ("Learning rate", "λ", DEFAULTS['lam']),
        ("Reputation sensitivity", "k", DEFAULTS['k']),
    ]
    for name, sym, val in params:
        lines.append(f"| {name} | {sym} | {val} |")
    lines.append("\nNote: Live simulations cap at J=5000, n_seeds=10.")
    return "\n".join(lines)


@function_tool
def run_custom_simulation(
    alpha: float = 1.7,
    sigma_s: float = 1.0,
    regime: str = "uncorrelated",
    n_seeds: int = 5,
    sigma_bad: float = 1.6,
) -> str:
    """Run a live simulation with custom parameters. Caps: J≤5000, n_seeds≤10."""
    regime_norm = _normalize_regime(regime)
    if regime_norm not in ('uncorrelated', 'anti_correlated', 'correlated'):
        return f"Invalid regime '{regime}'. Use: uncorrelated, anti_correlated, or correlated."

    result = run_multiseed_regime(
        alpha=alpha, sigma_s=sigma_s, regime=regime_norm,
        n_seeds=n_seeds, sigma_bad=sigma_bad,
    )

    lines = [
        f"**Simulation Results**",
        f"- Regime: {result['regime']}",
        f"- α={result['alpha']}, σ_s={result['sigma_s']}, σ_bad={result['sigma_bad']}",
        f"- J={result['J']}, seeds={result['n_seeds']}\n",
        f"| Mechanism | Mean Brier |",
        f"|-----------|------------|",
        f"| Equal (E) | {result['mean_brier_E']:.6f} |",
        f"| Capital (C) | {result['mean_brier_C']:.6f} |",
        f"| Reputation (R) | {result['mean_brier_R']:.6f} |\n",
        f"- **R vs C improvement: {result['R_vs_C_pct']:.4f}%** (std: {result['R_vs_C_std']:.4f})",
        f"- C vs E delta: {result['C_vs_E_pct']:.4f}%",
        f"- Reputation separation: {result['rep_sep']:.4f}",
    ]
    return "\n".join(lines)


@function_tool
def generate_figure(
    figure_type: str,
    regime: str = "anti_correlated",
    alpha: float = 1.7,
    sigma_s: float = 1.0,
    sigma_bad: float = 1.6,
) -> str:
    """Generate a figure. Types: calibration, reputation_separation, learning_dynamics, inequality_sensitivity.
    Returns a markdown image URL that renders inline."""
    regime_norm = _normalize_regime(regime)

    if figure_type == "calibration":
        url = plot_calibration(regime_norm, alpha, sigma_s, sigma_bad)
    elif figure_type == "reputation_separation":
        url = plot_reputation_separation(regime_norm, alpha, sigma_s, sigma_bad)
    elif figure_type == "learning_dynamics":
        url = plot_learning_dynamics(regime_norm, alpha, sigma_s, sigma_bad)
    elif figure_type == "inequality_sensitivity":
        url = plot_inequality_sensitivity()
    else:
        return (
            f"Unknown figure type '{figure_type}'. "
            "Available: calibration, reputation_separation, learning_dynamics, inequality_sensitivity"
        )

    return f"Figure '{figure_type}' generated successfully and will be displayed as an image below your response. Describe what the figure shows."
