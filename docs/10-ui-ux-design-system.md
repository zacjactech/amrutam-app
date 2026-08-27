# UI/UX and Design System Specification

## 1. Design Goal

The assignment does not prioritize pixel-perfect UI. The visual system should instead demonstrate consistency, accessibility, hierarchy, and usable interaction patterns.

## 2. Design Tokens

Create semantic tokens rather than using raw colors throughout components.

```text
background.primary
background.secondary
surface.default
surface.elevated
text.primary
text.secondary
text.muted
border.default
action.primary
action.secondary
status.success
status.warning
status.error
status.info
```

Each token must have light and dark values.

## 3. Typography

Define:

- Display
- Heading 1
- Heading 2
- Heading 3
- Body
- Body small
- Caption
- Button label

Use a single primary font family unless the design requires otherwise.

## 4. Spacing

Use a small spacing scale, for example:

```text
4
8
12
16
20
24
32
40
48
```

Do not introduce arbitrary spacing values in every component.

## 5. Component Library

Build reusable primitives:

```text
AppText
AppButton
AppIconButton
AppInput
AppSearchBar
AppChip
AppCard
AppAvatar
AppDivider
AppBadge
AppEmptyState
AppErrorState
AppSkeleton
AppBottomSheet
AppModal
AppListHeader
AppLoadingIndicator
```

## 6. Feature Components

Consultation:

```text
DoctorCard
DoctorFilterSheet
SlotPicker
BookingSummary
ConsultationCard
```

Shop:

```text
ProductCard
ProductFilterSheet
SortSheet
CartItem
CartSummary
WishlistButton
```

Health:

```text
HealthRecordCard
TimelineSection
RecordTypeChip
AttachmentThumbnail
```

## 7. Loading States

Prefer skeletons for major content blocks and inline spinners for mutations.

Do not replace the entire screen with a spinner when cached data is already available.

## 8. Empty States

Every list must define an empty state.

Example:

```text
No doctors found
Try changing your search or filters.
[Clear filters]
```

## 9. Error States

Errors must distinguish:

- Retryable
- Validation
- Conflict
- Authentication/session
- Offline

Example:

```text
We couldn't load doctors.
Your cached results may still be available.
[Try again]
```

## 10. Accessibility

Interactive elements should have:

- Accessible labels
- Accessible hints when needed
- Adequate touch target
- Correct role
- Visible focus/pressed states

Do not encode important information through color alone.

## 11. Dark Mode

Components consume semantic tokens. They should not contain:

```text
if dark then '#000'
```

Instead:

```text
theme.colors.background.primary
```

## 12. UX Principle

When a remote operation is uncertain, communicate state rather than pretending certainty.

For example:

```text
Pending sync
```

is better than showing:

```text
Booking confirmed
```

while the request has not actually reached the server.
