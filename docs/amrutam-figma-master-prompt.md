# AMRUTAM — Ayurvedic Super App
## Master Design Prompt for Figma AI / Any AI Design Agent

> **What this is:** A single, self-contained, paste-ready prompt (Section A) that gives any AI design agent (Figma Make / First Draft, Galileo, Uizard, Lovable, v0, Relume, Anthropic/OpenAI agents, etc.) full context, a complete design system, and a screen-by-screen specification to produce **fully detailed, developer-ready mobile UI designs** — not just attractive screens.
>
> **How to use:**
> - **Figma Make / First Draft / Uizard / any design tool:** paste **Section A** (everything between `=== MASTER PROMPT START ===` and `=== MASTER PROMPT END ===`).
> - **Long-context agents (Claude, ChatGPT, Cursor, etc.):** the whole file works as context — pasting the master section plus the checklist is enough.
> - **Token-limited tools:** use **Section B (Compact Prompt)**.
> - **Iterating later:** use the **Section C (Iteration Snippets)** to regenerate single screens without losing the design system.

---

## BACKGROUND — Why this design exists (give this context to the agent)

This is a **senior-level React Native hiring assignment** by **Amrutam**, an Ayurvedic wellness company. The brief: build a *production-ready Ayurvedic Super App* with **3 independent modules — Consultation, Shop, Health Records** — in 72 hours. The assessment explicitly says the focus is **"architecture, scalability, performance, and developer experience, not pixel-perfect UI."**

The grading weights the agent should keep in mind:

| Area | Weight | Design implication |
|---|---|---|
| Architecture | 20% | Component-driven design system; reusable components; consistent naming |
| Code quality & maintainability | 20% | Auto-layout everywhere; tokens/variables; no stray duplicates |
| Performance & scalability | 20% | Lists must visually support virtualization & infinite scroll (skeletons, load-more, result counts) |
| Offline & error handling | 15% | **Design the failure states — offline banner, queued bookings, sync, timeout, session expiry** |
| State management & data flow | 10% | Cart, filters, and tabs must show selected/active states clearly |
| Testing | 5% | — |
| Documentation | 5% | Frames named + annotated so a dev can implement without guessing |
| UX, accessibility & polish | 5% | Calm, healthcare-grade polish; accessible; dark mode |

**Design directive:** This must look like a **serious, trustworthy digital-health product** (like Practo, Tata 1mg, Netmeds, PharmEasy, or a premium wellness brand) — *not* a decorative Dribbble concept. Calm, organized, component-driven, developer-friendly.

---

## SECTION A — MASTER PROMPT (paste this)

=== MASTER PROMPT START ===

You are a **senior product designer and design-system architect** working at **Amrutam**, an Ayurvedic wellness company. You are designing the mobile app: an **Ayurvedic Super App** with three modules — **Consultation** (book Ayurvedic doctors), **Shop** (Ayurvedic products e-commerce), and **Health Records** (patient medical timeline). This is a **developer-ready UI blueprint** for a senior React Native implementation: a hiring assessment where the evaluators grade architecture, scalability, performance, offline behavior, and developer experience. Your designs are the contract the developers implement from — **precision, consistency, and completeness matter more than decorative flair.**

### 1. PRODUCT & BRAND

- **App name:** Amrutam — "Ayurvedic Super App" (tagline: *"Your complete Ayurvedic wellness companion"*)
- **Business:** Online Ayurvedic consultations + authenticated Ayurvedic products + personal health-record vault.
- **Target users:** Health-conscious adults 25–55 in India (urban, mobile-first, smartphone-only). Familiar with apps like Practo, Tata 1mg, Netmeds, PharmEasy.
- **Tone:** calm, clinical-but-warm, trusted, natural. Ayurvedic heritage + modern app polish. **Not** mystical/ornate, **not** playful.
- **Market note:** Use **₹ (INR)** pricing (the brand is Indian). If a Nigeria/localization variant is requested, swap currency to **₦** everywhere consistently — never mix.
- **Platform:** iOS-first mobile app, 390×844 pt frames (iPhone 14-class), 1x scale, **safe area 59pt top / 34pt bottom**, side padding 16pt, 4pt spacing grid.

### 2. SCOPE — WHAT TO DELIVER

Build **7 Figma pages** (in this order):

| Page | Contents | Frames |
|---|---|---|
| **01 — Design System** | Tokens, typography, all components with variants (light + dark) | ~35 components |
| **02 — App Foundation** | Splash, onboarding, auth set, Home dashboard, Notifications, Profile, Settings | 12 frames |
| **03 — Consultation** | Discover, list, search, filters, details, slots, booking flow, manage/cancel | 15 frames |
| **04 — Shop** | Home, listing, search, filters, sort, details, wishlist, cart, checkout | 14 frames |
| **05 — Health Records** | Home, timeline, filters, tags, search, 5 record types, attachment previews | 14 frames |
| **06 — System States** | Loading, empty, error, offline, sync, session, toasts, error boundary | 14 frames |
| **07 — Prototype Flows** | 3 connected clickable flows | 3 flow strips |

**Total ≈ 70 frames + components.** Render every frame in **Light mode**; additionally render **Dark-mode variants for these 12 key frames**: Home, Doctor Listing, Doctor Details, Slot Selection, Booking Confirmation, Shop Home, Product Listing, Product Details, Cart, Checkout Summary, Health Records Timeline, Record Details. (Use your token variables for the swap — do not hand-recolor.)

If the tool has frame/screen limits, **priority order** is: 01 Design System → the 25 "must-have" screens listed in §11 → states → the rest.

### 3. DESIGN SYSTEM — TOKENS (create as Figma variables)

