## Research 

# Annotated Literature Review: Reputation-Weighted Prediction Markets for Cultural Breakout Events

***

## 1. Prediction Market Theory

### 1.1 Foundational Market Mechanism Design

**Hanson, R. (2003/2007). "Logarithmic Market Scoring Rules for Modular Combinatorial Information Aggregation." *Journal of Prediction Markets*, 1(1), 3–15.**
The seminal paper introducing the Logarithmic Market Scoring Rule (LMSR), which combines the individual incentive-compatibility of proper scoring rules with the group information-aggregation properties of betting markets. Hanson proves that the logarithmic rule is uniquely modular: bets on event A conditional on B preserve independence relations among other events (Theorems 1 and 2). The LMSR cost function is \(C(\vec{q}) = b \ln\left(\sum_i e^{q_i/b}\right)\), where \(b\) controls the liquidity-loss tradeoff and \(\vec{q}\) is the vector of outstanding shares. This is the *de facto* standard automated market maker for prediction markets. **Relevance to prosed mechanism**: LMSR provides the natural cost-function backbone for the prediction market layer; the parameter \(b\) can be tuned to control subsidy exposure during the attestation-seeding phase.[^1][^2][^3][^4][^5]

**Chen, Y. & Pennock, D.M. (2007). "A Utility Framework for Bounded-Loss Market Makers." *Proceedings of UAI 2007*, pp. 49–56.**
Introduces utility-based market makers that accept orders at risk-neutral prices and derives necessary and sufficient conditions for bounded loss. Proves that HARA utility market makers are equivalent to weighted pseudospherical scoring rule market makers, with Hanson's LMSR corresponding to negative exponential utility. Establiss the fundamental tradeoff: for a fixed worst-case loss bound, no market maker can uniformly dominate another in liquidity across all price regimes. **Relevance**: Provides the formal basis for understanding how your reputation-weighted cost function relates to the market maker's loss bound.[^6][^7][^8][^9]

**Abernethy, J., Chen, Y. & Wortman Vaughan, J. (2013). "Efficient Market Making via Convex Optimization, and a Connection to Online Learning." *ACM Transactions on Economics and Computation*, 1(1), Article 2.**
Establishes a general framework connecting cost-function-based prediction markets to convex optimization and online learning. Shows that any convex cost function defines a valid market maker, and the market maker's worst-case loss equals the conjugate of the cost function evaluated at the true outcome. Proves a duality between cost-function markets and scoring rule markets. **Relevance**: This framework is essential for designing custom cost functions that incorporate reputation weights as adaptive liquidity parameters.[^10][^11][^12]

**Dudík, M., Frongillo, R. & Wortman Vaughan, J. (2014). "Market Making with Decreasing Utility for Information." *Proceedings of UAI 2014*.**
Studies cost-function-based prediction markets where the market maker's utility for information decreases over tim. Designs adaptive cost functions using Bregman divergences for settings where information revelation follows a schedule. **Relevance**: Directly applicable to your temporal attestation model, where early signals carry higher informational value than later ones.[^13]

**Wortman Vaughan, J. & Pennock, D.M. (2013). "Cost Function Market Makers for Measurable Spaces." *EC '13*.**
Extends cost-function market makers to infinite and continuous outcome spaces, overcoming the impossibility results of Gao & Chen (2010) regarding unbounded loss for continuous random variables. **Relevance**: Cultural breakout events with continuous streaming thresholds require market designs for non-discrete outcomes.[^14]

### 1.2 Proper Scoring Rules

**Gneiting, T. & Raftery, A.E. (2007). "Strictly Proper Scoring Rules, Prediction, and Estimation." *Journal of the American Statistical Association*, 102(477), 359–378.**
The definitive modern treatment of proper scoring rules. A scoring rule \(S\) is strictly proper if the expected score \(S(Q,Q) \geq S(P,Q)\) for all \(P, Q\), with equality iff \(P = Q\). Provides the Savage representation theorem: every regular proper scoring rule can be written in terms of a convex entropy function \(G\) and its Bregman divergence. Covers quadratic (Brier), logarithmic, spherical, and continuous ranked probability scores. **Relevance**: Provides the formal toolkit for designing the scoring mechanism used to evaluate forecaster accuracy and compute reputation weights.[^15][^16]

**Brier, G.W. (1950). "Verification of Forecasts Expressed in Terms of Probability." *Monthly Weather Review*,8(1), 1–3.**
Introduces the Brier score \(BS = \frac{1}{N}\sum_{t=1}^{N}(f_t - o_t)^2\), the most widely used strictly proper scoring rule for probabilistic forecasts. **Relevance**: The Brier score is the natural candidate for computing forecaster track records in your reputation system.[^17][^18]

**Good, I.J. (1952). "Rational Decisions." *Journal of the Royal Statistical Society B*, 14(1), 107–114.**
Introduces the logarithmic scoring rule, which is strictly proper and forms the basis of the LMSR. The connection between the log scoring rule and information-theoretic entropy gives it special properties in market contexts.[^19][^20]

**de Finetti, B. (1937/1962/1970). Foundational works on subjective probability and ing rules.**
de Finetti independently invented proper scoring rules and established subjective probability as marginal rates of substitution between contingent claims. His framework underpins the entire prediction market enterprise.[^21][^22]

### 1.3 Information Aggregation

**Ostrovsky, M. (2012). "Information Aggregation in Dynamic Markets with Strategic Traders." *Econometrica*, 80(6), 2595–2647.**
Proves that for "separable" securities (a broad class including Arrow-Debreu securities and additive securities), information in dynamic markets with partially informed strategic traders always gets aggregated. As time approaches the end of the trading interval, market price converges in probability to the expected valueonditional on all traders' information. **Relevance**: Establishes the theoretical foundation for why your reputation-weighted market can aggregate dispersed cultural conviction signals into a convergent probability estimate.[^23][^24][^25][^26]

**Wolfers, J. & Zitzewitz, E. (2004). "Prediction Markets." *Journal of Economic Perspectives*, 18(2), 107–126.**
The canonical survey of prediction markets. Shows that market-generated forecasts are typically accurate and outperform moderately sophisticated benchmarks. Discusses how carefully designed contracts yield insight into market expectations about probabilities, means, medians, and uncertainty. **Relevance**: Establishes empirical credibility of prediction markets as forecasting tools, contextualizing your mechanism's advantages.[^27][^28][^29]

**Palan, S., Huber, J. & Senninger, L. (2020). "Aggregation Mechanisms for Crowd Predictions." *Experimental Economics*, 23(3), 788–814.**
Controlled experiment compg arithmetic/geometric means, medians, CDA prices, and call market prices under asymmetric information. CDA market prices clearly outperform all alternative aggregation approaches. **Relevance**: Supports market mechanisms over simple polling for information aggregation in your design.[^30]

**Hayek, F.A. (1945). "The Use of Knowledge in Society." *American Economic Review*, 35(4), 519–530.**
The foundational argument for price mechanisms as distributed information aggregators. Markets coordinate dispersed knowledge held by millions of agents without requiring centralization. **Relevance**: The theoretical motivation for using a market mechanm (rather than a poll or committee) to aggregate dispersed cultural conviction signals.[^31][^32]

### 1.4 Empirical Performance

**Atanasov, P. et al. (2017). "Distilling the Wisdom of Crowds: Prediction Markets vs. Prediction Polls." *Management Science*, 63(3), 691–706.**
First large-scale experimental comparison (2,400+ participants, 261 events over two seasons). Market prices outperformed simple mean polls, but team prediction polls with differential weighting based on past performance and extremizing outperformed prediction markets. **Relevance**: Directly supports the hypothesis that reputation-weighting can outperform capital-weighting.[^33]

**Erikson, R.S. & Wlezien, C. (2012). "Markets vs. Polls as Election Predictors: An Historical Assessment." *Electoral Studies*, 31(3), 532–53
Examines 130+ years of U.S. election prediction markets versus polls. Finds that pre-poll markets were more accurate than post-poll markets, suggesting markets are most valuable when they aggregate truly dispersed private information rather than merely reflecting publicly available data. **Relevance**: Validates that private signal aggregation (your attestation model) is where markets add the most value.[^34]

