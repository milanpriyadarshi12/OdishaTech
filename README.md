# OdishaTech – Static Website

A mobile-first, single-page website for **OdishaTech**, built using semantic HTML, CSS, and vanilla JavaScript. The website provides digital solutions and website development services for businesses, startups, and professionals.

The project uses no frontend framework or build process. It can run directly in a browser or through VS Code Live Server.

**Website:** https://odishatech.in/

## 1. Open the Website

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Run it using VS Code Live Server or another static file server.

No package installation is required for the website itself.

## 2. Project Structure

- `index.html` – Main website markup, SEO metadata, contact form, and website sections.
- `css/style.css` – Responsive layouts, styling, animations, and visual components.
- `js/script.js` – Navigation, mobile menu, animations, customer reviews, modal behavior, and form interactions.
- `assets/images/` – Website logo, hero visuals, service images, industry images, and other graphics.
- `google-apps-script/Code.gs` – Google Apps Script backend for customer reviews.
- `CNAME` – Custom domain configuration for odishatech.in.
- `robots.txt` – Search engine crawling instructions.
- `sitemap.xml` – Sitemap containing the website's main and location pages.
- `website-development-puri/index.html` – Location-specific website development page for Puri.
- `website-development-bhubaneswar/index.html` – Location-specific website development page for Bhubaneswar.
- `README.md` – Project documentation and SEO implementation notes.

## 3. Main Website Features

- Responsive design for desktop, tablet, and mobile.
- Modern white-and-blue visual design.
- Website development service sections.
- Industry-specific website examples.
- Pricing and project enquiry sections.
- WhatsApp and email contact options.
- EmailJS-powered contact form.
- Customer review section connected to Google Apps Script.
- Customer review submission and approval workflow.
- Search engine optimization setup.
- Dedicated location pages for Puri and Bhubaneswar.

## 4. Contact Form – EmailJS

The contact form uses EmailJS to send project enquiries directly to the OdishaTech support email.

### Main functionality

- Collects customer name, business name, email, phone number, website type, selected package, and project description.
- Sends enquiry details to the OdishaTech team.
- Sends an automatic acknowledgement email to customers through the linked EmailJS auto-reply template.
- Displays success and error messages.
- Does not require a custom backend server.

### Configuration

The website uses the following EmailJS identifiers:

- Service ID
- Main enquiry Template ID
- Public Key

The customer auto-reply template is linked through EmailJS's Auto-Reply configuration. It should not be sent separately from the frontend.

**Security:** Only the EmailJS public key should be included in frontend code. Never expose private keys or account passwords.

## 5. Customer Reviews

The review section uses Google Apps Script as its backend.

### Functionality

- Loads reviews asynchronously.
- Caches successful results in session storage for up to two minutes.
- Displays reviews in a responsive carousel.
- Supports a View All Reviews option.
- Stores new submissions as Pending for approval.
- Displays only Published reviews publicly.

Update the review endpoint in the website configuration if the deployment URL changes.

Google Apps Script handles review storage and retrieval. No private credentials should be included in the frontend.

## 6. SEO Implementation

SEO improvements have been added to help search engines understand OdishaTech's services and geographic coverage.

### On-page SEO

- Optimized page title and meta description.
- Canonical URL.
- Robots meta tag.
- Open Graph metadata.
- Twitter card metadata.
- Favicon and Apple touch icon.
- Image alt text.
- Internal links to location-specific pages.
- Lazy loading for selected below-the-fold images.
- Structured data using JSON-LD.

### Structured data

The homepage includes:

- Organization
- WebSite
- ProfessionalService
- OfferCatalog
- WebPage

The location pages include:

- WebPage
- BreadcrumbList
- Service

Structured data should be validated using:

- https://validator.schema.org/
- https://search.google.com/test/rich-results

### Local SEO

The website targets customers searching for website development services in Odisha.

Primary locations:

- Puri
- Bhubaneswar

Additional service areas include Cuttack and other Odisha districts, where supported by genuine service coverage.

Dedicated location pages currently available:

- https://odishatech.in/website-development-puri/
- https://odishatech.in/website-development-bhubaneswar/

New district pages should be created only when useful, unique, and accurate local content is available.

### SEO files

- `robots.txt` – Provides crawling instructions.
- `sitemap.xml` – Lists the website pages for search engine discovery.
- `assets/images/og-image.png` – Social sharing image.
- `assets/images/favicon-48.png` – Browser favicon.
- `assets/images/favicon-512.png` – High-resolution favicon.
- `assets/images/apple-touch-icon.png` – Apple device icon.

## 7. Google Search Console Setup

After deployment:

1. Verify the website in Google Search Console.
2. Submit `https://odishatech.in/sitemap.xml`.
3. Use URL Inspection to request indexing for the homepage and location pages.
4. Monitor indexing status, search queries, clicks, and impressions.
5. Fix any crawling or indexing issues reported by Google.

Submitting a sitemap or requesting indexing does not guarantee indexing or rankings.

## 8. Google Business Profile

For local visibility, OdishaTech should maintain a genuine Google Business Profile.

Recommended setup:

- Business name: OdishaTech.
- Primary category: Website designer or an appropriate available category.
- Add only genuine services and contact details.
- Set service areas accurately.
- Hide the address if operating as a service-area business without a public customer-facing location.
- Add real project images and updates.
- Request genuine customer reviews.

Do not use fake addresses, fabricated reviews, or misleading business information.

## 9. Performance Improvements

Recommended future improvements:

- Compress large images.
- Prefer WebP or AVIF image formats.
- Host important images locally instead of relying on external image websites.
- Optimize the hero image to improve Largest Contentful Paint (LCP).
- Reduce unnecessary CSS and JavaScript.
- Test mobile performance using Google PageSpeed Insights.

Test at: https://pagespeed.web.dev/

## 10. Future SEO Roadmap

### Days 1–14
- Deploy all SEO files.
- Verify Google Search Console.
- Submit the sitemap.
- Configure HTTPS and domain redirects.
- Complete Google Business Profile setup.
- Improve image loading performance.

### Days 15–45
- Publish useful articles about website development.
- Create genuine project case studies.
- Improve internal linking.
- Collect authentic customer reviews.

Suggested blog topics:

- Website Development Cost in Odisha.
- Website vs Facebook Page for Small Businesses.
- What Should a Hotel Website Include?
- How to Choose a Website Developer in Odisha?

### Days 46–75
- Consider creating a Cuttack location page.
- Expand to additional districts when unique local content is available.
- Publish genuine business projects and case studies.

### Days 76–90
- Review Search Console performance.
- Improve pages receiving impressions but few clicks.
- Update content based on actual search queries.
- Monitor technical SEO and website performance.

## 11. Important Notes

- Website previews are illustrative concepts, not claims of completed client projects.
- Only genuine customer reviews should be displayed.
- Do not publish fabricated awards, ratings, testimonials, or business credentials.
- SEO improvements do not guarantee a specific Google ranking.
- Search engine indexing and ranking performance must be monitored over time.
- Google Fonts are an optional enhancement; system font fallbacks keep the website readable.

---

**OdishaTech**  
*Your Business. Our Digital Expertise.*

Website: https://odishatech.in/