**Colors (Light theme)**
- Primary: `#1B5E3A` (deep ayurvedic green) · Primary pressed `#144A2E` · Primary soft `#E8F3EC` (tint bg)
- Accent / Gold: `#C98A2D` (turmeric/brass — used sparingly: ratings, highlights, premium badges)
- Background: `#F7F8F6` (warm off-white) · Surface: `#FFFFFF` · Surface secondary: `#F1F4F1`
- Text primary: `#17251D` · Text secondary: `#5B6B61` · Text disabled: `#A9B4AC`
- Success `#2E9E63` · Warning `#E8A33D` · Error `#D9534F` · Info `#3D7AA6`
- Border `#E3E8E4` · Divider `#EDF1EE` · Overlay `rgba(23,37,29,0.55)`
- **Dark theme:** Background `#0F1512` · Surface `#17201B` · Surface 2 `#1F2A23` · Text primary `#EDF3EE` · Text secondary `#A8B5AC` · Primary `#5FBF8A` · Primary soft `#1E3A2C` · Border `#2A362F` · Success `#4CC48A` · Warning `#E8B45A` · Error `#E37B77` · Info `#6FA8CE`

**Typography** (single family, humanist sans — **Poppins** for display/headings, **Inter** for body; if one family only, use Poppins)

| Token | Size/Line | Weight | Use |
|---|---|---|---|
| Display | 32/40 | 700 | Hero numbers, large success screens, splash tagline |
| H1 | 26/34 | 700 | Screen titles |
| H2 | 22/30 | 700 | Section titles |
| H3 | 18/26 | 600 | Card titles, doctor/product names |
| Body Large | 16/24 | 400 | Descriptions |
| Body | 14/20 | 400 | Default body |
| Body Small | 12/16 | 400 | Metadata |
| Caption | 11/14 | 400 | Timestamps, labels under icons |
| Button | 15/20 | 600 | Buttons |
| Label | 12/16 | 600 | Chips, tabs, overlines, app-bar title? (app-bar = H3) |

**Other tokens:** Radius — sm 8, md 12, lg 16, xl 24, pill 999, sheet-top 24. Spacing — 4/8/12/16/20/24/32/40/48. Shadows (mobile-soft): `0 2 8 rgba(0,0,0,.06)`, `0 6 16 rgba(0,0,0,.08)`, `0 12 28 rgba(0,0,0,.10)`. Icons — one consistent **outline/stroke family** (Lucide or Phosphor), 24px grid, 1.5–2px stroke, never emoji as UI icons. Touch targets ≥ 44×44pt.

### 4. COMPONENT LIBRARY (build these first; every screen reuses them — never redraw)

For each: **variant combinations** for all states, correct dark-mode tokens, Auto Layout, and clear naming like `Buttons / Primary / Default`:

1. **Buttons** — primary, secondary (outline), ghost (text), destructive (red solid/outline), icon-only; sizes lg(52)/md(44)/sm(36); states default / pressed / disabled / **loading** (spinner, label stays) / full-width.
2. **Search bar** — default / focused (primary border + caret) / filled-with-text / clear (×) button; leading search icon; optional trailing filter-icon variant.
3. **Text input** — label + field + helper/error text; default / focus / error / disabled; optional suffix (eye toggle for password).
4. **Filter chip** (rounded pill) — unselected / selected (Primary soft bg + Primary text + check icon) / disabled; with optional leading icon or count badge (`Filters (2)`).
5. **Category chip / tile** — rectangular tile with icon + label; unselected / selected.
6. **Tabs** — scrollable top tabs (underline style, 2px, active = Primary) & segmented control (e.g., `Upcoming | Past`).
7. **Bottom navigation** — 5 items: Home, Consultations, Shop, Records, Profile; 24px icons, 2px active stroke / active color fill, active = Primary, inactive = Text-disabled; badge (up to 99+) on notif/records; 64pt tall + home-indicator area.
8. **App bar** — back chevron (44pt target), title (H3), optional right actions (share, more-horizontal, bell with badge). Titles truncate with ellipsis on long names.
9. **Doctor card** — avatar 56pt (photo), name + specialisation, meta row (★ rating gold, • years exp, • consults), "Next available: Today, 4:30 PM", CTA `[View Profile]` (ghost/sm); variant: horizontal compact (for home).
10. **Product card** — square image 1:1 (white-bg studio shot), wishlist heart top-right (filled red when saved), name (2-line clamp), rating row, price row (₹ bold + old price strike/30% OFF green badge), optional "Add" quick-add button; variant: horizontal list card (for cart).
11. **Record card** — leading type icon in soft-tinted square, title, subtitle (doctor/summary), trailing date + chevron; variants per type with distinct tint: Lab (blue), Prescription (green), Consultation (purple), Vaccination (teal), Allergy (amber).
12. **Date selector** — horizontal 7-day strip: weekday (Mon) + date (12), states: default / selected (Primary filled, white text) / disabled (past, faded) / today-outline.
13. **Time slot button** — grid cell: Available (outline) / Selected (Primary filled) / Unavailable (scratched style, faded, strike) / **Expired** (faded + "Expired" tag) — the assessment *explicitly* requires expired-slot handling.
14. **Quantity stepper** — − qty +, 32pt buttons, disabled at 1 / max.
15. **Rating** — static stars (gold) with score text; half-star support; optional interactive.
16. **Badge** — info (Sale/OFF%, Verified ✓, New, Bestseller), dot badge, count badge; colors semantic.
17. **Avatar** — photo / initials fallback / online-presence dot.
18. **Modal / Alert dialog** — title + body + 1–2 actions; destructive variant for cancel/remove; focus on the primary alert.
19. **Bottom sheet** — drag handle, title + subtext, scrollable content, **sticky footer** with actions; used for all filters, sort, cancel-confirm, tags.
20. **Toast** — top/bottom, icon + message + optional action; success / error / info / warning variants; include "undo" action variant.
21. **Skeleton loader** — shimmer placeholder blocks matching list-card, product-grid card, record card, detail hero, timeline row.
22. **Empty state** — icon in soft circle (56pt), title (H2/H3), supporting copy, primary CTA; center-aligned, generous spacing.
23. **Error state** — icon (cloud-off / alert / timer / file-broken per cause), title, copy, `[Try Again]`.
24. **Offline banner** — full-width, 28-32pt, icon + one-liner; persistent top placement below app bar.
25. **Sync indicator** — pill with spinner: "Syncing…" / "✓ Synced" / "Sync failed · Retry".
26. **Section header** — title (H2) + `See all` ghost link.
27. **List item** (profile menu) — icon, label, chevron; destructive variant (Logout, red).
28. **Notification item** — type icon, title, body (2-line clamp), time, unread dot (Primary).
29. **Legend / status legend** (slot states) — small dot+label row for "Available / Unavailable / Selected / Expired".
30. **Attachment thumbnail** — image thumb 64–88pt rounded; PDF (icon + filename + page count + file size); reusable across record details and viewers.
31. **FAB / floating action** — only if needed; otherwise skip (keep UI calm).
32. **Privacy/secure badge** – small "Encrypted" lock chip for health records (trust signal).

