# Polykarpou Law — website design files

Static HTML export of the finished designs for **Polykarpou Law**, an independent law practice in Limassol, Cyprus (advocate Sofia Polykarpou). Use these files as the visual and content reference for building the production website.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero, About, Expertise list, Technology, Careers, Contact form, footer |
| `corporate.html` | Corporate & Commercial |
| `litigation.html` | Litigation & Dispute Resolution |
| `criminal.html` | Criminal Defense |
| `real-estate.html` | Real Estate & Construction |
| `family.html` | Family & Inheritance |
| `employment.html` | Employment |
| `tech-ip.html` | Tech, IP & Data Protection |
| `immigration.html` | Immigration & Residency |
| `privacy.html` | Privacy Policy (GDPR) |
| `cookies.html` | Cookie Policy |
| `legal-notice.html` | Legal Notice |

`images/hero-justice.jpg` is the hero background, used on every page.

## Design tokens

- **Font:** Manrope (Google Fonts), weights 300–700
- **Colours:**
  - Page background: `#F6F6F3`
  - Text: `#0A1A2F`
  - Primary button and dark sections: `#243140`
  - Label accent: `#1F4FD1`
  - Footer: `#06111F`
- **Hero:** photo background with a dark gradient (`rgba(12,12,14,…)`) on the left so the white text stays readable
- **Buttons:** pill-shaped (`border-radius: 999px`)

## Not yet functional (to be built)

These files are static. The following need real implementation:

- **Contact form:** send enquiries by email. It has these fields: first name, last name, email, phone, area-of-law chips, message, and GDPR consent.
- **Newsletter signup** in the footer.
- **Language switcher (EN / GR / RU):** the Greek and Russian translations still need to be written.
- **Area-of-law chip selection** in the contact form.
- **Cookie consent banner:** the Cookie Policy refers to one.
- **Mobile navigation menu:** on small screens the menu links are hidden, so a hamburger menu is needed.

## Placeholders to replace

Anything in `[square brackets]` is a placeholder:

- phone (`+357`), email and office address
- Bar registration number and VAT number
- Sofia's portrait photo
- the "Practice areas" and "Cases handled" stats (removed from the hero)
- retention periods and "Last updated" dates in the policies
- `[Adjust to your own experience]` notes on the practice-area pages
