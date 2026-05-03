# Design Spec: BNI Digital Dance Card

**Date:** 2026-05-03
**Route:** `/bni/dance-card`
**Status:** Draft

## 1. Purpose
Create a professional, high-credibility digital "Dance Card" (1-to-1 prep sheet) for BNI meetings. The page must align with Varun's personal brand: technical, forward-thinking, and efficient, while humanizing the FoundrySoft brand.

## 2. Architecture
- **Page:** `src/pages/bni/dance-card.astro`
- **Data Source:** `src/content/bni.json` (for easy updates)
- **Layout:** `src/layouts/Main.astro` (standard site layout)
- **Styling:** Tailwind CSS (consistent with `global.css` and existing monochromatic theme)

## 3. Content Map (GAINS + Referrals)

### [0] Overview (The Bio)
- **Headline:** Varun Raj Manoharan | Founder, FoundrySoft
- **Sub-headline:** AI & Future-Tech Navigator.
- **Narrative:** Frame Varun as a problem solver who bridges the gap between complex technology and business needs.

### [1] GAINS Profile
- **Goals:** Expanding FoundrySoft to be a global brand in AI and future tech.
- **Accomplishments:** Shipped an end-to-end ecommerce website with exceptional design in just one month.
- **Interests:** Homelab, 3D printing, electronics, and building "tiny hobby projects."
- **Networks:** Corporate connections, travel agencies, hospital/healthcare administration.
- **Skills:** Rapid technology adoption, AI-leveraged problem solving (compressing months of research into days), and design-forward development.

### [2] Referral Triggers
A section designed for BNI partners to "listen" for:
- "We don't know how to figure out a technology."
- "I want to build something but I don't have a tech team."
- "My website is old and outdated; I want a new one."

### [3] Ideal Referral Partners (Contact Sphere)
- People with connections to travel agencies.
- Corporate connectors/consultants.
- Healthcare/Hospital administrators.

## 4. Visual Design
- **Theme:** Monochromatic (Zinc/Gray) with monospace accents.
- **Grid System:** Use the same `[X] Section Name` markers found on the homepage.
- **Profile Image:** Reuse `/assets/press-kit/picture_four.jpg` for consistency.
- **Typography:** Mono fonts for labels, serif/sans for body text (consistent with site).

## 5. Success Criteria
- Page is live at `/bni/dance-card`.
- Content is easily editable via a JSON file.
- The tone feels professional yet reflects Varun's "tinkerer" personality.