### 5. SCREEN SPECS — APP FOUNDATION (Page 02)

Common: light background; content column 16pt margins; components pulled from §4.

- **F01 Splash** — solid Primary background; white wordmark/leaf logo (use a clean lotus/amla-leaf mark), tagline, subtle centered spinner at bottom. (400ms feel.)
- **F02 Onboarding** (3 slides, optional but recommended) — full-bleed illustration on soft tint, headline, 1-line subtext, progress dots, `[Skip]` + `[Continue]`; slide 3 CTA = `[Get Started]`. Topics: (1) Consult certified Vaidyas, (2) Shop authentic Ayurveda, (3) All health records, one timeline.
- **F03 Sign In** — logo, "Welcome back", email + password inputs (show/hide), `[Forgot password?]` link, primary `[Sign In]`, divider "or", `[Continue with Google]`, footer "New here? **Create account**". Include **loading** variant (spinner inside button) and **error** variant (inline error text under password: "Invalid credentials").
- **F04 Sign Up** — name, email, phone (+91 flag), password, terms checkbox, `[Create Account]`.
- **F05 Forgot Password** — email input, `[Send Reset Link]`, success toast variant.
- **F06 OTP Verification** — 6 digit boxes (auto-advance), resend timer (00:42), `[Verify]`; variant: error state ("Incorrect code. 2 attempts left").
- **F07 Reset Password** — new password + confirm, strength meter, `[Update Password]`.
- **F08 Home Dashboard** — app bar: greeting "Good morning, **Ananya**" + bell icon with badge; **offline banner slot**; primary card: **Upcoming Consultation** (doctor avatar, name, "Ayurvedic Physician", "Today • 4:30 PM", buttons `[View]` + `[Reschedule]`); **Quick Actions** (3 tiles: Consult a Doctor / Health Records / Shop — icon + label); **Recommended for you** (`See all` → horizontal product cards); **Recent Health Records** (2-3 record cards); bottom nav.
- **F09 Notifications** — app bar "Notifications" + `[Mark all as read]`; sections **Today / Yesterday / Earlier**; notification items (reminder, booking confirmed, booking cancelled, record added, order shipped, order delivered); unread dots; empty variant.
- **F10 Profile** — header card (avatar 72pt, name, email, `[Edit]`), **Health summary strip** (3 stats: Consults / Orders / Records), menu list (Personal Information, Health Information, Notifications, Appearance, Privacy, Help & Support), `[Logout]` destructive, app version footer.
- **F11 Edit Profile** — avatar with camera badge, name, email, phone, dob, gender, `[Save]`.
- **F12 Settings** — grouped list: **Account** (Profile, Health Info, Addresses), **Preferences** (Notifications `[on/off]`, **Appearance: Light / Dark / System** segmented — *dark mode is a hard requirement of the assessment*, Language: English / हिन्दी), **Privacy & Security** (Biometric lock, change password), **Support** (Help & FAQ, Contact, About), plus Success/Info version of "App version 1.0.2".

### 6. SCREEN SPECS — CONSULTATION (Page 03)

The required journey: **Doctor → Search → Filter → Details → Slots → Book → Upcoming → Cancel**, incl. slot conflict, expired slot, double-booking, offline queued booking.