**Are Markets More Accurate Than Polls? (Camerer et al., 2019). *Judgment and Decision Making*, 14(2), 135–147.**
Shows that prediction market prices can be decomposed into calibration and discrimination components, with self-reported beliefs sometimes outperforming market prices. A hybrid combining prices and beliefs often outperforms either alone. **Relevance**: Supports the hybrid approach of combining attestation-weighted pors with market prices.[^35]

**Servan-Schreiber, E. et al. (2004). "Prediction Markets: Does Money Matter?" *Electronic Markets*, 14(3), 243–251.**
Real-money markets are significantly more accurate for non-sports events; play-money markets are competitive for sports. **Relevance**: Capital-at-risk is important for incentive alignment, supporting your use of staking as a commitment mechanism.[^36]

### 1.5 Limitations of Capital-Weighted Markets

**Manski, C.F. (2006). "Interpreting the Predictions of Prediction Markets." *Economics Letters*, 91(3), 425–429.**
Questions whether prediction market prices can be interpreted as probabilities. Shows that under risk-neutral agents with fixed bet sizes, equilibrium price corresponds to a quantile of the belief distribution, not the mean. **Relevance**: Directly motivates your mechanism—capital-weighting can distort probabilitmates when wealth is uncorrelated with information quality.[^37][^38]

**Wolfers, J. & Zitzewitz, E. (2006). "Interpreting Prediction Market Prices as Probabilities." NBER Working Paper No. 12200.**
Response to Manski showing that under log utility and most reasonable risk-aversion assumptions, prices are close to the wealth-weighted mean belief. However, the key qualifier is "wealth-weighted"—when wealthy but uninformed traders dominate, prices can diverge from informationally efficient aggregates. **Relevance**: The wealth-weighted (rather than information-weighted) nature of standard markets is the core limitation your reputation-weighting addresses.[^39][^40][^37]

**Snowberg, E. & Wolfers, J. (2010). "Explaining the Favorite-Longshot Bias: Is It Risk-Love or Misperceptions?" *NBER Working Paper No. 15923*.**
Documents the favorite-longshot bias in betting marketsongshots are overpriced relative to true probabilities. Evidence favors probability misperceptions (Prospect Theory) over risk-loving preferences. **Relevance**: Calibration biases in capital-weighted markets may be especially severe for tail events (cultural breakouts), further motivating reputation-based corrections.[^41]

***

## 2. Reputation-Weighted and Expertise-Weighted Aggregation

### 2.1 Identifying and Weighting Expert Forecasters

**Budescu, D.V. & Chen, E. (2015). "Identifying Expertise to Extract the Wisdom of Crowds." *Management Science*, 61(2), 267–280.**
Develops a method to identify individual forecasters' contributions to crowd accuracy and to construct optimally weighted aggregates. Shows that weighting by past accury, even using simple metrics, substantially improves aggregate forecasts over equal-weight averaging. **Relevance**: Core methodological precedent for your reputation weighting system—demonstrates that track-record-based weights are feasible and effective.[^42][^43][^44]

**Mellers, B. et al. (2015). "Identifying and Cultivating Superforecasters as a Method of Improving Geopolitical Forecasts." *Perspectives on Psychological Science*, 10(3), 267–281.**
Documents the Good Judgment Project's identification of "superforecasters" who maintained top-2% Brier scores across seasons. Superforecasters exhibited active open-minded thinking, granular probability estimates, and frequent incremental belief updating. **Relevance**: Demonstrates that persistent individual forecasting skill exists and can be identified, validating the pre of reputation-based influence allocation.[^45][^46]

**Tetlock, P.E. & Gardner, D. (2016). *Superforecasting: The Art and Science of Prediction*. New York: Random House.**
Describes the IARPA forecasting tournament and the four drivers of performance: getting the right people, interaction (teams), training, and the extremizing algorithm. The log-odds extremizing algorithm pushes crowd aggregates toward extremes proportional to the diversity of inputs, bringing mass forecasts to near-superforecaster accuracy. **Relevance**: The extremizing algorithm is a form of post-aggregation calibration that complements reputation weighting; your mechanism could incorporate both.[^47][^48][^49]

**Atanasov, P. et al. (2021). "Forecasting Forecaster Accuracy: Contributions of Past Performance and Individual Differences." *Judgment and Decision Making*, 16(2), 253–283.**
Empirically demonstrates that forecaster accuracy is temporally stable and that IRT-based skill assessments, combined with individual difference measures, produce the best-performing weighted aggregation. Weighted methods significantly outperform unweighted methods, though the practical gain from more sophisticated weighting (IRT vs. simple) is modest—the key benefit comes from *any* performance-based differentiation. **Relevance**: Supports your design choice of reputation-weighting while suggesting that simple weighting schemes may suffice.[^50]

### 2.2 Expert Judgment Aggregation Theory

**Cooke, R.M. (1991). *Experts in Uncertainty: Opinion and Sutive Probability in Science*. Oxford University Press.**
Introduces the "Classical Model" for performance-based expert weighting. Experts assess calibration ("seed") variables with known true values; their weights are derived from statistical accuracy (calibration score) and informativeness. Weights satisfy asymptotic strictly proper scoring rule constraints. The methodology has been validated across 60+ professional risk analysis applications. **Relevance**: The Classical Model is the gold standard for performance-based expert weighting in risk analysis; your mechanism adapts this concept to dynamic market settings.[^51][^52][^53][^54]

**Mathematically Aggregating Experts' Predictions of Possible Futures (2021). *PLOS ONE*.**
Develops and tests weighted linear opinion pools using proxies for forecasting performance: reasoning quality, engagement, openness to updating, informativeness, prior knowledge, and extremity of estimates. Compares differential weighting to simple averages and medians. **Relevance**: Demonstrates that multiple proxy measures for expertise can be incorporated into weighting schemes.[^55]

