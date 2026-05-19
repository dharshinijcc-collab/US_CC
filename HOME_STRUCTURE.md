# Home Page Structure & Design Overview

This document outlines the detailed structure of the Crestcode Product Studio home page. Use this as a reference for analyzing the layout, design system, and section transitions.

---

## 1. Global Navigation (Header)
- **Type**: Floating Navigation Pill (Fixed position).
- **Behaviors**: 
  - **Dynamic State**: Changes between light/dark mode based on the background below it.
  - **Scroll Logic**: On scroll, the Brand Logo and "Contact Us" button hide (fading out and sliding up), leaving only the centered navigation pill visible.
  - **Aesthetic**: Glassmorphism with `backdrop-filter: blur(16px)` and subtle borders.

---

## 2. Hero Section (The Hook)
- **Background**: Dynamic 3D Waves (Vanta.js) with a soft light-to-grey gradient overlay.
- **Content**:
  - **Eyebrow Pill**: "Product Studio & Venture Builder".
  - **Main Title**: Ultra-bold, large scale text (`clamp(2.5rem, 8vw, 4.5rem)`).
  - **CTA**: "Let's Build Together" button which opens a sleek Email Popup.
  - **Visuals**: Floating background cards representing "Strategy", "Design", and "Engineering" that move with mouse parallax.

---

## 3. Target Audience Section (Visionary Founders)
- **Layout**: `grid-2` (2 columns on desktop, 1 on mobile).
- **Design Elements**: 
  - **3D Hover Cards**: Cards that rotate and tilt (`perspective(900px)`) when hovered.
  - **Visual States**: Transition from light background to deep navy (`--bg-dark`) on hover.
  - **Content**: Detailed feature lists with bold checkmarks and descriptive text.

---

## 4. Partnership Section (Dark Mode)
- **Background**: Deep slate/navy (`#0F172A`).
- **Layout**: Asymmetric grid.
- **Key Features**:
  - **Feature List**: Vertical list with numbered/bulleted highlights.
  - **Testimonial Card**: Uses a "BorderBeam" effect (a moving light border) to draw attention to social proof.
  - **Typography**: High contrast white text with subtle glowing accents.

---

## 5. Metrics Section (Data Showcase)
- **Background**: Re-occurrence of the 3D Vanta Waves but with a deep brand-blue theme.
- **Animation**: Synchronized "Count-up" animations that trigger simultaneously when the section enters the viewport.
- **Design**:
  - **Glass Cards**: Semi-transparent cards with heavy blur.
  - **Uniformity**: All counters stop at the exact same time (2.5s duration) using a smooth `easeOutQuart` curve.

---

## 6. Methodology (How We Make It Happen)
- **Layout**: `features-grid-4` (4 columns of small cards).
- **Design**: Minimalist cards with primary-blue icons (`rgba(0, 90, 226, 0.1)` backgrounds).
- **Interactions**: Subtle lift and glow on hover.

---

## 7. Operational Process (6-Step Approach)
- **Type**: Vertical/Grid timeline.
- **Design**: Numbered steps (01-06) with "Phase" titles.
- **Visuals**: Large, ghosted background numbers behind the content for depth.

---

## 8. Footer (Brand Anchor)
- **Design**: Modern, high-information footer.
- **Signature Element**: A massive background watermark ("CRESTCODE") using `text-stroke` to create a "ghosted" imprint effect.
- **Details**: Social media icons with hover-lift, quick links, and a transparent brand logo.

---

## Design Tokens Summary
- **Primary Color**: `#005AE2` (Crestcode Blue).
- **Accent Color**: `#004ac2` (Deep Blue).
- **Typography**: Google Fonts Inter (Weights 500, 600, 700, 800, 900).
- **Glassmorphism**: `backdrop-filter: blur(10px - 20px)`.
- **Transitions**: High-precision `cubic-bezier(0.4, 0, 0.2, 1)`.
