# Project-wide design requirements

These are the user's standing requirements for all UI work in this repository.

1. Create professional, creative, impressive designs consistent with Tigers Team's racing theme. Preserve a coherent visual language: dark surfaces, red accents, clear typography, intentional spacing, and restrained motion. Keep functionality intact when changing presentation.
2. Make every page and component responsive across small, medium, and large screens, including intermediate widths, short screens, portrait and landscape. Prevent horizontal overflow, clipped content, overlapping controls, and unreadable text. Keep touch and keyboard actions usable. Respect reduced-motion preferences.
3. Design for changing data quantities and content lengths. Support empty, single-item, and large collections; long names; new or removed categories; missing images; and loading/error states. Use stable API identifiers for identity and selection. Do not depend on a particular category name, item count, or list order for unrelated functionality. Allow content to grow or scroll naturally instead of clipping it into fixed heights. Use pagination or another suitable loading strategy for large datasets.

For relevant changes, check responsive layouts and representative data states. Preserve existing user edits and working API, authentication, cart, and reservation behavior. State accurately which checks were completed; do not claim visual verification or full-site compliance without performing it.