- **C01 Consultation Home** — app bar "Consultations"; subtitle "Find the right Ayurvedic doctor for you."; search bar; **specialty chips** (All, Ayurvedic Physician, Panchakarma, Skin & Hair, Nutrition, Digestion); **Upcoming consultation** card (compact); **Recommended doctors** — 3 doctor cards (horizontal scroll); bottom nav.
- **C02 Doctor Listing** — app bar "Doctors" + result count line ("1,248 doctors"); search bar; control row: `[Filter (2)]` chip-style button + `[Sort: Recommended ▾]`; virtualized list of doctor cards; **load-more skeleton row** at bottom + "Showing 60 of 1,248"; empty variant ("No doctors found").
- **C03 Doctor Search** — search screen: focused input auto-opens; **Recent searches** chips (Ayurvedic Physician, Dr. Sharma, Skin); results list; **empty state** ("No doctors found for 'xyz' — Try another name or specialization"); **recently viewed** section when query empty.
- **C04 Doctor Filters (bottom sheet)** — sections: **Specialization** (checkbox chips, multi-select), **Experience** (radio: Any / 1–5 / 5–10 / 10+ yrs), **Availability** (radio: Available today / This week), **Consultation type** (Online / In-clinic), **Rating** (4.5+, 4.0+); footer: `[Reset]` ghost + `[Apply Filters]` primary; live "N results" count in footer.
- **C05 Doctor Details** — app bar: back + "Doctor Profile" (+ share); hero: 96pt avatar, name (H2), specialisation, rating gold + "4.8 · 2,340 consults" + **Verified** badge; info tiles row: Experience 12 yrs | Mode Online | Fee ₹499; **About** (4–5 line bio, readable body); **Consultation info** card (duration 30 min, video/voice modes); **Available dates** (7-day selector); **Available times** (3-col slot grid with legend); sticky bottom CTA `[Select Time]`; variants: slots skeleton (simulated lazy load), "No slots left today" inline notice, doctor away (disabled dates).
- **C06 Select Consultation Slot** — full-screen: date selector (7-day); **time slot grid with all four states visible** (Available, Selected, Unavailable, Expired) + legend row; selected slot summary chip ("Wed, Aug 26 • 4:30 PM"); CTA `[Continue]` enabled only when selected. (Slots load lazily per date — show skeleton grid between date switches.)
- **C07 Booking Confirmation** — sheet or screen: "Confirm Consultation"; doctor summary row (avatar + name + spec); detail rows (Date, Time, Duration 30 min, Type Online, Fee ₹499, Payment: Pay after consult / Pay now); **Consent note** (small); CTA `[Confirm Booking]` with loading variant (spinner + "Booking…").
- **C08 Booking Success** — full-screen success: big check in Primary-soft circle, "Consultation booked!", "Your consultation with Dr. Ananya Sharma is confirmed.", date/time card, `[View Consultation]` primary + `[Back to Home]` ghost; **confetti not needed — keep clinical-calm**.
- **C09 Booking Conflict** — alert/modal: warning icon, "Unable to book this slot", "This time slot is no longer available — another appointment may have taken it.", `[Choose Another Slot]` primary + `[Close]`. (This is the double-booking/slot-conflict requirement — make it explicit and calm.)
- **C10 Slot Expired** — modal: clock icon, "Slot expired", "This consultation slot has already passed.", `[Choose Another Time]` primary. (Must look *distinct* from conflict.)
- **C11 Upcoming Consultations** — segmented tabs **Upcoming | Past**; Upcoming cards: doctor, date • time, status chip (Confirmed / **Pending sync** — the offline-queued booking, with cloud icon) + `[View Details]`; Past cards show "Completed" / "Cancelled" chip + `[Rate Doctor]` when applicable; empty state ("No consultations yet" + CTA).
- **C12 Consultation Details** — app bar back + "Consultation Details"; doctor header; details list (Date, Time, Duration, Mode, Fee, Booking ID AMT-8241, Status); **Join consultation** primary CTA (enabled 15 min before start) + **Cancel Consultation** destructive outline; variant: past/completed (CTA = `[Rate Doctor]`).
- **C13 Cancel Consultation (bottom sheet)** — warning intent, "Cancel consultation?", "Are you sure you want to cancel your consultation with Dr. Ananya Sharma on Aug 26, 4:30 PM?", `[Keep Consultation]` ghost + `[Cancel Consultation]` destructive.
- **C14 Cancellation Success** — success screen: "Consultation cancelled", "Your consultation has been cancelled. You'll receive a confirmation by SMS.", `[Back to Consultations]`.
- **C15 (Optional, mark [Extra]) Join Consultation room** — pre-call screen: doctor video tile (placeholder), patient tile, call controls (mute/camera/end), timer chips.
- **C16 (Optional, mark [Extra]) Rate Doctor** — 5 stars + reason chips + `[Submit]`.

**Offline behavior to show in this module:** booking CTA clicked while offline → **ST06 queued-bookings sheet**; tab C11 shows "Pending sync" chip; C13 while offline → confirm-cancel is queued with toast "Cancellation queued — will sync when online".

### 7. SCREEN SPECS — SHOP (Page 04)

Required: product list, **infinite scroll**, search, **multi-filter**, **sorting**, details, cart, quantity updates, wishlist, **checkout summary**; **cart persisted locally** (offline-cart is a real requirement).

