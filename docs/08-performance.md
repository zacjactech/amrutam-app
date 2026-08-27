# Performance and Scalability Plan

## 1. Target Dataset

The assignment explicitly requires comfortable handling of:

- 5,000 doctors
- 20,000 products
- 10,000 health records

The application must not render these datasets as one large React tree.

## 1a. New Architecture

Target React Native's New Architecture (Fabric + TurboModules) for improved rendering performance. The New Architecture provides:

- Synchronous layout measurements (benefits list virtualization)
- Reduced bridge overhead
- Better JSI-based native module performance

Ensure all chosen libraries support the New Architecture. Most major libraries (React Navigation, TanStack Query, FlashList, expo-sqlite) are compatible.

## 2. Virtualization

Use:

- FlashList for large flat lists (500+ items or media-heavy rows)
- SectionList for grouped health records
- FlatList for smaller lists (under 200 items) when FlashList is not needed
- VirtualizedList only when lower-level control is actually required

FlashList is the recommended default for this assignment's dataset sizes. It recycles native cells more aggressively than FlatList and sustains 60 FPS on large datasets where FlatList may drop frames.

Virtualization keeps only a bounded render window active.

## 3. Infinite Pagination

Products should use paginated fetching.

```text
20,000 products
      ↓
Page 1: 40
Page 2: 40
Page 3: 40
...
```

Only a small window should be in memory/rendered.

## 4. Memoization

Memoize expensive or stable list items:

```text
React.memo(ProductCard)
React.memo(DoctorCard)
React.memo(HealthRecordItem)
```

Use `useMemo` for expensive derived filter/sort computations and `useCallback` where callback identity affects child rendering.

Do not add memoization everywhere without measuring.

## 5. Stable Keys

Always use stable IDs:

```ts
keyExtractor={item => item.id}
```

Never use array indexes for mutable lists.

## 6. Avoid Large Global State

Do not put:

```text
20,000 products
10,000 records
5,000 doctors
```

into a global Zustand store.

Server data belongs in the query cache and paginated responses.

## 7. Image Optimization

Use a performant image library:

| Setup | Library |
|---|---|
| Expo | `expo-image` |
| Bare React Native | `@d11/react-native-fast-image` |

Use:

- Fixed dimensions/aspect ratios.
- Thumbnail URLs where possible.
- Lazy image loading.
- Placeholder/fallback states.
- Avoid decoding huge source images for list cards.
- Memory cache size limits to prevent unbounded growth.

## 8. Search and Filtering

For server-backed lists:

```text
search/filter state
 ↓
debounce
 ↓
query key
 ↓
server/mock repository
```

For cached local datasets, avoid recalculating expensive filters on every keystroke.

## 9. Rendering Budget

Performance validation should inspect:

- FPS during fast scrolling
- JS thread stalls
- Number of mounted list items
- Memory growth
- Re-render frequency
- Query request volume

## 10. Performance Test Scenarios

### Scenario A

5,000 doctors → search + filter + scroll.

### Scenario B

20,000 products → infinite scroll + sorting + cart operations.

### Scenario C

10,000 health records → grouped timeline + search + filters.

### Scenario D

Rapid cart quantity changes → verify only affected UI updates.

## 11. Performance Rules

Do not:

- Use ScrollView for large datasets.
- Render every item at once.
- Put large arrays in unrelated context providers.
- Recreate filter objects unnecessarily.
- Trigger a network request for every keystroke.
- Load full-resolution attachments in timeline rows.
- Use FlatList for lists over 500 items without benchmarking FlashList first.
