# Design Guidelines: Indumentaria eCommerce

## Design Approach

**System Selected:** Material Design 3 (Material You principles)
**Justification:** Explicitly requested by client. Material Design provides the perfect foundation for an eCommerce experience with established patterns for cards, buttons, forms, and navigation that users already understand.

**Key Principles:**
- Clean, modern aesthetic with subtle depth through elevation
- Focus on product imagery as the hero
- Streamlined checkout flow (no login friction)
- Mobile-first responsive design
- Táctil, intuitive interactions

---

## Typography

**Font Family:** Roboto (Google Fonts CDN)
- Primary: Roboto (400, 500, 700)
- Accent: Roboto Condensed for pricing/CTAs (500, 700)

**Hierarchy:**
- **H1 (Page Titles):** Roboto 700, 2.5rem (desktop) / 2rem (mobile)
- **H2 (Section Headers):** Roboto 700, 2rem (desktop) / 1.75rem (mobile)
- **H3 (Product Names):** Roboto 500, 1.25rem
- **H4 (Category Labels):** Roboto 500, 1rem, uppercase with letter-spacing
- **Body Text:** Roboto 400, 1rem, line-height 1.6
- **Pricing:** Roboto Condensed 700, 1.5rem (featured) / 1.125rem (standard)
- **Buttons:** Roboto 500, 0.875rem, uppercase with letter-spacing
- **Captions:** Roboto 400, 0.875rem

---

## Layout & Spacing System

**Tailwind Spacing Units:** Use 2, 4, 6, 8, 12, 16, 20, 24 for consistency

**Common Patterns:**
- Container max-width: `max-w-7xl` (1280px) for content
- Product grids: `max-w-screen-2xl` (1536px) for wider displays
- Section padding: `py-16` (desktop) / `py-12` (mobile)
- Card padding: `p-4` to `p-6`
- Gap between elements: `gap-6` (grids), `gap-4` (lists)
- Button spacing: `px-6 py-3` (primary), `px-4 py-2` (secondary)

**Grid System:**
- Product Grid: `grid-cols-1 md:grid-cols-3 lg:grid-cols-4` with `gap-6`
- Category Cards: `grid-cols-2 md:grid-cols-4` with `gap-4`
- Cart Items: Single column stack with `space-y-4`

---

## Component Library

### Navigation
- **Header:** Sticky top bar with logo (left), search bar (center), cart icon with badge (right)
- **Mobile:** Hamburger menu triggering slide-in drawer, cart always visible
- **Category Nav:** Horizontal scrollable chips/tabs below header with subtle shadow

### Product Cards (Critical Component)
- Elevated card (shadow-md) with hover lift (shadow-lg transition)
- **Image:** 3:4 aspect ratio, object-cover, with subtle overlay on hover
- **Content:** p-4 padding
  - Product name (H3)
  - Price (Roboto Condensed, prominent)
  - Quick view button (icon-only, bottom-right absolute position)
- **Add to Cart:** Floating Action Button (FAB) style, appears on hover (desktop) / always visible (mobile)

### Product Detail Page
- **Layout:** Two-column (md:) - Image gallery (60%) + Details (40%)
- **Image Gallery:** Large main image with thumbnail strip below
- **Details Panel:**
  - Product name (H1)
  - Price (large, Roboto Condensed)
  - Size selector (chip buttons, outlined style, filled when selected)
  - Color selector (circular color swatches with border on selection)
  - Quantity stepper (- / number / + buttons)
  - Add to Cart (prominent raised button, full-width on mobile)
  - Product description (expandable accordion)
  - Specifications (bulleted list)

### Shopping Cart (Slide-in Drawer)
- **Trigger:** Cart icon badge (top-right header)
- **Drawer:** Slide from right, overlay background
- **Cart Items:** Card-style entries with:
  - Small thumbnail (left)
  - Product name + variant details
  - Quantity stepper (inline)
  - Price per unit + subtotal
  - Remove button (icon-only, text style)
- **Summary:** Sticky bottom section with:
  - Subtotal calculation
  - "Finalizar Compra" button (raised, full-width, prominent)

### WhatsApp Checkout Button
- **Style:** Raised button with WhatsApp green accent
- **Icon:** WhatsApp logo (from icon library) + text "Completar por WhatsApp"
- **Position:** Full-width in cart drawer, sticky to bottom with shadow-lg

### Filters & Search
- **Filter Panel:** Collapsible sidebar (desktop) / bottom sheet (mobile)
- **Filter Options:** 
  - Checkboxes for categories (Material checkbox style)
  - Range sliders for price
  - Color chips for color selection
  - Size buttons (outlined chips)
- **Search Bar:** Elevated input with search icon, autocomplete dropdown with product suggestions

### Admin Panel (Separate Aesthetic)
- **Login:** Centered card (max-w-md) with elevated shadow
- **Dashboard:** Sidebar navigation (left) + content area (right)
- **Tables:** Material Data Table pattern with alternating row shading, sort icons, action buttons (edit/delete)
- **Forms:** Consistent Material inputs with floating labels, helper text, error states

---

## Images

### Hero Section
**Image:** Full-width lifestyle hero showcasing clothing collection
- Aspect ratio: 21:9 (ultrawide) on desktop, 16:9 on mobile
- Overlay: Subtle gradient (bottom-to-top) for text legibility
- Content: Centered text with H1 headline + subheadline + primary CTA button
- CTA button: Blurred background treatment (backdrop-filter: blur), elevated shadow

### Product Images
- **Quality:** High-resolution, consistent white or neutral background
- **Hover state:** Swap to alternate lifestyle/styled image
- **Detail page:** Multiple angles (front, back, detail shots, lifestyle)

### Category Cards
- **Background Images:** Each category card has representative product/lifestyle image
- **Aspect Ratio:** 4:3 with overlay + category label (centered text)

### Trust Elements
- **About Section:** Team/studio photos (if applicable), authentic feel
- **Empty States:** Illustrative graphics for empty cart, no search results

---

## Animations (Minimal, Purposeful)

- **Card Hover:** Subtle lift (translateY(-4px)) + shadow increase (300ms ease)
- **Cart Badge:** Gentle bounce animation on item added (200ms)
- **Add to Cart Button:** Scale pulse (0.95 → 1.05) on click
- **Drawer Transitions:** Slide-in/out (250ms ease-out)
- **Filter Changes:** Fade-in product grid update (150ms)

**No scroll animations, parallax, or continuous movements**

---

## Responsive Breakpoints

- **Mobile:** < 768px (single column, full-width cards, bottom sheets for filters)
- **Tablet:** 768px - 1024px (2-3 column grids, visible filters)
- **Desktop:** > 1024px (4 column grids, persistent sidebar filters, hover states active)