- **S01 Shop Home** — app bar "Shop"; subtitle "Authentic Ayurvedic products for everyday wellness."; search bar; **category tiles** (2-row grid or horizontal scroll): Immunity, Digestion, Skin Care, Hair Care, Stress & Sleep, Herbal Juices, Women's Wellness, Oils; **Featured products** ("Bestsellers") — 2-col product cards; **Shop by concern** strip chips (e.g., Better sleep, Hair fall, Acidity, Immunity) *requires* data mapping — keep simple; bottom nav.
- **S02 Product Listing** — app bar "Products" + result count ("4,200 products"); search; control row `[Filter (3)]` + `[Sort ▾]`; **infinite-scroll 2-column grid**: 40 items initial, ~20 skeleton cards appended at bottom + spinner row + "You're all caught up" end-cap after last page; price sliders? No — filters are in sheet; card = image, wishlist heart, name (2-line), rating, price + MRP strike + % OFF badge; empty variant.
- **S03 Product Search** — input autofocused; **recent searches** (chips + clear); **trending searches**; live results list (2-col grid); empty state ("No products found for 'xyz'" + suggestions); variant: scanning/typing state.
- **S04 Product Filters (bottom sheet)** — **Category** (multi checkbox chips), **Price range** (dual slider ₹0–₹5,000), **Rating** (radio 4+ / 3+), **Discount** (checkboxes 10%+, 25%+, 40%+), **Availability** (In stock / Offers only); footer `[Reset]` + `[Apply]` + live count. Selected filter chips appear as removable chips above the grid on S02.
- **S05 Sort Products (bottom sheet)** — radio list: Recommended (default), Price: Low to High, Price: High to Low, Highest Rated, Newest, Discount; check icon on selected; single-select, apply-on-tap.
- **S06 Product Details** — app bar back + `[♡]`; **image gallery** (pager dots, pinch hint); title (H2), rating + "128 reviews", price row (₹499 + ₹649 strike + 23% OFF green chip), offers/bundles strip (optional), **Quantity stepper**, key **Benefits** (3 short bullets with leaf icons), **Description**, **Product info** (veg badge, size, batch/expiry, shelf life), **How to use** small, **You may also like** row; sticky bottom bar: `[♡]` icon + `[Add to Cart]` primary with price ("Add to Cart · ₹499"); variants: **loading skeleton**, **out of stock** (disabled CTA + "Notify me").
- **S07 Wishlist** — app bar "Wishlist" + count; grid of saved product cards with heart filled; `[Move all to cart]`; **empty state** ("Your wishlist is empty — Save products you want to come back to later." + `[Explore Products]`).
- **S08 Cart** — app bar "Cart (2)"; **offline notice variant**: info banner "You're offline — your cart is saved on this device."; cart item cards: 72pt image, name, variant (size), unit price, quantity stepper, line total, `[Remove]`; **recommended add-ons** ("Frequently bought together" horizontal); summary footer: Subtotal + `[Checkout]`; swipe-to-delete + `Remove` confirmation modal (S10).
- **S09 Empty Cart** — cart icon, "Your cart is empty", "Explore our Ayurvedic products and add something to your cart.", `[Start Shopping]`.
- **S10 Remove Item Confirm (modal)** — "Remove item?", "Remove Ashwagandha Capsules from your cart?", `[Keep]` + `[Remove]` destructive; **undo toast** variant after removal.
- **S11 Checkout Summary** — header "Checkout"; **Items** section (compact rows: thumb, name × qty, line total); **Delivery address** card (name, address, phone, `[Change]`); **Price details**: Subtotal, Delivery (Free over ₹999 else ₹49 — show "FREE" green), Discount (if any), **Total** bold; payment method row (UPI / Card / COD — radio, but **no full payment screens**: assessment only requires summary); offline variant: queue notice "Order will be placed when you're back online"; CTA `[Place Order · ₹549]` with loading state.
- **S12 Order Success** — check icon, "Order confirmed!", "Your order #AMT-84521 has been placed successfully.", delivery ETA card, `[View Order]` + `[Continue Shopping]`.
- **S13 Order Failed** — alert icon, "Couldn't place order", "Your payment wasn't processed. No amount was deducted.", `[Try Again]` + `[Back to Cart]`.

### 8. SCREEN SPECS — HEALTH RECORDS (Page 05)

Required: patient **timeline**, filters, search, **tags**, **attachment previews (image + PDF thumbnails)**, **month/year grouping**. Record types: Lab Report, Prescription, Consultation, Vaccination, Allergy.

- **R01 Records Home** — app bar "Health Records" + trusted chip ("Encrypted"); search bar ("Search your health records"); **type filter chips**: All · Lab · Prescription · Consultation · Vaccination · Allergy (with counts); **timeline preview** grouped by month (Aug 2026 → 3 records, Jul 2026 → 1 record) with `[View all]`; **storage meter card** small (e.g., "24 records · 86 MB used") for trust; empty state ("No records yet — Your reports, prescriptions & more will appear here.").
- **R02 Full Timeline** — app bar "Health Records"; search; row: `[Filter]` + `[Tags]` buttons + active-filter chips; **sticky month headers** ("AUGUST 2026", "JULY 2026") with a **vertical timeline rail** (dot + connecting line, type-colored dots); records as R-components; **lazy-load skeleton rows** on scroll (demonstrates virtualization/performance requirement); end-cap "You've reached the beginning — 24 records".
- **R03 Record Filters (bottom sheet)** — **Record type** multi-check (5 types with tinted icons), **Date range** (From / To date fields or preset chips: Last 30 days / 6 months / 1 year / This year), `[Reset]` + `[Apply]`.
- **R04 Tags Filter (bottom sheet)** — tag cloud multi-select: Routine, Follow-up, Chronic, Blood Test, Medication, Allergy, Vaccination, Prevention, Annual; selected tags shown as chips on R02.
- **R05 Record Search** — recent searches, results list with type icons + highlighted match (do not over-style highlight — use bold), empty state ("No records match 'fever'").
- **R06 Lab Report Details** — app bar back + `[Share]` (actions: share/download — icons only); type badge "Lab Report" (blue tint); title "Complete Blood Count (CBC)"; meta (Aug 24, 2026 · Dr. Ananya Sharma · Sun Diagnostics); **Results table** (parameter / value / ref range / flag ↑↓ colored) — 6-8 rows; **Doctor's summary** callout; **Attachments**: PDF thumbnail card + image thumbnail (2 attachments) — tap → R11/R12; `[Download]` secondary CTA.
- **R07 Prescription Details** — type badge "Prescription"; title "Ayurvedic prescription — Digestion & Agni"; meta (Aug 10, 2026 · Dr. Ananya Sharma); **Medication list** cards: name (Ashwagandha Tablets), dose (1 tablet), frequency (2× daily after meals), duration (30 days); timing pills (Morning/Evening); **Instructions** note; attachments optional; follow-up chip "Follow-up in 30 days".
- **R08 Consultation Record Details** — type badge "Consultation"; title "Consultation — Dr. Ananya Sharma"; meta (Aug 18, 2026 · online · 30 min); **Reason for visit**; **Clinical notes**; **Recommendations** (bulleted); **Prescribed medicines** link chips; `[Book Follow-up]` secondary CTA.
- **R09 Vaccination Details** — type badge "Vaccination"; vaccine "Tetanus Booster (Td)"; date Aug 20, 2024 (or Jul 20, 2026); **Next dose** card with countdown ("Next booster due: 2036"); provider; batch no.; `[Set Reminder]`.
- **R10 Allergy Details** — type badge "Allergy" (amber); allergen "Peanuts" + reaction "Mild itching, rash"; **Severity meter** (Mild/Mod/Severe — colored); "Recorded Aug 12, 2026"; notes; `[Edit]`.
- **R11 Attachment Preview — Image** — full-screen image viewer (dark overlay, image centered, pinch-to-zoom hint chip), top bar: back, filename "CBC_Report_p3.png", actions download/share; next/prev chevrons if multi-page.
- **R12 Attachment Preview — PDF** — dark viewer, **mini page-previews strip** (thumbnails) + single page view 1:1, filename + page count "CBC_Aug24.pdf · 4 pages", actions `[Share]` + `[Download]`; "Open with" secondary row (Google Drive, WhatsApp, Print) — icon row only.

