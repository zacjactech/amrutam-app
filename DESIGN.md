---
name: Amrutam
description: Ayurvedic health super app — consultations, herbal products, and personal health records in one serene ecosystem.
colors:
  primary: "#2D6A4F"
  primary-deep: "#1B4332"
  primary-soft: "#D1FAE5"
  secondary: "#40916C"
  destructive: "#DC2626"
  destructive-soft: "#FEE2E2"
  background-primary: "#F8F9FA"
  background-secondary: "#F1F3F5"
  surface-default: "#FFFFFF"
  surface-elevated: "#FFFFFF"
  text-primary: "#1A1A1A"
  text-secondary: "#6B7280"
  text-tertiary: "#9CA3AF"
  text-inverse: "#FFFFFF"
  border-default: "#E5E7EB"
  border-light: "#F3F4F6"
  success: "#2D6A4F"
  success-soft: "#D1FAE5"
  warning: "#F59E0B"
  warning-soft: "#FEF3C7"
  error: "#DC2626"
  error-soft: "#FEE2E2"
  info: "#3B82F6"
  info-soft: "#DBEAFE"
  record-lab: "#3B82F6"
  record-lab-soft: "#DBEAFE"
  record-consultation: "#7C3AED"
  record-consultation-soft: "#EDE9FE"
  record-vaccination: "#06B6D4"
  record-vaccination-soft: "#CFFAFE"
  record-allergy: "#F97316"
  record-allergy-soft: "#FFEDD5"
  rating: "#F59E0B"
  skeleton: "#E5E7EB"
  skeleton-highlight: "#F3F4F6"
  overlay: "rgba(0, 0, 0, 0.5)"
  dark-background-primary: "#0F1512"
  dark-background-secondary: "#1F2A23"
  dark-surface-default: "#17201B"
  dark-surface-elevated: "#1F2A23"
  dark-text-primary: "#EDF3EE"
  dark-text-secondary: "#A8B5AC"
  dark-text-tertiary: "#6B7B71"
  dark-border-default: "#2A362F"
  dark-primary: "#5FBF8A"
  dark-primary-pressed: "#4CC48A"
  dark-primary-soft: "#1E3A2C"
typography:
  display:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
  h1:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
  h2:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  h3:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  h4:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  body-large:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  body-small:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  caption:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "14px"
  button:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "20px"
  label:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
  price:
    fontFamily: "System default (San Francisco / Roboto)"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "24px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  xxxl: "32px"
  xxxxl: "40px"
  xxxxxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  card-elevated:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.md}"
    padding: "12px"
  card-outlined:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.md}"
    padding: "12px"
  card-filled:
    backgroundColor: "{colors.background-secondary}"
    rounded: "{rounded.md}"
    padding: "12px"
  chip-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  chip-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  input-default:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px"
  tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "0"
    padding: "0"
---

# Design System: Amrutam

## 1. Overview

**Creative North Star: "The Herbal Apothecary"**

The Amrutam design system channels the quiet authority of a well-curated apothecary — every remedy has its place, every element earns its presence. The palette is rooted in deep forest greens that evoke Ayurvedic tradition without drifting into literal leaf imagery. Surfaces are clean but never sterile; the warm-gray backgrounds and generous spacing create breathing room that feels intentional, not empty.

This system explicitly rejects the clinical coldness of generic telemedicine apps — no insurance-form layouts, no checkbox-heavy interfaces, no sterile blue-white palettes. It also avoids the trendy DTC wellness aesthetic of beige-and-blur minimalism. Amrutam's warmth comes from its green heart, not from warm-tinted neutrals. The interface is calm and unhurried, like a practitioner who has all the time in the world.

**Key Characteristics:**
- Deep muted green as the singular brand anchor — used with restraint, never wallpaper
- Tonal layering over shadow-heavy elevation — depth through color shifts, not drop shadows
- System typography at comfortable sizes — legible, unhurried, never shouting
- Generous whitespace that lets content breathe — the apothecary shelf, not the cluttered drawer
- Status colors tied to the green family for cohesion — even errors feel grounded, not alarming

