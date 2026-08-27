# Requirements Traceability and Engineering References

## Assignment Source

All product requirements in this documentation pack are derived from the supplied `React Native Assignment.pdf`.

Key requirements include:

- Three modules: Consultation, Shop, Health Records.
- 5,000 doctors, 20,000 products, and 10,000 health records.
- Virtualization, memoization, efficient state updates, and lazy loading.
- Cached API responses, offline cart, queued offline bookings, and automatic synchronization.
- Handling slow networks, timeouts, random failures, empty/partial responses, invalid JSON, and session expiration.
- Environment configuration, API abstraction, logging, Error Boundary, Toast, theme/dark mode, accessibility.
- Meaningful tests and one E2E flow.
- Three bonus capabilities.

## Current Engineering References Consulted

### React Native

The current React Native documentation describes FlatList as a virtualized list abstraction and explains that virtualization limits the active render window for memory and performance. VirtualizedList documentation also explains that content outside the render window is replaced while scrolling.

### React Navigation

React Navigation's current TypeScript guidance recommends strict TypeScript settings and supports typed navigation configuration. React Navigation 7 provides a static API that can simplify type inference and deep-link configuration. Note that the static API requires the navigation structure to be defined statically (screens cannot be created dynamically).

React Navigation 8.0 alpha (December 2025) further improves type inference with automatic `useNavigation` and `useRoute` typing based on screen names. Consider React Navigation 8 if starting a new project, or React Navigation 7 with the static API for stability.

Known issue: TypeScript 7 (and TypeScript 6 with `--stableTypeOrdering`) can break `StaticParamList` inference in React Navigation 7. Pin TypeScript to version 5.x if using React Navigation 7's static API, or verify compatibility with the latest patch releases.

### TanStack Query

TanStack Query's current React Native guidance describes integrating its online manager with React Native network-state providers. Its current network modes include `offlineFirst`, and persistent query mechanisms can act as a cache layer for offline reads. Note that default persistence uses AsyncStorage, which may be slow for large payloads; consider selective SQLite caching for large datasets.

### FlashList

FlashList (`@shopify/flash-list`) is the recommended list component for large datasets in React Native. It provides more aggressive cell recycling than FlatList and sustains 60 FPS on lists where FlatList may drop frames. FlashList v2 (2025) eliminates the need for item size estimates and performs best on the New Architecture.

### Image Optimization

For performant image rendering in React Native, use `expo-image` (Expo projects) or `@d11/react-native-fast-image` (bare React Native). Both provide memory caching, placeholder support, and optimized decoding.

### MMKV

MMKV is a fast key-value storage library for React Native, significantly faster than AsyncStorage for small, frequently-accessed data. Use it for theme preferences, feature flags, and UI preferences. Do not use it for large datasets or structured data.

### New Architecture

React Native's New Architecture (Fabric + TurboModules) provides synchronous layout measurements, reduced bridge overhead, and better JSI-based native module performance. Ensure all chosen libraries are compatible. Most major libraries (React Navigation, TanStack Query, FlashList, expo-sqlite) support the New Architecture as of 2025-2026.

These references support the architectural choices in this pack but do not override the assignment's explicit requirements.