### 9. SCREEN SPECS — SYSTEM STATES (Page 06)

**This page is critical: the assessment explicitly grades offline & error handling.** Build every one of these as real frames, not afterthoughts. Use consistent componentry (§4 #21–25).

- **ST01 Loading skeletons:** (a) doctor list, (b) product grid (6 cells), (c) record timeline rows, (d) detail hero + blocks, (e) slot grid.
- **ST02 Full-screen loader** — centered spinner + label ("Loading doctors…"); and **pull-to-refresh** indicator (arrow → spinner) on list screens.
- **ST03 Empty states:** no doctors / no products / no records / no search results / no slots available / empty cart / empty wishlist / no notifications / no consultations. Each: icon + title + copy + one CTA, consistent layout.
- **ST04 Errors (each with cause icon + `[Try Again]`):** general ("Something went wrong"), **network** ("No internet connection"), **server** ("Server is busy — try again in a moment" 5xx), **timeout** ("Request timed out — your connection took too long"), **invalid response** ("We received an unexpected response — pull to refresh"), **partial content** ("Some items couldn't load — showing available results" inline notice, not a full screen).
- **ST05 Offline states:** (a) **persistent banner** "You're offline — features may be limited. Changes will sync when you're back online." on top of any screen; (b) **full offline screen** (for first-load): cloud-off icon, "You're offline", "We couldn't load this right now. Check your connection or view saved data.", `[View Saved Data]` + `[Retry]`.
- **ST06 Booking queued (offline)** — sheet: cloud icon, "Booking saved", "You're offline, so your booking request has been queued. We'll confirm it automatically once you're back online.", `[View Pending Bookings]` + `[Done]`; plus a **Pending bookings list** screen variant (queue with times, status "Waiting for sync").
- **ST07 Syncing** — pill/banner with animated spinner: "Syncing… Updating your latest information."
- **ST08 Sync complete** — toast/banner: ✓ "Synced — Your information is up to date."
- **ST09 Sync failed** — banner: ⚠ "Sync failed — changes kept on this device." + `[Retry]`.
- **ST10 Session expired** — full-screen (or modal): lock icon, "Session expired", "Please sign in again to continue.", `[Sign In]`.
- **ST11 Global error boundary** — app-level screen: "Something went wrong", "The app hit an unexpected error. Your data is safe.", `[Try Again]` + `[Report]` ghost.
- **ST12 Toast gallery** — success / error / info / warning, top and bottom placements, with/without action ("Undo", "View").
- **ST13 Offline cart notice** — banner on Cart screen (also show queued-order state: "Order #84521 queued — placing when online").

### 10. PROTOTYPE FLOWS (Page 07) — connect these with real hotspots

**Flow 1 — Consultation:** Home → (Consult a Doctor) C01 → (doctor card) C05 → (Select Time) C06 → (Continue) C07 → (Confirm Booking) C08 → (View Consultation) C11 → (card) C12 → (Cancel) C13 → C14. *Variant spur:* C07 while offline → ST06.
**Flow 2 — Shop:** Home → (Shop tile) S01 → (product card) S02 → (product) S06 → (Add to Cart) S08 → (Checkout) S11 → (Place Order) S12. *Spurs:* filter sheet C04/S04 → apply; empty cart S09 from S08 after removing all.
**Flow 3 — Health Records:** Home → (Health Records) R01 → (View all) R02 → (filter/tags) R03/R04 → (record) R06 → (PDF thumb) R12.
**Flow 4 (bonus) — Offline booking:** C06 → (book while offline) ST06 → (View Pending) ST07 → ST08 → C11 with "Confirmed".

Connection style: tap hotspots on CTAs/cards exactly as described; set transitions to `Slide-in right` for forward nav, `Slide-out right`/back for back, `Bottom sheet` for sheets/modals. Flow order = left-to-right storyboard strips per flow.

### 11. MUST-HAVE LIST (if you must cut, cut everything else first)

Home (F08) · Doctor Listing (C02) · Doctor Details (C05) · Slot Selection (C06) · Booking Confirmation (C07) · Booking Success (C08) · Booking Conflict (C09) · Expired Slot (C10) · Upcoming Consultations (C11) · Cancellation (C13/C14) · Shop Home (S01) · Product Listing w/ infinite scroll (S02) · Product Details (S06) · Cart (S08) · Checkout Summary (S11) · Order Success (S12) · Health Records Timeline (R02) · Record Details (R06–R10, at least Lab + Prescription) · Attachment Previews (R11/R12) · Search (C03/S03/R05) · Filters (C04/S04/R03) · Empty states (ST03) · Offline banner + queued booking (ST05/ST06) · Error + timeout (ST04) · Session expired (ST10) · Dark mode of the 12 key frames.

### 12. IMPLEMENTATION RULES (non-negotiable)

1. **Auto Layout everywhere** — every frame is laid out with Auto Layout (min 4pt gaps), resizable correctly; nothing absolutely positioned except decorative graphics.
2. **Variables/tokens** — colors, spacing, radius, and typography as named variables/styles; dark mode = token swap, no manual recolors. Typography uses text styles from §3.
3. **Components + variants** — reuse §4 components by *instance*; no detached duplicates; states as variants on a single instance where possible.
4. **Consistent naming:** frames `ID — Screen Name` (`C05 — Doctor Details`); components `Category / Name / State`; text styles `Typography / H1` etc.; pages numbered `01 — Design System` …
5. **Realistic content — no lorem ipsum.** All copy is spelled out below; write final, natural microcopy.
6. **Consistent iconography** — one stroke family, 1.5px, never mixed sets, never emoji.
7. **Images:** use realistic photos — Indian doctors (professional headshots, neutral background), clean white-background product shots, warm lifestyle imagery for home. Label each image layer `[img]` so devs know it's replaceable.
8. **Scannability:** keep ≤ 2–3 type sizes per screen; white space over decoration; hierarchy via weight/size, not color noise.
9. **Accessibility:** contrast ≥ 4.5:1 for text; touch targets ≥ 44pt; states never communicated by color alone (always icon/label + color); text scales to 2× without clipping (use auto-height text and min layout).
10. **Every interactive element has a defined state set** (default/pressed/disabled/loading) even if only shown once in the file.

### 13. REAL DATA TO USE (write these exact-ish values; keep them consistent across frames)

**Doctors (reuse across C02–C14):** Dr. Ananya Sharma — Ayurvedic Physician — ★4.8 — 12 yrs — 2,340 consults — ₹499 — online. · Dr. Rajesh Iyer — Panchakarma — ★4.9 — 15 yrs — ₹699 · Dr. Priya Nair — Skin & Hair (Kustha) — ★4.7 — 9 yrs — ₹549 · Dr. Vikram Mehta — Nutrition & Diet — ★4.6 — 11 yrs — ₹449 · Dr. Kavya Reddy — Pediatrics (Kaumarbhritya) — ★4.6 — 8 yrs — ₹399 · Dr. Sandeep Rao — Digestion & Gut (Agni) — ★4.7 — 13 yrs — ₹499 · Dr. Meera Joshi — Women's Health (Stri Roga) — ★4.8 — 14 yrs — ₹599.

**Products (reuse across S01–S12; ₹ — swap to ₦ if Nigeria variant requested):** Ashwagandha Capsules 60ct ₹499 (was ₹649, 23% OFF, ★4.8, Immunity/Stress) · Triphala Tablets 120ct ₹349 · Brahmi Tablets ₹320 · Amla Juice 1L ₹280 · Chyawanprash 500g ₹425 · Kumkumadi Facial Oil 30ml ₹875 (Skin) · Bhringraj Hair Oil 200ml ₹385 (Hair) · Nalpamaradi Face Pack ₹260 · Giloy (Guduchi) Capsules ₹399 · Shatavari Capsules ₹375 · Karela–Jamun Juice ₹310 · Turmeric Curcumin Tablets ₹450 · Neem Face Wash ₹240 · Aloe Vera Gel ₹220 · Dashmool Churna ₹330 · Trikatu Tablets ₹290.

**Health records (reuse across R01–R12; today = 26 Aug 2026):** Aug 24, 2026 — Lab — Complete Blood Count (CBC) — Dr. Ananya Sharma — 2 attachments (PDF 4 pages + image) · Aug 18 — Consultation — Dr. Ananya Sharma, online · Aug 10 — Prescription — Digestion & Agni (Ashwagandha Tablets 2× daily 30 days) · Jul 20 — Vaccination — Tetanus Booster (Td) — next due 2036 · Jul 12 — Lab — Lipid Profile · Jun 28 — Prescription — Sleep & Stress (Brahmi) · Jun 14 — Consultation — Dr. Sandeep Rao · May 30 — Allergy — Peanuts (Moderate) · May 12 — Vaccination — Influenza · Apr 22 — Lab — Thyroid Profile · Apr 04 — Consultation — Dr. Priya Nair · Mar 18 — Prescription — Skin (Neem + Kumkumadi plan). Tags used: Routine, Follow-up, Chronic, Blood Test, Medication, Allergy, Vaccination, Prevention.

**Booking:** AMT-8241 · slot Wed 26 Aug 4:30 PM · 30 min · Online · ₹499.

### 14. WHAT NOT TO DO

- No glassmorphism, heavy gradients, or Dribbble-style decoration — this is a healthcare product.
- No invented features outside the spec (no chat rooms, no diet plan builder, no tele-call screen beyond #C15 marked [Extra], no full payment flow — summary only).
- No emoji as UI icons; no mixed icon sets; no clipart.
- No lorem ipsum, no "Image" placeholder rectangles on key frames (use real photos), no inconsistent padding (16pt standard).
- Don't hide failure states — the offline/error/empty set is worth ~15% of the grade and must be *in the file*, visible.
- Don't make screens that can't be built: keep components simple enough for React Native (no complex blend modes, no exotic fonts).

=== MASTER PROMPT END ===

---

## SECTION B — COMPACT PROMPT (for token-limited AI design tools)

> Paste this when the tool has a short prompt box (e.g., quick "First Draft" runs, gallery-style generators). It covers a reduced but still complete core scope.

```
Design a developer-ready mobile UI for "Amrutam" — an Ayurvedic Super App (390x844, iOS) with 3 modules: Consultation, Shop, Health Records. Style: calm premium digital-health (Practo / Tata 1mg quality), NOT decorative. Deep green #1B5E3A primary, gold #C98A2D accent, off-white #F7F8F6 background, Poppins headings + Inter body, 16pt margins, 4pt grid, radius 8/12/16/24, one outline icon set (24px).

Deliver (Light + a few Dark variants):
1. Design system: buttons (primary/outline/ghost/destructive + loading), search bar, inputs, chips, tabs, bottom nav (Home/Consultations/Shop/Records/Profile), app bar, doctor card, product card, record card, date selector, time-slot (available/selected/unavailable/EXPIRED), quantity stepper, rating stars, modal, bottom sheet, toast, skeleton, empty state, error state, offline banner, sync pill.
2. Consultation: home, doctor list (result counts + load-more), search, filter sheet, doctor details, slot selection (4 slot states), booking confirm, booking success, slot conflict modal, expired-slot modal, upcoming/past tabs, details, cancel confirm, cancel success.
3. Shop: home (categories), product grid with INFINITE SCROLL skeletons, search, multi-filter sheet, sort sheet, product details (gallery, qty, benefits, sticky Add-to-Cart), wishlist + empty, cart (offline notice), empty cart, checkout summary, order success, order failed.
4. Health Records: home, monthly-grouped TIMELINE with type-colored dots + sticky month headers (Lab/Prescription/Consultation/Vaccination/Allergy), filter sheet, tags sheet, search, 5 record detail types, image + PDF attachment viewers.
5. System states: skeletons, all empties, network/server/timeout/invalid-response errors, offline banner + full offline screen, queued booking, syncing/synced/sync-failed, session expired, toast gallery.
6. Prototype flows: Consultation, Shop, Health Records — connected.

Rules: Auto Layout everywhere, tokens as variables, real Indian doctor/product content (Ashwagandha ₹499, Dr. Ananya Sharma ★4.8), no lorem ipsum, no emoji icons, 44pt touch targets, states never color-only, name frames "C05 — Doctor Details" style, pages 01 Design System … 07 Prototype Flows.
```

---

## SECTION C — ITERATION SNIPPETS (for refining individual screens later)

Re-paste the master prompt (Section A) as context once, then append any of these:

- **Redo one screen:** "Regenerate only **C06 — Select Consultation Slot** following the exact spec in §6: keep the 4 slot states (Available/Selected/Unavailable/Expired) with the legend, lazy-loading skeleton, and the Continue CTA. Reuse the existing components; do not redesign other screens."
- **Fix consistency:** "Audit all frames: every CTA must use the `Buttons / Primary` component instance, padding must be 16pt, radius 12pt for cards, and typography must use the tokens. List every fix you made."
- **Add dark mode:** "Duplicate these frames as Dark-mode variants using the dark token set: F08, C02, C05, C06, C07, S01, S02, S06, S08, S11, R02, R06. No manual recolors."
- **Accessibility pass:** "Review all frames: touch targets ≥44pt, contrast ≥4.5:1, states communicated with icon+label (not color alone), and text scaling to 200% with no clipping. Report fixes."
- **Dev-handoff pass:** "For each frame add a small annotation section on the side: component names used, states covered, interactions/navigation targets, and data source (e.g., 'product.name', 'doctor.nextAvailable'). One column per screen, clean and readable."
- **State coverage check:** "List every screen and its required states (default/loading/empty/error/offline) and flag any missing state frames; generate the missing ones."

---

## FINAL — DELIVERY CHECKLIST (what "fully detailed" means — verify before submitting)

**Structure**
- [ ] 7 pages in order: Design System → Foundation → Consultation → Shop → Health Records → System States → Prototype Flows
- [ ] All frames 390×844, 16pt side padding, 4pt grid, Auto Layout everywhere
- [ ] Naming: `ID — Screen Name`; pages `01 — …`; components `Category / Name / State`

**Design system**
- [ ] Token variables for color (light + dark), typography, spacing, radius, shadow
- [ ] All 32 components from §4 exist as instances with full state variants
- [ ] One icon family; no emoji; 44pt+ touch targets

**Coverage**
- [ ] All 3 modules with complete flows (discover → detail → act → confirm → manage)
- [ ] Every "must-have" screen from §11 rendered
- [ ] Dark mode for the 12 key frames
- [ ] Offline, queued-booking, sync, timeout, session-expiry states explicitly present (not hidden)
- [ ] Expired-slot + slot-conflict states visually distinct
- [ ] Infinite-scroll affordances (skeletons, load-more, result counts) on listing screens
- [ ] Month/year grouping + sticky headers on Health Records timeline

**Content & polish**
- [ ] No lorem ipsum; consistent realistic data (§13) reused across frames (same doctor name, same product price)
- [ ] Realistic imagery with `[img]` labels; no placeholder rectangles on key frames
- [ ] Microcopy final and natural; consistent (same "Try Again", same empty-state pattern)

**Prototype**
- [ ] 3 main flows connected with correct tap targets + slide/bottom-sheet transitions
- [ ] Offline-queued booking flow connected as bonus Flow 4

**Handoff**
- [ ] Key frames annotated with states, interactions, and data references
- [ ] Variables/styles named so a developer can read tokens straight into a React Native theme file