## 2. Colors

The palette is anchored by a single deep muted green that carries the brand identity. All other colors exist to support it: neutrals for structure, status colors for feedback, and record-specific accents for the health module.

### Primary

- **Forest Green** (#2D6A4F): The brand anchor. Used for primary actions (buttons, active tabs, links), selected states, and success indicators. This is Amrutam's signature — recognizable at a glance, used with restraint.
- **Deep Forest** (#1B4332): The pressed/active variant of primary. Used on button press states and the consultation banner background. Darker than primary to convey downward pressure.
- **Mint Wash** (#D1FAE5): The primary-soft tint. Used for secondary button backgrounds, chip fills on selection, and soft status indicators. Pale enough to recede, green enough to stay on-brand.
- **Sage** (#40916C): A lighter mid-tone green for secondary actions and hover-adjacent states. Bridges the gap between primary and its soft tint.

### Neutral

- **Paper** (#F8F9FA): The primary background. A cool near-white that avoids the warm-cream AI default. Clean and clinical without being harsh.
- **Mist** (#F1F3F5): The secondary background. Used for filled card variants, section separators, and subtle depth shifts.
- **White** (#FFFFFF): Surface color for cards, modals, and elevated containers. Pure white that contrasts cleanly against the gray backgrounds.
- **Charcoal** (#1A1A1A): Primary text color. Near-black with enough warmth to avoid feeling ink-black. Used for headings, body text, and primary labels.
- **Pebble** (#6B7280): Secondary text. Used for descriptions, timestamps, and supporting information that should recede.
- **Fog** (#9CA3AF): Tertiary text. Used for placeholders, disabled states, and the lightest text layer.
- **Cloud** (#E5E7EB): Default border color. A neutral divider that doesn't compete with content.
- **Mist-Light** (#F3F4F6): Light border variant for subtle separators.

### Status

- **Success Green** (#2D6A4F): Reuses the primary green — success and brand are one. Used in confirmation states and health record success indicators.
- **Warning Amber** (#F59E0B): Warm amber for caution states. Stands apart from the green family to draw attention without alarming.
- **Error Red** (#DC2626): Reserved for destructive actions and error states. Used sparingly — the app should rarely need to shout.
- **Info Blue** (#3B82F6): Informational callouts and links. Cool enough to stay neutral, distinct from the green brand.

### Record Accents

Health records use a small set of accent colors to differentiate record types:
- **Lab Blue** (#3B82F6): Laboratory results and test reports.
- **Consultation Purple** (#7C3AED): Consultation notes and doctor interactions.
- **Vaccination Cyan** (#06B6D4): Vaccination records and immunization history.
- **Allergy Orange** (#F97316): Allergy records and sensitivity alerts.

### Dark Mode

Dark mode inverts the tonal relationships while preserving the green brand anchor:
- Background shifts to deep forest-black (#0F1512), surfaces to slightly lighter green-black (#17201B).
- Primary green lightens to #5FBF8A for adequate contrast on dark surfaces.
- Text inverts: primary becomes #EDF3EE, secondary becomes #A8B5AC.
- The Mint Wash tint (#1E3A2C) becomes a dark surface variant rather than a light wash.

### Named Rules

**The One Green Rule.** The primary green (#2D6A4F) is the only brand color. It appears on ≤15% of any given screen — active tabs, primary buttons, selected chips, success states. Its restraint is the point. When in doubt, use neutral, not more green.

**The Status Family Rule.** All status colors are chosen to harmonize with the green anchor, not compete with it. Error red is the single exception — it must break the harmony to signal danger.

## 3. Typography

**System Font:** San Francisco (iOS) / Roboto (Android) — the platform default, always.

**Character:** The typography is functional and unhurried. No decorative fonts, no display faces — just the system typeface at carefully chosen sizes and weights. This is a health app, not a magazine; legibility and comfort outrank personality at the type level. The personality comes from spacing and color.

### Hierarchy

- **Display** (700, 32px/40px): Hero headlines on key screens. Rarely used — only for major section openers like "Welcome back!" on the home dashboard.
- **H1** (700, 24px/32px): Screen titles. The heaviest type in regular use. Used once per screen at the top.
- **H2** (700, 20px/28px): Section headings within screens. "Quick Actions", "Recommended Products", "Upcoming Consultations".
- **H3** (600, 18px/24px): Subsection headings and prominent labels. Card titles, list group headers.
- **H4** (600, 16px/22px): Inline emphasis. Doctor names, product names, concise labels that need weight without size.
- **Body Large** (400, 16px/24px): Primary reading text for descriptions, consultations details, and longer content blocks.
- **Body** (400, 14px/20px): The workhorse. Default text for most UI — list items, form labels, secondary content.
- **Body Small** (400, 12px/16px): Supporting text — timestamps, secondary metadata, hint text below inputs.
- **Caption** (400, 11px/14px): The smallest text. Used for badges, fine print, and the lightest informational layer.
- **Button** (600, 16px/20px): Button labels. Semi-bold for confidence without shouting.
- **Label** (600, 12px/16px): Tab labels, chip text, and small interactive labels. Same weight as Button but smaller.
- **Price** (700, 18px/24px): Product prices in the shop module. Bold to draw the eye to cost information.

### Named Rules

**The Comfortable Size Rule.** Body text never drops below 14px. This is a wellness app used during personal health moments — squinting at tiny text undermines the sense of care. Supporting text can go to 12px, but primary reading content stays at 14px or above.

**The Weight Discipline Rule.** Only three weights in play: 400 (body), 600 (emphasis/labels), 700 (headings). No light, no extra-bold, no black. The system typeface handles personality through size and spacing, not weight variation.

## 4. Elevation

The system uses tonal layering as its primary depth strategy. Surfaces are flat by default; depth is conveyed through background color shifts (background-primary → background-secondary → surface-default → surface-elevated). Shadows exist but play a supporting role — subtle ambient lifts on elevated cards, not structural depth cues.

This keeps the interface calm and grounded. The apothecary shelf is flat wood, not a multi-tiered glass display case.

### Shadow Vocabulary

- **Small** (`shadowOffset: {0, 1}, shadowOpacity: 0.05, shadowRadius: 2`): Ambient lift on chips and small interactive elements. Barely perceptible — felt more than seen.
- **Medium** (`shadowOffset: {0, 2}, shadowOpacity: 0.1, shadowRadius: 4`): Elevated cards and modal containers. The standard depth cue for elements that float above the base layer.
- **Large** (`shadowOffset: {0, 4}, shadowOpacity: 0.15, shadowRadius: 8`): Full-screen modals and bottom sheets. The deepest shadow in the system — still restrained, never dramatic.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on elevated containers (cards, modals, sheets) and interactive press states. Never add shadows to text, icons, or inline elements — depth belongs to containers, not content.

## 5. Components

### Buttons

The button system is confident and functional — bold green for primary actions, soft tints for secondary, transparent for ghost interactions.

- **Shape:** Gently rounded corners (8px radius). Not pill-shaped, not sharp — the apothecary's measured precision.
- **Primary:** Forest green background (#2D6A4F) with white text. Padding: 12px vertical, 16px horizontal. Pressed state deepens to #1B4332.
- **Secondary:** Mint wash background (#D1FAE5) with forest green text. Same dimensions as primary. Used for less critical actions.
- **Outline:** Transparent background with 1.5px forest green border. No fill — the border carries the color.
- **Ghost:** Transparent background, no border. Text-only interaction for inline actions.
- **Sizes:** Small (8px/12px padding), Medium (12px/16px — default), Large (16px/20px).

### Cards

Cards are the primary container pattern, used for product items, consultation banners, and health record entries.

- **Corner Style:** 12px radius — gently curved, not pill-round.
- **Elevated variant:** White background with medium shadow. The default for interactive cards and featured content.
- **Outlined variant:** White background with 1px border (#E5E7EB). Used for secondary or non-interactive cards.
- **Filled variant:** Mist background (#F1F3F5), no border, no shadow. Subtle containers for grouped content.
- **Internal Padding:** 12px (spacing.md) — compact but not cramped.

### Chips

Chips handle filtering and selection across consultations, shop, and health records.

- **Outlined variant:** Transparent background, 1px border, pill-shaped (999px radius). Default unselected state.
- **Filled variant:** Forest green background, white text. Selected state — the green fills the pill.
- **Padding:** 8px vertical, 12px horizontal. Compact enough to fit several in a row.

### Inputs

Text inputs are clean and functional with clear focus and error states.

- **Style:** White background, 1px border (#E5E7EB), 8px radius. Standard height with 12px padding.
- **Focus:** Border shifts to forest green (#2D6A4F) with a subtle glow. The transition is immediate, not animated.
- **Error:** Border shifts to error red (#DC2626) with a red helper text below.
- **Placeholder:** Fog color (#9CA3AF) — readable but clearly secondary.

### Tab Bar

The bottom navigation bar anchors the app's five main sections.

- **Style:** White background with a 1px top border (#E5E7EB). Five equal-width tabs.
- **Active state:** Forest green icon and semi-bold label. The green is the only color accent in the bar.
- **Inactive state:** Fog-colored icon (#9CA3AF) and regular-weight label. Clearly secondary.
- **Icons:** 24x24px, stroke-style. Consistent weight across all five tabs.
- **Label:** 12px body-small, centered below icon with 4px gap.

### Toast

Transient notifications that slide in from the top.

- **Style:** Rounded corners (12px), medium shadow, white background. Max width with horizontal padding.
- **Success:** Green-tinted left border or icon accent.
- **Error:** Red-tinted variant for error toasts.
- **Duration:** Auto-dismiss after a few seconds, with a close button for manual dismissal.

### Modal / Bottom Sheet

Full-screen and half-screen overlays for confirmations, filters, and detailed views.

- **Modal:** Full-screen with white background, slide-up animation. Header with title and close button.
- **Bottom Sheet:** Half-screen with rounded top corners (20px radius). Used for filter sheets and action menus.
- **Overlay:** Semi-transparent black backdrop (#000 at 50% opacity) behind both.

## 6. Do's and Don'ts

### Do:

- **Do** use the primary green (#2D6A4F) as the singular brand anchor — it should be immediately recognizable as Amrutam.
- **Do** keep body text at 14px or above — this is a wellness app used during personal health moments; legibility is care.
- **Do** use tonal layering (background color shifts) to convey depth instead of heavy shadows.
- **Do** maintain generous whitespace — the apothecary shelf is organized, not crowded.
- **Do** use the system typeface at the defined sizes and weights — no custom fonts needed.
- **Do** let status colors harmonize with the green family — success uses the same green, warnings use amber that sits adjacent.
- **Do** use pill-shaped chips for filters and selection — they're compact and visually distinct.
- **Do** keep the tab bar clean with five tabs maximum — one green active state, four fog-colored inactive states.

### Don't:

- **Don't** use generic telemedicine aesthetics — no clinical blue-white palettes, no insurance-form layouts, no checkbox-heavy interfaces. The user explicitly rejected the "1mg/Practo look."
- **Don't** add `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, or alerts. Never intentional.
- **Don't** use `background-clip: text` with gradients — gradient text is decorative, never meaningful. Use a single solid color.
- **Don't** over-round cards. Cards top out at 12px radius. Full-pill (999px) is for chips and buttons only.
- **Don't** pair a 1px border with a wide box-shadow (≥16px blur) on the same element — pick one depth cue, not both.
- **Don't** use warm-tinted cream/sand/beige backgrounds — the body bg is a cool near-white (#F8F9FA), not the "saturated AI default" warm-neutral.
- **Don't** animate layout properties unless truly needed — state changes should be immediate or use simple opacity/color transitions.
- **Don't** put shadows on text, icons, or inline elements — depth belongs to containers, not content.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding — numbers earn their place only when order carries information.
- **Don't** add tiny uppercase tracked eyebrows above every section — one kicker as a deliberate system is voice; an eyebrow on every section is AI grammar.
- **Don't** use identical card grids with icon + heading + text repeated endlessly — vary the card treatments based on content.
