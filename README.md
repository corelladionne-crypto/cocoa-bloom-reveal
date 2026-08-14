# Cocoa Reveal

Build a mobile web prototype (390×844) for a gifting reveal experience called "COCOA / Rooted." Four screens in sequence, purple (#2b2140) and gold (#e9c25a) palette, kraft-brown (#c9a876) for the first screen only, serif display type for headlines, sans-serif for buttons. Screen 1 — Welcome: kraft-brown background, gold line-art cacao pod illustration centered, "COCOA / Theobroma Cacao" headline. After 1 second, dim the screen and show a horizontal drag track at the bottom with a gold circular handle and the text "Slide the arrow across the screen to rip the bottom of the packaging." Interaction: as the user drags the handle right, reveal the screen underneath (Screen 2) through a diagonal torn-paper clip-path edge that follows the drag position. At 90% drag, auto-complete the tear and fade Screen 1 out. Screen 2 — Sow: purple background, Cadbury logo, torn kraft-paper strip along the bottom edge, headline "Sow — Cadbury," body copy about Cocoa Life sourcing, gold CTA button "Start growing." Screen 3 — Plant: purple background, ASU logo, gold line-art cacao seed pod centered, headline "Plant — Arizona State University," gold CTA button "Plant my seed." On tap, animate a glowing gold vertical line growing upward from the seed pod over 1.2 seconds, then crossfade to Screen 4. Screen 4 — Grow: purple background, Changing Futures logo, full gold line-art cacao tree illustration, headline "Grow — Changing Futures," a text input labeled "Name," gold CTA button. On submit, scale the whole screen down to 25% and fade to 0 opacity over 1 second (zoom-out feel). Screen 5 — A Living Grove: wide-format landscape display, small gold tree icon, headline "A Living Grove," logos for Changing Futures / Cadbury / ASU along the bottom, a live counter "Trees Planted: X/400" that increments by 1 each time this screen is reached. Use spring easing on all transitions, not linear. All screens should feel like one continuous unwrapping, not five separate slides.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cocoa-bloom-reveal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4cfae599-905c-4295-8c34-20ffc7b9ecad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
