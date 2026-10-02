# Jignesh Gadgi — Portfolio

A complete static portfolio built with HTML, CSS, vanilla JavaScript, GSAP, and ScrollTrigger. No package install or build step is needed to view the website. All fonts, libraries, and illustrations are local.

## Preview

Open `index.html` directly, or use a local server:

```sh
node tools/serve.cjs
```

Then visit **http://127.0.0.1:4173**. On this Windows workspace, `Start-Portfolio.ps1` can also use the Node runtime bundled with VS Code:

```powershell
powershell -ExecutionPolicy Bypass -File .\Start-Portfolio.ps1
```

The server binds only to your own computer. If port 4173 is already in use, the preview may already be running.

## Pages

- Home, Work, Profile, Services, and Contact.
- Six individual project pages in `projects/`.
- Real HTML navigation, working direct links, browser history, and progressively enhanced page transitions.

## Edit the content

**`js/content.js`** is the central configuration for contact details, social links, project descriptions, images, years, services, and case studies. After changing it, regenerate the static HTML:

```sh
node tools/build.cjs
```

The generated HTML is committed as ordinary editable files. If you edit the HTML directly, running the generator will overwrite those changes. Shared HTML layouts and page copy live in `tools/build.cjs`.

**`css/variables.css`** contains the color palette, spacing, grid, and font settings. Other CSS and JS files are split by feature.

### Typography, clock, and theme

- DM Sans is the selected portfolio font, following the request for a recommendation when Basis Grotesque Pro files were unavailable. Four local WOFF2 weights are included. The `--font-sans` variable applies across the whole interface.
- Primary CTA backgrounds use `#f94200`, with dark labels for contrast. Shared controls and dark-mode overrides are in `css/theme.css`.
- The header clock reads `site.location` and `site.timeZone` from `js/content.js`. It currently shows India using `Asia/Kolkata` time and updates each minute.
- The light/dark switch follows the system preference initially, then remembers a manual choice in local storage. `js/theme.js` applies the saved theme before the first paint.
- The homepage wireframe, its two captions, and the Three.js page imports have been removed.
- Project pages use the image-first editorial template in `tools/project-page.cjs`, with artwork galleries, project facts, design-system panels, and next-project navigation. Styles are in `css/case-study.css`.
- A project can set `heroImage` separately from its archive thumbnail. The requested Fitness Live replacement is `assets/images/Hero image.png`; until that file is added, the cover and image viewer use the existing artwork. Add the file and run `node tools/build.cjs` to apply it.

### Content to finalize before publishing

- Change `site.url` in `js/content.js` from `https://example.com` to the final deployment domain. Rebuild to update canonical URLs, Open Graph metadata, structured data, and the sitemap.
- Email and LinkedIn were taken from the portfolio URL supplied in the brief: `jigneshgadgi1929@gmail.com` and `https://www.linkedin.com/in/jignesh-ui-ux`.
- Behance, Dribbble, and Instagram remain unconfigured. Their buttons display an honest “coming soon” message. Add real URLs in the configuration to turn them into external links.
- The six project illustrations are original vector mockups. Case-study text is explicitly presented as an illustrative concept, with no fabricated client results. Replace the visuals and descriptions with approved project work.
- The testimonial is clearly marked as a sample awaiting client approval. Replace it with an approved quote and attribution before publishing.
- Experience dates and companies follow the supplied brief; the role descriptions are draft portfolio copy.

## Assets

`assets/images/` contains six original SVG interface mockups, the static orbital fallback, and social sharing artwork. Edit the vector source generator in `tools/build-art.cjs`, then run:

```sh
node tools/build-art.cjs
node tools/build-case-art.cjs
```

SVG project visuals scale sharply at every resolution and require no duplicate image sizes. For replacement photographs, provide compressed WebP/AVIF assets and add suitable `srcset`/`sizes` values to the image template.

The raster `assets/images/social-preview.png` is included for Open Graph clients. Its editable vector source is `social-preview.svg`.

## Interactions

- Homepage skills playground: falling, rotating pills with mouse/touch dragging, keyboard arrow controls, and reset. Physics pauses offscreen and in hidden tabs. Reduced motion uses a stationary arrangement with direct movement. Skill labels live in `tools/skills-section.cjs`; Matter.js loads only on the homepage.

The homepage Selected Work section uses numbered project rows with service tags, year, and paired brand/interface panels. Edit project content in `js/content.js`, brand directions in `tools/selected-work.cjs`, and layout in `css/selected-work.css`; regenerate HTML with `node tools/build.cjs`. All interface icons use local Tabler SVGs through `tools/icons.cjs`.

- Fast first-visit loader, sequenced headings, reusable word reveals, image reveals, and scroll-linked parallax.
- Native wheel/touch scrolling, with GSAP easing for in-page links and ScrollTrigger scrub for synchronized visuals. Wheel, touch, and keyboard inputs cancel anchor travel.
- Homepage and Work archive share numbered project rows with paired visuals and all six project links.
- Desktop cursor labels, project hover motion, and restrained magnetic buttons.
- Keyboard-accessible mobile overlay with focus management, Escape dismissal, inert background content, and responsive cleanup.
- Semantic service disclosure rows work with mouse, keyboard, and without JavaScript.
- Full-size project artwork opens in an accessible image viewer with Escape dismissal and keyboard focus restoration.
- Reduced-motion preferences disable reveals, parallax, and cursor motion.

## Contact form

The form is an explicitly labeled frontend demonstration. It checks required fields, email format, and a minimum message length. It does **not** send or store submissions. After validation, visitors can open their own email app with a prepared draft or return to editing. Email copying has a clipboard fallback and an accessible status message.

## Verification

`tools/verify-selected.cjs` checks all six homepage rows at five viewport widths in light and dark themes, paired panel proportions, image loading, project links, and Tabler icon markup across all 11 pages.

`tools/verify.cjs` checks local file references, all 11 pages at five viewport widths, keyboard navigation, form errors and success, clipboard copying, service disclosures, JavaScript-disabled rendering, reduced motion, removed hero artwork, hover motion, layout switching, and page navigation. `tools/verify-redesign.cjs` additionally checks light/dark rendering at four widths, local font loading, CTA color, India time, persistent theme selection, and each gallery image.

The verification script uses Playwright Core only for development; it is not loaded by the website. In this workspace it uses `.tools/package` and installed Chrome. Results and preview screenshots are saved under `test-results/`.

## Deploy

Upload the five root HTML files, `projects/`, `css/`, `js/`, `assets/`, `robots.txt`, and `sitemap.xml` to any static hosting service. There is no server-side application. `tools/`, `.tools/`, and `test-results/` are development files and are not needed on the host.

See `THIRD_PARTY.md` for library and font sources.
