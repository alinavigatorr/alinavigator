# Changelog - AliNavigator Platform

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-24
### Added
- **Premium Product Detail Page (PDP):** Complete Server/Client hybrid architecture for `/products/[id]`.
- **Interactive Product Components:** Client-side gallery with Apple-style hover zoom, product variants selector, and quantity controls.
- **Micro-interactions:** High-fidelity animations using `framer-motion` for tabs and buttons.
- **Graceful Error Handling:** Implemented `error.tsx` and `loading.tsx` for optimal UX during network states.
- **Sticky Buy Box:** Mobile-specific sticky action bar for higher conversion rates.

### Changed
- Refactored dynamic routing `params` to `Promise<{id: string}>` to ensure Next.js 15 compatibility.
- Updated `ProductCard` to use isolated button tags to prevent CSS token conflicts.
- Enhanced global motion curves to `[0.16, 1, 0.3, 1]` for premium tactile feedback.

### Fixed
- Fixed contrast issues with the Shopping Cart icon in product cards.
- Fixed CLS (Cumulative Layout Shift) by applying exact dimensions to the loading skeleton.