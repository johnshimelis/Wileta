# GurshaPay Cinematic WebM Overlay Assets

Place your transparent 3D video renders (.webm with alpha channel) here:

- `sparkle_burst.webm` (Tier 1: Sparkle, < 50 ETB)
  - Recommended resolution: 1920x1080 or 1280x720
  - Codec: VP8 or VP9 with Alpha channel (transparency)
  - Duration: ~4 - 6 seconds

- `3d_axum_obelisk.webm` (Tier 2: Obelisk / Satellite, 50 - 199 ETB)
  - Codec: VP8 or VP9 with Alpha channel
  - Duration: ~6 - 8 seconds

- `3d_royal_lion.webm` or `3d_gonder_castle.webm` (Tier 3: Hero Lion / Castle, 200+ ETB)
  - Full-screen cinematic hero construct
  - Codec: VP8 or VP9 with Alpha channel
  - Duration: ~10 - 12 seconds

### How to generate transparent WebM:
1. In Blender / After Effects / Cinema4D: Render with RGB + Alpha.
2. In Premiere / Media Encoder or ffmpeg:
   ```bash
   ffmpeg -i input_with_alpha.mov -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 output.webm
   ```
3. The `<CinematicAlert>` component will automatically play these transparent 3D assets with zero background box and synchronize glowing 3D typography to the video climax!
