# OdishaTech static website

A mobile-first, single-page website for OdishaTech, made with semantic HTML, CSS, and classic vanilla JavaScript. It has no build step, framework, or JavaScript module. Customer reviews use a Google Apps Script API; the rest of the page uses relative asset paths so the site can be opened directly from `file://` or served by a static preview.

## Open the website

1. Open this folder.
2. Double-click `index.html` (or open it in a browser).

You may also use VS Code Live Server or any static file server. No package installation is needed for the site itself.

## Project files

- `index.html` — semantic page markup, concept previews, contact form, and site sections.
- `css/style.css` — responsive white-and-blue visual system, layouts, and reduced-motion-aware animation.
- `js/script.js` — floating navigation state, accessible mobile menu, typing line, scroll reveals, customer review API and modal behavior, current year, and client-side WhatsApp handoff.
- `assets/images/odishatech-logo.png` — supplied logo, used without alteration.
- `assets/images/why-odishatech.png` — supplied visual for the “Why Odisha Tech” section.
- `assets/images/*.webp` — optimized local Unsplash photographs for the service feature, industry cards, and illustrative concept previews. The concept previews remain examples, not completed client work.
- `odishatech-static.zip` — standalone copy of the HTML, CSS, JavaScript, logo, and README.

The “Why Odisha Tech” PNG is fully opaque, so its checkerboard background remains visible; replace it with an official transparent PNG if one becomes available.

## Contact form behavior

The form checks required fields and accepts an email address or phone number for the reply contact. It prepares a message and opens WhatsApp at `https://wa.me/917064331920`. The visitor reviews and sends the message in WhatsApp; the form does not claim to submit to OdishaTech or save information on a server.

## Customer reviews

The review section loads asynchronously as it approaches the viewport and caches successful results in `sessionStorage` for up to two minutes. Its responsive carousel shows three cards on desktop, two on tablet, and one on mobile; “View All Reviews” lists every published review. Submissions include a generated `submissionId` and are stored as Pending for approval; only Published reviews are shown publicly. Update the endpoint in `data-review-endpoint` if the deployment changes. No private credentials are included in the static site.

## Notes

Website previews are expressly illustrative concepts, not claims of completed client projects. The “Why Odisha Tech” section displays the verified business metrics supplied by OdishaTech: 100+ happy customers, 50+ projects delivered, and 100% client satisfaction. No testimonials, awards, fixed prices, address, or credentials are represented. Google Fonts are an optional progressive enhancement; if unavailable, local system font stacks keep the site readable. No hero video is required: the hero browser illustration is built locally from HTML and CSS.
