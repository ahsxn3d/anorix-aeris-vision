# Credits — Aeris Vision One (concept by Anorix)

Inspired by AVATR Vision (avatr.com, Awwwards). No code, copy, logos or images were taken from the reference.

## 3D asset
- **Car model:** "Car Concept" from the Khronos glTF Sample Assets.
  - © 2024 Darmstadt Graphics Group GmbH. Model and textures by Eric Chadwick.
  - Licence: Creative Commons Attribution 4.0 (CC BY 4.0), https://creativecommons.org/licenses/by/4.0/
  - Source: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept
  - Based on a public-domain (CC0) model by Unity Fan on Sketchfab.
- **Changes made by Anorix:**
  - Removed the Khronos and 3D Commerce logos (licence plate, badges, tyre sidewalls).
  - Replaced the instrument-cluster texture with Aeris artwork.
  - Re-tuned the paint, glass, interior and rim materials.
  - Compressed with glTF-Transform (Meshopt geometry, WebP textures): 11.8 MB down to 3.6 MB.
  - File: `public/models/aeris.glb`. It is loaded only when the visitor reaches the configurator.
- **Trademarks:** the Khronos and 3D Commerce names and logos are Khronos trademarks and are not used on this site.

## Lighting and renders
- The hero scroll sequence (`public/seq`) and every still in `public/img` are offline three.js renders of the model above, made in-house.
- Studio lighting uses the Poly Haven HDRI "Studio Small 09" (CC0, https://polyhaven.com/a/studio_small_09) as fill, plus procedural strip softboxes.
- The live configurator uses the same softbox environment, generated in code with no HDR download.

## Fonts and libraries
- Fonts (OFL 1.1, self-hosted): Unbounded, Sora, JetBrains Mono.
- Libraries: Next.js, React, Tailwind CSS, three.js, @react-three/fiber, meshoptimizer, Lenis, GSAP.

## Disclaimer
The car, brand, specifications and prices are fictional.
