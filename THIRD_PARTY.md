# Third-party assets

The project visuals and orbital SVG are original artwork generated from the editable source in `tools/build-art.cjs`. No code, images, or personal content from the Semibold reference is included.

## Browser libraries

- **Matter.js 0.20.0** — used on the homepage for skill pill physics. Local source: `assets/vendor/matter.min.js`; MIT license: `assets/vendor/MATTER-LICENSE.txt`.

- **GSAP 3.12.5** and **ScrollTrigger 3.12.5** — [GSAP](https://gsap.com/). Downloaded from the versioned npm package through jsDelivr. License notices are preserved in `assets/vendor/gsap.min.js` and `assets/vendor/ScrollTrigger.min.js`.
- **Three.js 0.128.0** — [Three.js source and license](https://github.com/mrdoob/three.js/tree/r128). Downloaded from the versioned npm package through jsDelivr. The copyright header is preserved in `assets/vendor/three.min.js`.

## Icons

- **Tabler Icons 3.35.0** — official outline SVGs, stored in `assets/icons/tabler/` and rendered inline by `tools/icons.cjs`. MIT license included in `assets/icons/tabler/LICENSE`. The site uses standalone icons; Tabler Core CSS and JavaScript are not required.

## Typography

- **DM Sans**, Latin subset, weights 400, 500, 600, and 700 — local WOFF2 files from [Fontsource](https://fontsource.org/fonts/dm-sans). Its SIL Open Font License is included at `assets/fonts/DM-SANS-OFL.txt`. Arial and Helvetica provide fallbacks.
- The earlier Manrope files and Three.js library remain as unused assets; the current pages do not load them.

## Development only

- **Playwright Core 1.55.0** is used for local browser verification. It is excluded from the deployable site and lives under the ignored `.tools/` directory.
