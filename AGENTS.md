# Agent Instructions for Astro Starter Kit

This document provides guidelines for AI agents and developers working on this codebase.

## 1. Project Overview

- **Framework:** Astro 5.x (Server-First approach).
- **Language:** TypeScript (Strict mode enabled).
- **Styling:** Tailwind CSS v4, utilizing `tailwind-merge`, `clsx`, and `class-variance-authority` (CVA) for component styling.
- **Components:** 
  - `.astro` files for the majority of UI/Layout (server-rendered).
  - React 19 (`.tsx`) for complex interactive islands (use `client:*` directives).
  - Alpine.js for lightweight, in-markup interactivity (dropdowns, menus).
- **Content:** Managed via Keystatic CMS, stored as `.mdoc` (Markdoc) files in `src/content/`, and accessed via Astro Content Collections.

## 2. Build & Verification Commands

**Note:** This project does *not* have a unit test suite (Jest/Vitest) configured. Verification relies on strict type checking and successful builds.

- **Development Server:**
  ```bash
  npm run dev
  ```

- **Type Checking (CRITICAL):**
  Run this command after any code changes to ensure strict type safety. It is the primary verification step.
  ignore alpinejs related errors
  ```bash
  npm run astro check
  ```

- **Production Build:**
  ```bash
  npm run build
  ```

- **Preview Build:**
  ```bash
  npm run preview
  ```

## 3. Project Structure

- `src/components/ui/`: The UI Component library.
  - Follows an Atomic/Shadcn-like structure.
  - Organized by category: `display`, `overlay`, `forms`, `layout`, `navigation`, etc.
  - **Pattern:** Each component resides in its own directory (e.g., `src/components/ui/display/card/`) containing the implementation (`.astro`) and an `index.ts` export file.
- `src/content/`: Stores the `.mdoc` files for content collections.
- `src/lib/`:
  - `utils.ts`: Contains the `cn()` utility.
  - `component-variants.ts`: Central registry for shared design tokens and CVA variants.
- `src/styles/`: Contains `global.css` with Tailwind v4 theme configuration (@theme).
- `keystatic.config.ts`: Configuration for the Keystatic CMS schema.
- `src/content.config.ts`: Zod schemas for Astro Content Collections.

## 4. Coding Guidelines

### 4.1 Imports & Path Aliases
Always use the configured path aliases from `tsconfig.json`. **Do not** use relative paths for these directories.

- `@/components/*`  → `src/components/*`
- `@/lib/*`         → `src/lib/*`
- `@/styles/*`      → `src/styles/*`
- `@assets/*`       → `src/assets/*`

### 4.2 Styling & Theming
- **Tailwind v4:** The project uses the new CSS-based configuration in `src/styles/global.css`.
- **Colors:** semantic names are defined in CSS variables (e.g., `--color-primary`, `--color-muted`, `--color-destructive`).
- **Dark Mode:** Handled via media query (`@media (prefers-color-scheme: dark)`) in `global.css`.
- **Shared Variants:** Import common design tokens from `@/lib/component-variants.ts`:
  - `semanticVariants`: Standard color intents (default, secondary, destructive, success, etc.).
  - `sizes`: Standard sizing (xs, sm, md, lg, xl).
  - `shapes`: Border radius tokens (rectangle, rounded, pill).
  - `elevationOptions`: Shadow depths.
  - `interactiveEffects`: Hover/click animations (lift, scale, glow).

### 4.3 Component Architecture
When creating new UI components, strictly follow this pattern to maintain consistency:

1.  **Directory:** `src/components/ui/[category]/[component-name]/`
2.  **Files:** `[ComponentName].astro` and `index.ts`.
3.  **CVA:** Define variants using `class-variance-authority`.
4.  **Alpine.js:** Support arbitrary props for Alpine directives by spreading `...alpineProps` on the root element.

#### Component Template (`.astro`):
```astro
---
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { shapes, elevationOptions } from '@/lib/component-variants';

const variants = cva(
  'base-classes-here flex items-center justify-center transition-all', 
  {
    variants: {
      variant: { default: 'bg-primary text-primary-foreground', outline: 'border border-input' },
      size: { sm: 'h-8 px-3', lg: 'h-12 px-8' },
      shape: shapes,
      elevation: elevationOptions,
    },
    defaultVariants: { variant: 'default', size: 'sm', shape: 'rounded' }
  }
);

export interface Props extends VariantProps<typeof variants> {
  class?: string;
  [key: string]: any; // Catch-all for Alpine directives (x-data, @click, etc.)
}

const { variant, size, shape, elevation, class: className, ...alpineProps } = Astro.props;
---

<div class={cn(variants({ variant, size, shape, elevation }), className)} {...alpineProps}>
  <slot />
</div>
```

### 4.4 TypeScript
- **Strict Mode:** No `any` is allowed, except for the explicit pass-through of Alpine props (`[key: string]: any`).
- **Props:** Always define a `Props` interface. Extend `VariantProps` if using CVA.
- **Type Checking:** Rely on the editor's LSP and `npm run astro check`.

### 4.5 Content Management
- **Schema:** When adding new content fields, update BOTH `keystatic.config.ts` (for the CMS UI) and `src/content.config.ts` (for Astro's Zod validation).
- **Files:** Content is stored as Markdoc (`.mdoc`).
- **Access:** Use `getCollection('collectionName')` to retrieve data in components/pages.

## 5. Error Handling & Best Practices
- **Graceful Degradation:** UI components should have sensible default props so they render safely even if data is missing.
- **Zod Validation:** Ensure your Zod schemas in `content.config.ts` match the actual data to prevent build failures.
- **Performance:**
  - Use `.astro` components by default.
  - Only use React (`client:load`, `client:visible`) when deep interactivity is needed.
  - Use Alpine.js for simple toggles/modals to avoid hydrating React.

## 6. Common Issues
- **LSP Errors:** If you see "Cannot find module" for `.astro` files, ensure the Astro extension is active.
- **Tailwind:** If styles don't apply, check that `global.css` is imported in the layout and that the classes exist in the v4 config.