**Peker, C. (2022). "Extracting the Collective Wisdom in Probabilistic Judgments." *Theory and Decision*.**
Proposes the "Surprising Overshoot" algorithm using predictions and meta-predictions (estimates of others' predictions) to correct for shared-information-induced miscalibration. **Relevance**: Addresses the correlation structure among forecasters' information—relevant when early cultural signals may be partially shared.[^56]

### 2.3 Incentive-Compatible Weighted Aggregation

**Shah, N. & Schwartz, D. (2009). "Collective Revelation: A Mechanism for Self-Verified, Weighted, and Truthful Crowdsourcing." *Proceedings of AAAI*.**
Introduces "collective revelation," an elicitation mechanism that is simultaneously incentive-compatible, information-weighted, self-verifying, and budget-balanced. Agents reveal both predictions and confidence; the mechanism weights by posterior precision. Pros that any incentive-compatible and information-weighted mechanism must elicit both expectations and uncertainty. **Relevance**: Provides the formal basis for a mechanism that endogenously weights by information quality—the theoretical ideal your reputation system approximates empirically.[^57]

**Wires Review (Babic et al., 2020). "Aggregating Predictions from Experts: A Review of Statistical Methods, Experiments, and Applications." *WIREs Computational Statistics*.**
Comprehensive survey of aggregation methods including Bayesian methods, linear opinion pools, and performance-weighted combinations. **Relevance**: Situates your contribution within the broader aggregation literature.[^58][^59]

***

## 3. Mechanism Design Under Private Information

### 3.1 Foundational Mechanism Design

**Myerson, R.B. (1981). "Optimal Auction Design." *Mathematics of Operations Research*, 6(1), 58–73The foundational paper on optimal mechanism design under private information. Establishes that incentive compatibility requires monotone allocation rules and that payment rules are pinned down (up to a constant) by the allocation rule (revenue equivalence). The revelation principle shows that any implementable outcome can be achieved by a direct truthful mechanism. **Relevance**: Provides the formal framework for analyzing whether your reputation-weighted mechanism is incentive-compatible.[^60][^61][^62]

**Bergemann, D. & Välimäki, J. (2019). "Dynamic Mechanism Design: An Introduction." *Journal of Economic Literature*, 57(2), 235–274.**
Comensive survey of dynamic mechanism design with quasilinear preferences. Covers the dynamic pivot mechanism (Bergemann & Välimäki, 2010), which extends VCG to dynamic settings, and revenue-optimal mechanisms with dynamically changing types. Key insight: in dynamic settings, incentive compatibility requires envelope conditions that account for how current reports affect future payoffs. **Relevance**: Your mechanism operates over multiple rounds (attestation → market trading → resolution), making dynamic IC constraints essential.[^63][^64][^65]

**Pavan, A., Segal, I. & Toikka, J. (2014). "Dynamic Mechanism Design: A Myersonian Approach." *Econometrica*, 82(2), 601–653.**
Provides a general characterization of incentive compatibility in dynamic environth serially correlated types. The envelope formula combines the static marginal effect of types on payoffs with novel dynamic effects of current type on future type distributions. Extends Myerson's revenue equivalence to dynamic settings. **Relevance**: Directly applicable to analyzing incentive compatibility in your repeated-game reputation mechanism where forecasters' types (skill levels) evolve over time.[^66][^67]

### 3.2 Information and Mechanism Design

**Bergemann, D. & Morris, S. (2005). "Robust Mechanism Design." *Econometrica*, 73(6), 1771–1813.**
Studies mechanism design when the designer is uncertain about agents' information structures. Dominant-strategy IC requires truthtelng regardless of others' reports; ex-post IC requires truthtelling when others also report truthfully. **Relevance**: Robustness to information structure is critical when agents have heterogeneous and evolving private signals about cultural trends.[^68]

### 3.3 Truthful Elicitation in Prediction Markets

**Conitzer, V. (2009). "Prediction Markets, Mechanism Design, and Cooperative Game Theory." *Proceedings of UAI 2009*.**
Establishes formal connections between prediction markets and mechanism design, treating prediction market design as a mechanism design problem where agents have private signals. Shows how concepts from cooperative game theory (Shapley values) can allocate market surplus to truthfully-reporting agents. **Relevance**: Provides a formal framework for analyzing the incentive properties of your attestation-to-market pipeline.[^69]

**Chen, Y. & Kash, I. (2011). "Information Elicitation for Decision Making." *Proceedings of AAMAS 2011*.**
Studies prediction markets as mechanisms for decision-relevant information elicitation, extending the analysis of decision markets. **Relevance**: Your mechanism elicits information to predict cultural breakout events—a decision-relevant outcome for labels, platforms, and investors.[^70]

**Prelec, D. (2004). "A Bayesian Truth Serum for Subjective Data." *Science*, 306(5695), 462–466.**
Introduces a scoring method for eliciting truthful subjective data when objective truth is unknowable. High scores are assigned to answers that are "surprisingly common"—more common than predicted by respondents collectiveRelevance**: For cultural signals where ground truth is not yet available at the time of elicitation, BTS-style mechanisms can incentivize truthful reporting without waiting for market resolution.[^71][^72][^73]

**Baillon, A. (2017). "Bayesian Markets to Elicit Private Information." *PNAS*, 114(30), 7958–7962.**
Designs markets where trading positions reveal private binary information, with truth-telling as a Bayesian Nash equilibrium. Simpler than BTS as it avoids meta-belief elicitation. **Relevance**: Could inform the design of your attestation mechanism's incentive structure.[^74]

### 3.4 Repeed-Game Reputation

The literature on repeated-game reputation equilibria (Kreps & Wilson, 1982; Milgrom & Roberts, 1982; Fudenberg & Levine, 1992) establishes that in repeated interactions, agents can build reputations that sustain cooperative behavior. In your setting, forecasters' long-run concern for their reputation score—which determines future market influence—creates a reputation equilibrium where honest reporting is sustained. The connection between proper scoring rules and long-run calibration (Foster & Vohra, 1998) provides additional theoretical support.

***

## 4. Heavy-Tailed Payoff Distributions and Market Design

### 4.1 Fat Tails in Economics and Finance

**Taleb, N.N. (2020). *Statistical Consequences of Fat Tails: Real World Preasymptotics, Epistemology, and Applications*. STEM Academic Press.**
Comprehensive treatment of hot-tailed distributions (power law class P with tail decay \(\Pr(X > x) \sim x^{-\alpha}\)) invalidate standard statistical procedures. Key results: (1) the Law of Large Numbers converges far more slowly under fat tails; (2) standard estimators (mean, variance) become unreliable; (3) calibration of tail exponents is inherently fragile. **Relevance**: Cultural breakout events are paradigmatically fat-tailed. Your market's cost function and scoring mechanism must be robust to these properties.[^75][^76]

**Taleb, N.N., Bar-Yam, Y. & Cirillo, P. (2020). "On Single Point Forecasts for Fat-Tailed Variables." *International Journal of Forecasting*.**
Argues that point forecasts are fundamentally inappropriate for fat-tailed variables. Risk management must focus on tail properties and distribution of extrema, not averages. **Relevance**: Motivates your mechanism's focus on probability distributions (forward curves) rather than point estimates for cultural breakout prediction.[^77][^78]

**Ibragimov, R., Jaffee, D. & Walden, J. (2015). *Heavy-Tailed Distributions and Robustness in Economics and Finance*. Springer Lecture Notes in Statistics.**
Demonstrates that heavy tails can either reinforce or reverse the conclusions of standard economic models depending on the tail index \(\alpha\). The threshold \(\alpha = 1\) (infinite mean) is a critical boundary. Diversification may be suboptimal for sufficiently fat-tailed distributions. **Relevance**: Standard LMSR cost functions are designed for well-behaved distributions; your mechanism needs modifications for the cultural domain's heavy tails.[^79]

**Resnick, S.I. (2007). *Heavy-Tail Phenomena: Probabilistic and Statistical Modeling*. Springer.**
Technical treatment of regularly varying functions, extreme value theory, and point process representations of heavy-tailed data. **Relevance**: Provides the mathematical toolkit for formally characterizing the tail behavior of cultural breakout distributions.[^80]

### 4.2 Cultural and Entertainment Payoff Distributions

**Elberse, A. (2013). *Blockbusters: Hit-making, Risk-taking, and the Big Business of Entertainment*. New York: Henry Holt.**
Empirical analysis of the entertainment industry showing that hit-driven ("blockbuster") strategies dominate, with a small number of products generating the vast majority of revenue. The distribution of cultural success is extremely right-skewed, with most products failing and a few achieving outsized returns. **Relevance**: Establishes the empirical stylized fact that cultural breakout events follow power-law distributions, directly motivating your market design for heavy-tailed payoffs.[^81][^82][^83]

**Shapiro, D. (2023). "Power Laws in Culture." *The Mediator* (Substack).**
Analyzes why cultural consumption follows power-law distributions even as content supply becomes infinite. More choice increases reliance on social signals and recommendation algorithms, which concentrate attention. Breakout hits emerge from the tail via social amplification. **Relevance**: Provides the cultural-economic context for why early fan actions (your "attestations") can serve as leading indicators of power-law-distributed outcomes.[^84]

### 4.3 Venture Capital Power Law Analogy

**Venture Capital Return Distributions.**
VC returns exhibit canonical power-law behavior: fewer than 10% of investments generate 50%+ of fund returns and over 90% of profits. This "fat tail" structure—where a small number of outlier outcomes dominate total value—is structurally identical to the cultural breakout distribution your mechanism targets. Formal treatments appear in Korteweg & Sorensen (2017, *Review of Financial Studies*) and Ewens et al. (2013, *Journal of Financial Economics*).[^85][^86][^87][^88][^89]

### 4.4 Robust Cost Functions fxtreme Events

The challenge of designing cost-function market makers under heavy-tailed payoff distributions is largely open. Standard LMSR has bounded loss \(b \ln(n)\) where \(n\) is the number of outcomes, but this assumes a finite outcome space. For continuous or unbounded outcomes, Gao & Chen (2010) showed that reasonable market makers suffer unbounded worst-case loss—a result partially addressed by Wortman Vaughan's measurable-space extension. Your mechanism's innovation of using reputation-weighted attestations to *constrain the prior* before opening the market is one approach to taming the tails—effectively focusing liquidity on the region of the probability space where informed signals concentrate.[^4][^14]

***

## 5. Asset Pricing and Risk-Neutral Probability

### 5.1 Statetingent Claims and Arrow-Debreu Securities

**Arrow, K.J. (1953/1964). "The Role of Securities in the Optimal Allocation of Risk-Bearing." *Review of Economic Studies*, 31(2), 91–96.**
Introduces state-contingent claims (Arrow-Debreu securities): a security paying \$1 if state \(s\) occurs and nothing otherwise. Proves that a complete market of such securities achieves Pareto-optimal risk allocation. Any security can be priced as a linear combination of state prices: \(\Pi_f = \sum_s a_{fs} P_s\). **Relevance**: Your prediction market contracts are Arrow-Debreu securities on cultural breakout states; e prices are state prices interpretable as (risk-neutral) probabilities.[^90][^91][^92][^93]

### 5.2 Risk-Neutral Probability and Prediction Market Prices

**Wolfers, J. & Zitzewitz, E. (2006). "Interpreting Prediction Market Prices as Probabilities." NBER Working Paper No. 12200.**
Provides sufficient conditions under which prediction market prices equal mean beliefs. With log utility, prices exactly equal wealth-weighted mean beliefs. For CRRA utility with \(\gamma \neq 1\), prices approximate mean beliefs with a monotonic mapping. Risk-neutral probability relates to subjective probability via: \(\Pr^{RN}(\omega) \propto \Pr(\omega) \cdot u'(x_\omega)\). **Relevance**: Establishes the formal mapping between your market's prices and the underlying probability distribution, and highlights that the wealth-weighting of standard markets is a feature, not a bug—but one your mechanism proposes to replace with reputation-weighting.[^94][^40][^37][^39]

**Manski, C.F. (2006). "Interpreting the Predictions of Prediction Markets." *Economics Letters*, 91(3), 425–429.**
Shows that with risk-neutral traders and fixed budgets, market price equals the \((1-\pi)\)-th percentile of the belief distribution, not the mean. This worst-case scenario for the "prices as probabilities" rpretation is driven by extreme assumptions but highlights the sensitivity of the price-probability mapping to trader characteristics. **Relevance**: Strengthens the case for your mechanism—by weighting influence by track record rather than capital, the price-probability mapping becomes closer to informationally efficient.[^38][^37]

### 5.3 State Price Densities and Recovery

**Ross, S.A. (2015). "The Recovery Theorem." *Journal of Finance*, 70(2), 615–648.**
Shows how to separate risk-neutral probabilities into natural (physical) probabilities and the priciernel from state prices alone. State prices are the product of risk aversion and natural probability: \(p_{ij}^* = f_{ij} \cdot d_j / d_i \cdot \delta\), where \(f_{ij}\) are natural transition probabilities and \(d_j/d_i\) is the pricing kernel. **Relevance**: Provides the mathematical framework for extracting "true" breakout probabilities from your market's risk-neutral prices, which may embed risk premia reflecting the heavy-tailed nature of cultural payoffs.[^95][^96][^97][^98]

### 5.4 Forward Curves in Incomplete Markets

In incomplete markets (where the set of traded securities doesn't span all states), state prices are not unique—they dene a set of risk-neutral measures consistent with no-arbitrage. Your prediction market on cultural breakout events is inherently incomplete: not all possible cultural outcomes can be traded. The forward curve of breakout probabilities at different time horizons thus reflects both expectations and a liquidity/risk premium. Formal treatments of pricing under incompleteness appear in Harrison & Kreps (1979, *Journal of Economic Theory*) and Cochrane (2005, *Asset Pricing*, Princeton University Press).

**Credit Default Probability Analogy.**
The interpretation of prediction market prices as breakout probabilities is structurally analogous to extracting default probabilities from credit default swap spreads. In credit markets, CDS spreads embed both physical default probability and a risk premium; separating these requires assumptions about recovery rates and risk preferences (Duffie & Singleton, 1999, *Review of Financial Studies*). Similarly, your market's prices embed both the physical breakout probability and any risk/ambiguity premium traders demand for exposure to heavy-tailed cultural outcomes.

***

## 6. Oracle and Signal Aggregation Theory

### 6.1 Decentralized Oracle Networks

**Chainlink 2.0 Whitepaper (Breidenbach, E. et al., 2021). "Chainlink 2.0: Next Steps in the Evolution of Decentralized Oracle Networks."**
Describes the architecture of Decentralized Oracle Networks (DONs) with explicit trust-minimization goals. Key design principles include: decentralized data sourcing from multiple independent oracles, cryptographic commitments to prevent data manipulation, and reputation-based node selection. **Relevance**: The DON architecture provides a template for your attestation aggregation layer—timestamped attestations from independent cultural observers are aggregated via a reputation-weighted oracle funcon.[^99]

**TCO-DRL: Trust-Aware and Cost-Optimized Blockchain Oracle Selection Model (2025). *IEEE Transactions*.**
Proposes a multi-dimensional trust management mechanism for oracle nodes incorporating reliability scores (success rate, interaction frequency, response time), behavioral assessment, staked tokens, and a sliding time-window mechanism to prevent trust monopolies. Uses deep reinforcement learning for dynamic oracle selection. **Relevance**: Provides a concrete implementation model for computing and updating reputation scores in your oracle/attestation layer.[^100]

### 6.2 Robust Signal Aggregation

**The general problem of aggregating multiple probabilistic signals into a single probability output** is treated in several frameworks:

- **Linear opinion pools** (DeGroot, 1974; Clemen & Winkler, 1999): Aggregate as \(\bar{p} = \sum_i w_i p_i\), where weights \(w_i\) can be uniform or performance-based.[^55]
- **Logarithmic opinion pools** (Genest & Zidek, 1986): Aggregate as \(\bar{p} \propto \prod_i p_i^{w_i}\), which preserves Bayesian structure.
- **Supra-Bayesian aggregation** (Morris, 1974; Lindley, 1985): Treats each expert's forecast as data and updates a meta-prior.
- **Extremizing** (Baron et al., 2014; Satopää et al., 2014): Post-aggregation transformation \(\bar{p}_{ext} = \bar{p}^a / (\bar{p}^a + (1-\bar{p})^a)\) where \(a > 1\) pushes toward extrem, compensating for information overlap.[^47]

**Relevance**: Your mechanism's final output—the reputation-weighted forward curve—is essentially a weighted opinion pool with endogenous weights. The choice between linear and logarithmic pooling, and whether to apply extremizing, are design decisions with formal consequences for calibration.

***

## 7. Connecting the Literature to the Proposed Contribution

### Mapping the Proposed Mechanism to Literature

| Mechanism Component | Primary Literature | Key Theoretical Result |
|---|---|---|
| Timestamped attestations as private signals | Hayek (1945); Prelec (2004) | Dispersed private info aggregated via market prices; BTS incentivizes truthful reporting |
| Attestation-weighted priors | Cooke (1991); Budescu & Chen (2015) | Performance-based weing satisfies asymptotic proper scoring rule constraints |
| LMSR prediction market backbone | Hanson (2003/2007); Chen & Pennock (2007) | LMSR is uniquely modular; bounded loss with controlled liquidity |
| Reputation-weighted trader influence | Tetlock et al. (2015); Atanasov et al. (2021) | Track-record-based weighting outperforms equal weighting; accuracy is temporally stable |
| Forward probability curve output | Arrow (1953); Wolfers & Zitzewitz (2006) | Prices as risk-neutral probabilities; mappable to physical probs under specified utility |
| Heavy-tailed payoff domain | Taleb (2020); Elberse (2013) | Cultural outcomes are power-law distributed; standard estimators unreliable |
| Capital-weighted vs. reputation-weighted comparison | Manski (2006); Shah & Schwartz (2009) | Capital-weighting ≠ information-weighting; IC information-weighted mechanisms exist |

### Open Theoretical Questions for Your Paper

1. **Incentive compatibility**: Does the reputation-weightemechanism maintain incentive compatibility when traders can strategically manipulate their track records? The dynamic mechanism design framework of Pavan et al. (2014) provides the tools to analyze this.

2. **Convergence under fat tails**: Ostrovsky's (2012) information aggregation results assume bounded payoffs. Extending convergence guarantees to heavy-tailed cultural payoffs requires new analysis.

3. **Optimal reputation update rule**: Should reputation weights use Brier scores, log scores, or Cooke-style calibration-informativeness products? Gneiting & Raftery (2007) characterize the tradeoffs.

4. **Subsidy cost and market maker loss**: Abernethy et al. (2013) establish the cost-liquidity tradeoff for LMSR. Your attestation-weighted prior effectively provides "free" information, reducing the required subsidy to achieve a given accuracy level—this claim requires formal analysis.

***

## Comprehensive Reference List (Alphabetical by First Author)

1. Abernethy, J., Chen, Y. & Wortman Vaughan, J. (20). "Efficient Market Making via Convex Optimization, and a Connection to Online Learning." *ACM TEAC*, 1(1).
2. Arrow, K.J. (1953/1964). "The Role of Securities in the Optimal Allocation of Risk-Bearing." *Review of Economic Studies*, 31(2), 91–96.
3. Atanasov, P. et al. (2017). "Distilling the Wisdom of Crowds." *Management Science*, 63(3), 691–706.
4. Atanasov, P. et al. (2021). "Forecasting Forecaster Accuracy." *Judgment and Decision Making*, 16(2), 253–283.
5. Baillon, A. (2017). "Bayesian Markets to Elicit Private Information." *PNAS*, 114(30), 7958–7962.
6. Baron, J. et al. (2014). "Two Reasons to Make Aggregated Probability Forecasts More Extreme." *Decision Analysis*, 11(2), 133–145.
7. Bergemann, D. & Morris, S. (2005). "Robust Mechanism Design." *Econometrica*, 73(6), 1771–1813.
8. Bergemann, D. & Välimäki, J. (2019). "Dynamic Mn: An Introduction." *JEL*, 57(2), 235–274.
9. Brier, G.W. (1950). "Verification of Forecasts Expressed in Terms of Probability." *Monthly Weather Review*, 78(1), 1–3.
10. Budescu, D.V. & Chen, E. (2015). "Identifying Expertise to Extract the Wisdom of Crowds." *Management Science*, 61(2), 267–280.
11. Chen, Y. & Pennock, D.M. (2007). "A Utility Framework for Bounded-Loss Market Makers." *UAI 2007*.
12. Cochrane, J.H. (2005). *Asset Pricing*, Revised Edition. Princeton University Press.
13. Conitzer, V. (2009). "Prediction Markets, Mechanism Design, and Cooperative Game Theory." *UAI 2009*.
14. Cooke, R.M. (1991). *Experts in Uncertainty*. Oxford University Press.
15. de Finetti, B. (1937). "La Prévision: Ses Lois Logiques, Ses Sources Subjectives." *Annales de l'Institut Henri Poincaré*, 7(1), 1–68.
16. Dudík, M., Frongillo, R. & Wortman Vaughan, J. (2014). "Market Making with Decreasing Utility for Information." *UAI 2014*.
17. Duffie, D. & Singleton, K.J. (1999). "Modeling Term Structures of DBonds." *Review of Financial Studies*, 12(4), 687–720.
18. Elberse, A. (2013). *Blockbusters*. Henry Holt.
19. Erikson, R.S. & Wlezien, C. (2012). "Markets vs. Polls as Election Predictors." *Electoral Studies*, 31(3), 532–539.
20. Foster, D.P. & Vohra, R.V. (1998). "Asymptotic Calibration." *Biometrika*, 85(2), 379–390.
21. Galton, F. (1907). "Vox Populi." *Nature*, 75, 450–451.
22. Gneiting, T. & Raftery, A.E. (2007). "Strictly Proper Scoring Rules." *JASA*, 102(477), 359–378.
23. Good, I.J. (1952). "Rational Decisions." *JRSS B*, 14(1), 107–114.
24. Hanson, R. (2003/2007). "Logarithmic Market Scoring Rules for Modular Combinatorial Information Aggregation." *Journal of Prediction Markets*, 1(1), 3–15.
25. Harrison, J.M. & Kreps, D.M. (1979). "Martingales and Arbitrage in Multiperiod Securities Markets." *JET*, 20(3), 381–408.
26. Hayek, F.A. (1945). "The Use of Knowledge in Society." *AER*, 35(4), 519–530.
27. Ibragimov, R., Jaffee, D. & Walden, J. (2015). *Heavy-Tailed Distributions anonomics and Finance*. Springer.
28. Manski, C.F. (2006). "Interpreting the Predictions of Prediction Markets." *Economics Letters*, 91(3), 425–429.
29. Mellers, B. et al. (2015). "Identifying and Cultivating Superforecasters." *Perspectives on Psychological Science*, 10(3), 267–281.
30. Myerson, R.B. (1981). "Optimal Auction Design." *Mathematics of Operations Research*, 6(1), 58–73.
31. Ostrovsky, M. (2012). "Information Aggregation in Dynamic Markets with Strategic Traders." *Econometrica*, 80(6), 2595–2647.
32. Palan, S., Huber, J. & Senninger, L. (2020). "Aggregation Mechanisms for Crowd Predictions." *Experimental Economics*, 23(3), 788–814.
33. Pavan, A., Segal, I. & Toikka, J. (2014). "Dynamic Mechanism Design: A Myersonian Approach." *Econometrica*, 82(2), 601–653.
34. Prelec, D. (2004). "A Bayesian Truth Serum for Subjective Data." *Science*, 306(5695), 462–466.
35. Resnick, S.I. (2007). *Heavy-Tail Phenomena*. Springer.
36. Ross, S.A. (2015). "The Recovery Theorem." *Journal of Finan5–648.
37. Savage, L.J. (1971). "Elicitation of Personal Probabilities and Expectations." *JASA*, 66(336), 783–801.
38. Shah, N. & Schwartz, D. (2009). "Collective Revelation." *AAAI*.
39. Snowberg, E. & Wolfers, J. (2010). "Explaining the Favorite-Longshot Bias." *NBER WP 15923*.
40. Surowiecki, J. (2004). *The Wisdom of Crowds*. Doubleday.
41. Taleb, N.N. (2020). *Statistical Consequences of Fat Tails*. STEM Academic Press.
42. Taleb, N.N., Bar-Yam, Y. & Cirillo, P. (2020). "On Single Point Forecasts for Fat-Tailed Variables." *IJF*.
43. Tetlock, P.E. & Gardner, D. (2016). *Superforecasting*. Random House.
44. Wolfers, J. & Zitzewitz, E. (2004). "Prediction Markets." *JEP*, 18(2), 107–126.
45. Wolfers, J. & Zitzewitz, E. (2006). "Interpreting Prediction Market Prices as Probabilities." *NBER WP 12200*.
46. Wortman Vaughan, J. & Pennock, D.M. (2013). "Cost Function Market Makers for Measurable Spaces." *EC '13*.

---

## References

1. [How does the Logarithmic Market Scoring Rule (LMSR) work?](https.cultivatelabs.com/crowdsourced-forecasting-guide/how-does-logarithmic-market-scoring-rule-lmsr-work) - Market scoring rules are used to compute the current price of a stock in a prediction market. Conseq...

2. [[PDF] Complexity of Combinatorial Market Makers - Lance Fortnow](https://lance.fortnow.com/papers/files/LMSR.pdf) - Hanson's [13, 14] logarithmic market scoring rule market maker (LMSR) is becoming the de facto stand...

3. [Comparing Prediction Market Mechanisms](https://www.jasss.org/21/1/7.html) - Among the main market mechanisms implemented so far in prediction markets are (1) the continuous dou...

4. [[PDF] Logarithmic Market Scoring Rules for Modular Combinatorial ...](https://mason.gmu.edu/~rhanson/mktscore.pdf) - Logarithmic Market Scoring Rules for. Modular Combinatorial Information Aggregation. Robin Hanson ∗....

5. [Logarithmic Market Scoring Rules for Modular Combinatorial I](https://ideas.repec.org/a/buc/jpredm/v1y2007i1p3-15.html) - Robin Hanson, 2007. "Logarithmic Market Scoring les for Modular Combinatorial Information Aggregat...

6. [[1206.5252] A Utility Framework for Bounded-Loss Market Makers](https://arxiv.org/abs/1206.5252) - Abstract:We introduce a class of utility-based market makers that always accept orders at their risk...

7. [A utility framework for bounded-loss market makers](https://dl.acm.org/doi/10.5555/3020488.3020495) - We introduce a class of utility-based market makers that always accept orders at their risk-neutral ...

8. [[PDF] A Utility Framework for Bounded-Loss Market Makers](https://www.semanticscholar.org/paper/A-Utility-Framework-for-Bounded-Loss-Market-Makers-Chen-Pennock/4e50170738ba043c06d82e50a3727d522f523930) - It is proved that hyperbolic absolute risk aversion utility market makers are equivalent to weighted...

9. [[PDF] A Utility Framework for Bounded-Loss Market Makers - Yiling Chen](https://yiling.seas.harvard.edu/files/2025/01/mm_long.pdf) - We introduce a class of utility-based market makers that always accept orders at their risk-neutral ...

10. [[PDF] Efficient Market Making via Convex Optimization, and a Connection ...](https://web.eecs.umich.edu/~jabernet/papers/ACV12.pdf) - Using our framework, we illustrate the mathematical paral- lels between cost function based markets ...

11. [Prediction Markets II - Bo Waggoner](https://bowaggoner.com/blog/2018/08-08-prediction-markets-ii/) - The main reference is Abernethy, Chen, and Wortman Vaughan (2013). We'll start by describing cost fu...

12. [[PDF] On Risk Measures, Market Making, and Exponential Families](https://www.sigecom.org/exchanges/volume_13/2/ABERNETHY.pdf) - Abernethy, J., Chen, Y., and Vaughan, J. W. 2013. Efficient market making via convex optimization, a...

13. [[PDF] Market Making with Decreasing Utility for Information - UAI](https://www.auai.org/uai2014/proceedings/individuals/273.pdf) - We study information elicitation in cost-func- tion-based combinatorial prediction markets when the ...

14. [[PDF] Cost Function Market Makers for Measurable Spaces](https://www.jennwv.com/papers/measures.pdf) - We characterize cost function market makers designed to elicit traders' beliefs about the expectatio...

15. [[PDF] Strictly Proper Scoring Rules, Prediction, and Estimation](https://sites.stat.washington.edu/raftery/Research/PDF/Gneiting2007jasa.pdf) - Scoring rules assess the quality of probabilistic forecasts, by assigning a numerical score based on...

16. [[PDF] Proper Scoring Rules](https://courses.cs.duke.edu/spring17/compsci590.2/proper_scoring.pdf) - [Savage 1971, Gneiting and Raftery 2007]. • Theorem. A scoring rule is (strictly) proper if and only...

17. [Brier score](https://en.wikipedia.org/wiki/Brier_score) - The Brier score is a strictly proper scoring rule that measures the accuracy of probabilistic predic...

18. [A Brief on Brier Scores | UVA Liary](http://library.virginia.edu/data/articles/a-brief-on-brier-scores) - The Brier score is just the mean of squared differences between those predictions and their correspo...

19. [[PDF] Information Aggregation in Prediction Markets - IISc Math](https://www.math.iisc.ac.in/~nmi/4_Dr._Rahul_Sami_talk_2.pdf) - There are several well-known proper scoring rules: – Quadratic Scoring Rule [Brier 1952]. – Logarith...

20. [[PDF] Information Aggregation in Prediction Markets](http://helper.ipam.ucla.edu/publications/gss2015/gss2015_12538.pdf) - Function s(·,·) is a proper scoring rule if it is optimal for the individual to report his expectati...

21. [[PDF] Comonotonic proper scoring rules to measure ambiguity and ...](https://personal.eur.nl/wakker/pdfspubld/11.3compropscrule.pdf) - ABSTRACT. Proper scoring rules serve to measure subjective degrees of belief. Traditional proper sco...

22. [[PDF] Eliciting Subjective Probabilities with Binary Lotteries](http:/.gsu.edu/workingpapers/GSU_EXCEN_WP_2012-16.pdf) - Consider a scoring rule to elicit subjective probabilities. A sufficiently risk averse agent is goin...

23. [[PDF] Information Aggregation Under Ambiguity: Theory and Experimental ...](https://www.restud.com/wp-content/uploads/2024/01/MS27085manuscript.pdf) - Abstract. We study information aggregation in a dynamic trading model. We show the- oretically that ...

24. [[PDF] Information Aggregation in Dynamic Markets With Strategic Traders](https://web.stanford.edu/~ost/papers/aggregation.pdf) - This paper studies information aggregation in dynamic markets with a finite number of partially info...

25. [[PDF] Information Aggregation with Costly Information Acquisition - arXiv](https://arxiv.org/pdf/2406.07186.pdf) - Ostrovsky [2012] provides a strong result, that information gets aggregated in all Nash equilibria i...

26. [Information Aggregation in Dynamic Markets With Strategic Traders](https://onlinelibrary.wiley.com/doi/abs/10.3982/ECTA8479) - This paper studies information aggregation in dynamic markets with a finite number of partially info...

27. [Prediction Markets by Justin Wolfers, Eric Zitzewitz :: SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=560070) - We analyze the extent to which simple markets can be used to aggregate disperse information into eff...

28. [[PDF] Prediction Markets for Economic Forecasting - Brookings Institution](https://www.brookings.edu/wp-content/uploads/2016/06/13-prediction-markets-wolfers.pdf) - Adapted from Wolfers and Zitzewitz (2004). 7. Page 9. Figure 2: Prediction markets show little evide...

29. [[PDF] Prediction Markets Justin Wolfers; Eric Zitzewitz The Journal of ...](https://jmvidal.cse.sc.edu/library/wolfers04a.pdf) - Justin Wolfers; Eric Zitzewitz. The Journal of Economic Perspectives, Vol. 18, No. 2. (Spring, 2004)...

30. [Aggregation mechanisms for crowd predictions - PMC - NIH](https://pmc.ncbi.nlm.nih.gov/articles/PMC7591134/) - We find that prices from continuous double auction markets clearly outperform all alternative approa...

31. [The Use of Knowledge in Society - Wikipedia](https://en.wikipedia.org/wiki/The_Use_of_Knowledge_in_Society) - Hayek argued that information is decentralized – that knowledge is unevenly dispersed among differen...

32. [[PDF] The Use of Knowledge in Society - Santa Fe Institute](https://sites.santafe.edu/~bowles/wp-content/uploads/Hayek-paper-2022-Foundational-papers-in-complexity.pdf) - Ludwig von Mises, Hayek and others advanced the view that the rational economic calculation entailed...

33. [Distilling the Wisdom of Crowds: Prediction Markets vs ...](https://pubsonline.informs.org/doi/10.1287/mnsc.2015.2374) - We report the results of the rst large-scale, long-term, experimental test between two crowdsourci...

34. [Markets vs. polls as election predictors: An historical assessment](https://www.sciencedirect.com/science/article/abs/pii/S0261379412000467) - This paper assesses the accuracy of US presidential election betting markets in years before and aft...

35. [Are markets more accurate than polls?](https://www.cambridge.org/core/journals/judgment-and-decision-making/article/are-markets-more-accurate-than-polls-the-surprising-informational-value-of-just-asking/B78F61BC84B1C48F809E6D408903E66D) - Prediction markets appear to be a victory for the economic approach, having yielded more accurate pr...

36. [[PDF] Statistical Tests of Real-Money versus Play- Money Prediction Markets](https://electronicmarkets.org/fileadmin/user_upload/doc/Issues/Volume_16/Issue_01/V16I1_Statistical_Tests_of_Real-Money_versus_Play-Money_Prediction_Markets.pdf) - There is considerable evidence that such prediction markets, using real money or play money, generat...

37. [[PDF] Interpreting Prediction Market Prices as Probabilities - NBER](https://www.nber.org/system/files/working_papers/w12200/w12200.pdf) - In a provocative recent paper, Charles Manski (2004) asked “What is the logical basis for interpreti...

38. [Interpreting the predictions of prediction markets - ScienceDirect.com](https://www.sciencedirect.com/science/article/abs/pii/S016517650600022X) - The analysis of this paper demonstrates the danger of loosely interpreting prices in prediction mark...

39. [Interpreting Prediction Market Prices as Probabilities | IZA](https://www.iza.org/publications/dp/2092/interpreting-prediction-market-prices-as-probabilities) - We find that prediction markets prices tically provide useful (albeit sometimes biased) estimates ...

40. [Interpreting Prediction Market Prices as Probabilities - SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=900986) - We provide relevant analytic foundations, describing sufficient conditions under which prediction ma...

41. [[PDF] Explaining the Favorite-Longshot Bias: Is it Risk-Love or ...](https://www.nber.org/system/files/working_papers/w15923/w15923.pdf) - The favorite-longshot bias describes the longstanding empirical regularity that betting odds provide...

42. [[PDF] Crowd Prediction Systems: Markets, Polls, and Elite Forecasters](https://faculty.wharton.upenn.edu/wp-content/uploads/2016/11/Crowd-Prediction-Systems.pdf) - Budescu, D.V., Chen, E., 2015. Identifying Expertise to Extract the Wisdom of. Crowds. Management Sc...

43. [Identifying Expertise to Extract the Wisdom of Crowds - jstor](https://www.jstor.org/stable/24550328) - Budescu and Chen: Identifying Expertise to Extract the Wisdom of Crowds ... 267-280, ©2015 INFORMS. ...

44. [Identifying Expertise to Extract the Wisdom of Crowds - IDEAS/RePEc](https://ideas.repec.org/a/inm/ormnsc/v61y2015i2p267-280.html) - Statistical aggregation is often used to combine multiple opinions within a group. Such aggregates o...

45. [Are superforecasters useful? - by Nathaniel Hendrix - Perambulations](https://nathanielhendrix.substack.com/p/are-superforecasters-useful) - Each of a superforecaster's updates differs from their previous prediction by just 3.5%, versus 5.9%...

46. [[PDF] Identifying and Cultivating Superforecasters as a Method of ...](https://stanford.edu/~knutson/nfc/mellers15.pdf) - Finally, superforecasters had higher scores than ll others on actively open-minded thinking, a scal...

47. [Edge Master Class 2015: A Short Course in Superforecasting, Class II](https://www.edge.org/conversation/philip_tetlock-edge-master-class-2015-a-short-course-in-superforecasting-class-ii) - Tetlock: People who wonder how prediction markets could have been beaten draw the conclusion that we...

48. [Notes on 'Superforecasting: The Art and Science of Prediction'](https://www.scattered-thoughts.net/blog/2016/01/28/notes-on-superforecasting-the-art-and-science-of-prediction/) - Tetlock uses the Brier score to score predictions. This is a scoring rule with the useful property t...

49. [Superforecasting - Notion](https://robertreads.notion.site/Superforecasting-7e68c63d4aa94ba4a0748ec0a1a78952) - Superforecasting is the product of Tetlock's research and experiments running a large-scale and long...

50. [Forecasting forecaster accuracy: Contributions of past performance ...](https://www.cambridge.org/core/journals/judgment-and-decision-making/article/forecasting-forecaster-accuracy-contributions-of-past-performance-and-individual-differences/914F973B8C6A9CDCD3F1EA7CF17048D2) - Our results suggest these methods perform better at assessing forecasting skill than simpler methods...

51. [[PDF] Validating Expert Judgment with the Classical Model - TU Delft](https://filelist.tudelft.nl/EWI/Over%20de%20faculteit/Afdelingen/Applied%20Mathematics/uitzoeken/Applied%20Probability/Risk/Download/Validating%20Expert%20Judgment%20with%20the%20Classical%20Model.pdf) - Abstract: The classical model derives performance based weights for combining expert judgments, base...

52. [[PDF] Technical Details of the Classical Model](https://rogermcooke.net/rogermcooke_files/SEJ%20-%20SI%20June%2022%202022.pdf) - Performance weights for combining experts are derived which satisfy asymptotic strictly proper scori...

53. [Expert Elicitation - Using the Classical Model](https://www.journals.uchicago.edu/doi/full/10.1093/reep/rex022) - Combined scores serve as the mechanism for producing performance-based weights for combining the exp...

54. [Structured expert judgment: the classical model](https://en.wikipedia.org/wiki/Structured_expert_judgment:_the_classical_model) - The classical model derives Performance Weighted (PW) combinations. These are compared with Equally ...

55. [Mathematically aggregating experts' predictions of possible futures](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0256919) - The vast majority of the aggregation methods that we outline in this paper are weighted linear combi...

56. [[PDF] Extracting the collective wisdom in probabilistic judgments](https://d-nb.info/1271336480/34) - 2014; Budescu and Chen 2015). However, optimal weights depend on how experts' prediction errors are ...

57. [[PDF] Collective revelation: a mechanism for self-verified, weighted, and ...](https://5harad.com/papers/collec-rev.pdf) - In this paper we introduce collective revelation, an elicitation and aggregation mech- anism that is...

58. [Aggregating predictions from experts: a review of statistical methods ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC7996321/) - This review surveyed recent literature on aggregating expert-elicited predictions. We gathered commo...

59. [Aggregating predictions from experts: A review of statistical methods ...](https://wires.onlinelibrary.wiley.com/doi/abs/10.1002/wics.1514) - This review surveyed recent literature on aggregating expert-elicited predictions. We gathered commo...

60. [Revelation principle - Wikipedia](https://en.wikipedia.org/wiki/Revelation_principle) - The revelation principle is a fundamental result in mechanism design, social choice theory, and game...

61. [[PDF] Dynamic Auctions - Microsoft](https://www.microsoft.com/en-us/research/wp-content/uploads/2010/05/DynamicAuctionsSurveyV2.pdf) - In a static setting in which all buyers are present simultaneously, Myerson (1981) solves the optima...

62. [[PDF] Mechanism Design Theory](https://www.nobelprize.org/uploads/2018/06/advanced-economicsciences2007.pdf) - Appealing to the revelation princi- ple, Myerson studied incentive-compatible direct mechanisms, whe...

63. [[PDF] Dynamic Mechanism Design: An Introduction](https://cowles.yale.edu/sites/default/files/2022-09/d2102.pdf) - We provide an introduction into the recent developments of dynamic mechanism design with a primary f...

64. [[PDF] Dynamic Mechanism Design: An Introduction - Peter Cramton](https://cramton.umd.edu/market-design-papers/bergemann-valimaki-dynamic-mechanism-design.pdf) - The earlier survey by Bergemann and Said (2010) focuses on dynamic auctions, and the more recent sur...

65. [[PDF] Dynamic Mechanism Design: Robustness and Endogenous Types](https://faculty.wcas.northwestern.edu/apa522/Dynamic%20Mechanism_Chapter1_Pavan.pdf) - dynamic pivot mechanism of Bergemann and Välimäki (2010), the Athey and. Segal (2013) mechanism has ...

66. [[PDF] Dynamic Mechanism Design: A Myersonian Approach](https://faculty.wharton.upenn.edu/wp-content/uploads/2018/07/pst14.pdf) - First, we provide a necessary condition for incentive compatibility that takes the form of an envelo...

67. [Dynamic Mechanism Design: A Myersonian Approach](https://onlinelibrary.wiley.com/doi/abs/10.3982/ECTA10269) - We stu mechanism design in dynamic quasilinear environments where private information arrives over...

68. [[PDF] INFORMATION IN MECHANISM DESIGN By Dirk Bergemann and ...](https://cowles.yale.edu/sites/default/files/2022-08/d1532-r.pdf) - The basic issue in mechanism design is how to truthfully elicit private and decentralized infor- mat...

69. [[PDF] Prediction Markets, Mechanism Design, and Cooperative Game ...](https://www.cs.cmu.edu/~conitzer/predictionUAI09.pdf) - A good pre- diction market incentivizes agents to reveal their information truthfully; such incentiv...

70. [[PDF] Decision Markets With Good Incentives - Microsoft](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/DM_full_version.pdf) - Abstract. Decision markets both predict and decide the future. They allow experts to predict the eff...

71. [A Bayesian Truth Serum for Subjective Data - jstor](https://www.jstor.org/stable/3839317) - I present a scoring method for eliciting truthful subjective data in situations where objective trut...

72. [A Bayesian truth serum for subjective data - PubMed](https://pubmed.ncbi.nlm.nih.gov/15486294/) - I present a scoring method for eliciting truthful subjective data in situations where objective trut...

73. [A Bayesian Truth Serum for Subjective Data - Semantic Scholar](https://www.semanticscholar.org/paper/A-Bayesian-Truth-Serum-for-Subjective-Data-Prelec/52c9e15facda9999e54b8876d8ad5f2edd885d9f) - A scoring method for eliciting truthful subjective data in situations where objective truth is unkno...

74. [Bayesian markets to elicit private information - PNAS](https://www.pnas.org/doi/10.1073/pnas.1703486114) - Bayesian markets complement alternative methods proposed to elicit private information, which are th...

75. [[PDF] Taleb -- Statistical Consequences of Fat Tails](https://codowd.com/bigdata/misc/Taleb_Statistical_Consequences_of_Fat_Tails.pdf) - ... Power Law Class P. 7. 2.2.2 ... certain about the process), so what we call "fat tails" may some...

76. [[PDF] STATISTICAL CONSEQUENCES OF FAT TAILS](https://taleb.ru/wp-content/uploads/2019/05/STATISTICAL_CONSEQUENCES_OF_FAT_TAILS_TE.pdf) - about classes of statistical distributions that deliver extreme events, and how we should deal with ...

77. [On single point forecasts for fat tailed variables](https://forecasters.org/blog/2020/06/14/on-single-point-forecasts-for-fat-tailed-variables/) - Forecasting single variables in fat tailed domains is in violation of both common sense and probabil...

78. [On single point forecasts for fat-tailed variables - PMC - NIH](https://pmc.ncbi.nlm.nih.gov/articles/PMC7572356/) - We discuss common errors and fallacies when using naive “evidence based” empiricism and point foreca...

79. [[PDF] Heaailed Distributions and Robustness in Economics and Finance](http://ndl.ethernet.edu.et/bitstream/123456789/62826/1/326.pdf) - Fat tails and copulas: Limits of diversification revisited. Working paper, Imperial College Business...

80. [[PDF] The Fundamentals of Heavy Tails](https://users.cms.caltech.edu/~adamw/papers/book-2020-03.pdf) - Chapter 2 generalizes both power law and fat-tailed distributions and has strong connections to the ...

81. [Blockbusters: Hit-making, Risk-taking, and the Big Business of ...](https://www.hbs.edu/faculty/Pages/item.aspx?num=44790) - Elberse, Anita. Blockbusters: Hit-making, Risk-taking, and the Big Business of Entertainment. New Yo...

82. [Blockbusters: Hit-making, Risk-taking, and the Big Business of ...](https://www.barnesandnoble.com/w/blockbusters-anita-elberse/1114317566) - In this groundbreaking book, she explains a powerful truth about the fiercely competitive world of e...

83. ['Blockbusters': Go Big Or Go Home, Says Harvard Professor - NPR](https://www.npr.org/2013/10/24/239795165/blockbusters-go-big-or-go-home-says-harvard-professor) - Anita Elberse's new book, Blockbusters, examines the strategy behind making and marketing megahits. ...

84. [Power Laws in Culture - by Doug Shapiro - The Mediator](https://dougshapiro.substack.com/p/power-laws-in-culture) - Why the Internet simultaneously fragments and concentrates attention, resulting in power law like di...

85. [Explainer: Understanding the Venture Capital Power Law](https://www.bipevergreenfunds.com/news/explainer-understanding-the-venture-capital-power-law) - As the fat-tail distribution model shows, a small percentage of investments generates most of the re...

86. [White Paper - The science of startup investing - Syndicate Room](https://www.syndicateroom.com/guides-and-reports/whitepaper-power-law) - Understand why venture capital returns follow power law distribution ... What we want to know for st...

87. [“Power Laws Rule Everything Around Me:” Distribution of Venture ...](https://blogs.cornell.edu/info2040/2015/11/22/power-laws-rule-everything-around-me-distribution-of-venture-capital-returns/) - This final point exhibits the idea of “fat tails.” Portfolios are constructed around the idea that t...

88. [Power law and implications for portfolio management](https://www.tonyfedorov.com/power-law/) - Unlike the stock market, where a Gaussian distribution with fat tails more or less describes the ret...

89. [From Sandpiles to Angel Investments - CFA Institute Blogs](https://blogs.cfainstitute.org/investor/2024/08/12/from-sandpiles-to-angel-investments/) - Power law distributions are characterized by the prf “fat tails,” where extreme values occur...

90. [[PDF] 12. arrow-debreu model of general equilibrium under uncertainty](https://www.princeton.edu/~dixitak/Teaching/EconomicsOfUncertainty/Slides&Notes/Slides12.pdf) - Can have markets in the S1 , S2 slips that pay $1 in one state, nothing in the other. Can also have ...

91. [[PDF] The Role of Securities in the Optimal Allocation of Risk-bearing K. J. ...](https://www.sfu.ca/~kkasa/Arrow_64.pdf) - However, in the real world the allocation of risk-bearing is accomplished by claims payable in money...

92. [Arguably the most important finance paper ever written - Bogleheads](https://www.bogleheads.org/forum/viewtopic.php?t=42094) - To do so, he invents the idea of a state-security (sometimes called a “state-contingent claim,”or “A...

93. [[PDF] The Role of Securities in the Optimal Allocation of Risk-bearing](http://efinance.org.cn/cnRole%20of%20Securities%20in%20the%20Optimal%20Allocation%20of%20Risk-bearing.pdf) - In the actual world, risk-bearing is not allocated by the sale of claims against specific commoditie...

94. [[PDF] Prediction Markets: Economics, Computation, and Mechanism Design](https://yiling.seas.harvard.edu/files/2025/01/ec-tutorial-prediction-markets-2007-1.pdf) - ❖Always mixes with the agent's utility (risk attitude). ➢ Risk neutral probability: the probability ...

95. [[PDF] The Recovery Theorem - UC Berkeley Haas](https://haas.berkeley.edu/wp-content/uploads/Recovery-Theorem-final-manuscript-for-publication.pdf) - No arbitrage implies the existence of positive Arrow Debreu state prices, a risk-neutral measure und...

96. [[PDF] The Recovery Theorem - CDN](https://bpb-us-w2.wpmucdn.com/u.osu.edu/dist/7/36891/files/2017/07/Ross2015-27fd9du.pdf) - The Recovery Theorem enables us to separate these to determihe market's forecast of returns and ...

97. [[PDF] NBER WORKING PAPER SERIES THE RECOVERY THEOREM ...](https://www.nber.org/system/files/working_papers/w17323/w17323.pdf) - This equation tells us that the state price density, , relating risk neutral probabilities and natur...

98. [[PDF] MIT Open Access Articles The Recovery Theorem](https://dspace.mit.edu/bitstream/handle/1721.1/99126/Ross_The%20recovery%20theorem.pdf;sequence=1) - If the riskless rate is state independent then the unique natural density associated with a given se...

99. [[PDF] Next Steps in the Evolution of Decentralized Oracle Networks](https://research.chain.link/whitepaper-v2.pdf) - Trust minimization: Our general aim in the design of DONs is to facilitate a highly trustworthy laye...

100. [[PDF] A Trust-Aware and Cost-Optimized Blockchain Oracle Selection ...](https://arxiv.org/pdf/2502.16133.pdf) - Building on this trust management mechanism, we further propose a DRL-based oracle node selection al...

