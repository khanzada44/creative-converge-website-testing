# Creative Converge — Homepage

Static, dependency-free homepage for Creative Converge, a white-label web design agency in Texas.

## Files

```
index.html              Page markup (all sections)
assets/css/style.css    Full theme, layout, animations, responsive rules
assets/js/main.js       Interactions (no libraries)
assets/img/hero-3d.*    3D render: ring + spheres (hero)
assets/img/mark-3d.*    3D render: the "C" logo mark (white-label section)
assets/img/shapes-3d.*  3D render: capsule + spheres (why-us section)
assets/img/logo.svg     Logo (mark + wordmark), for print/social
assets/img/favicon.svg  Favicon
assets/gif/logo-intro.gif  Animated logo: draw-in intro, then loop (320 x 320)
assets/gif/logo-loop.gif   Animated logo: seamless loop (320 x 320)
```

Each 3D image ships as `.webp` (small, used first) with a `.png` fallback, both with transparent backgrounds.

## Animations included

- Preloader: logo draws itself, dot pops, wordmark slides in
- Nav and footer logos: inner ring spins, dot pulses
- Hero: word-by-word headline reveal, rotating last word, text shine, floating 3D render with mouse-driven 3D tilt, cursor spotlight, orbit rings, floating glass cards
- Two-direction services marquee and a giant "Let's converge" marquee
- Scroll reveals, animated stat counters, white-label step timeline that fills as you scroll
- Spotlight hover on cards, magnetic buttons, custom cursor (desktop only)
- Portfolio filter, accordions, floating-label form with validation
- Scroll progress bar, back-to-top button with progress ring
- Everything respects "reduce motion" in the visitor's OS settings

## Things to fill in

1. Portfolio: replace each `.mock` block inside `.work__media` with `<img src="..." alt="...">`.
2. Contact details: search for `[yourdomain]`, `[YOUR ADDRESS]`, `[YOUR HOURS]`.
3. Pricing: add your exact page counts and revision numbers to each plan list.
4. Form: connect a form handler in `main.js` (look for the `TODO` line), e.g. Formspree or Netlify Forms.
5. Social links in the footer (`href="#"`).

## Fonts

Syne (headings) and Manrope (body), loaded from Google Fonts in `index.html`.
