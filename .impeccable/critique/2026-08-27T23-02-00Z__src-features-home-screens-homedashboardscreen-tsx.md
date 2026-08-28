---
target: HomeDashboardScreen
total_score: 19
p0_count: 0
p1_count: 2
p2_count: 2
p3_count: 1
timestamp: 2026-08-27T23-02-00Z
slug: src-features-home-screens-homedashboardscreen-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading skeleton, no empty states, no pull-to-refresh, hardcoded "Good morning" regardless of time |
| 2 | Match System / Real World | 3 | Clean terminology, but product tags are generic |
| 3 | User Control and Freedom | 2 | Tab nav works, but no way to dismiss sections or customize dashboard |
| 4 | Consistency and Standards | 3 | Consistent component vocabulary, but quick action cards use shadows inconsistently |
| 5 | Error Prevention | 2 | No confirmation before navigation, no empty state guards |
| 6 | Recognition Rather Than Recall | 2 | Icons labeled, but product images are emoji placeholders |
| 7 | Flexibility and Efficiency of Use | 1 | No search, no shortcuts, no customization |
| 8 | Aesthetic and Minimalist Design | 3 | Clean layout, but consultation banner dominates and emoji icons undermine premium feel |
| 9 | Error Recovery | 1 | No error states visible |
| 10 | Help and Documentation | 0 | No contextual help or guided onboarding |
| **Total** | | **19/40** | **Poor** |

## Anti-Patterns Verdict

Does not look overtly AI-generated. Falls into "competent but lifeless" — structural boxes checked without emotional trust. Detector found 0 issues (expected for React Native).

## What's Working

1. Consultation banner — strong focal point with dark green and clear CTA
2. Visual hierarchy — logical top-to-bottom information flow
3. Consistent component usage — design system followed throughout

## Priority Issues

- **[P1]** No loading, error, or empty states — hardcoded mock data with no safety net
- **P1**: Emoji placeholders break premium brand — 🌿 and 📋 instead of real assets
- **P2**: Hardcoded colors bypass theme — dark mode will break on consultation banner
- **P2**: No pull-to-refresh — users can't check for updates without restarting
- **P3**: Product cards too narrow (140px) and lack visual appeal

## Persona Red Flags

- Casey (Mobile): Join Now button far from thumb zone, no pull-to-refresh, hardcoded greeting at wrong time
- Riley (Stress): No empty state handling, emoji renders differently across Android OEMs
- Sam (A11y): No accessibilityLabel on any TouchableOpacity, no accessibilityRole on quick actions

## Minor Observations

- Hardcoded strings everywhere — no i18n
- Greeting doesn't use user's name
- Section spacing slightly inconsistent
- ScrollView hides vertical indicator

## Questions to Consider

- Should the consultation banner be conditional?
- Should the dashboard personalize based on user behavior?
- What would real product photography do for the brand personality?
