# Reset by Shruti Solanki — Asset Manifest

> Single source of truth for media used by the VSL funnel. Per C16: commercial values and
> third-party URLs are read from one place, never inlined across components.

## Video testimonials (3) — SERVE FROM CDN, NOT FROM `public/`

The local copies in `public/Video-Testimonials/` are **source assets** (72–280 MB each).
Per C16 ("never commit the raw source asset next to the derived one") they must **not** be
served. The funnel points at these DigitalOcean Spaces CDN URLs:

| # | CDN URL | Intrinsic | Duration | Local source (do not serve) |
|---|---|---|---|---|
| V1 | `https://tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com/client_funnel_videos/Shruti/video-output-BC1A520F-867A-4430-B17B-9D8DE64EA938-1.mp4` | 1080×1920 (9:16) | 125.1 s | `public/Video-Testimonials/video-output-BC1A520F-867A-4430-B17B-9D8DE64EA938-1.mp4` (72.7 MB) |
| V2 | `https://tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com/client_funnel_videos/Shruti/IMG_0318.mp4` | 1054×1644 (~9:14) | 81.6 s | `public/Video-Testimonials/IMG_0318.mp4` (109.1 MB) |
| V3 | `https://tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com/client_funnel_videos/Shruti/Video-Testimonial1.MP4` | 1440×2560 (9:16) | 134.9 s | `public/Video-Testimonials/Video-Testimonial1.MP4` (280.3 MB) |

**Notes**
- All three are **portrait**, and each has a *different* aspect ratio. Per C14/C16 they are
  shown WHOLE (`object-fit:contain` on a toned backdrop) — never `cover`.
- **No poster stills supplied.** Posters are derived per C16 from a seeked `#t=` frame on the
  CDN URL (e.g. `…mp4#t=2`) with `preload="metadata"`, not left as blank tiles.
- Speaker identity (name / age / profession / city) for each video is **NOT SUPPLIED** —
  see the gap list. Attribution must not be invented.

## Chat-screenshot testimonials (14) — `public/Chat Testimonials/`

Used for the §14 proof wall (masonry), NOT a before/after gallery — no before/after images exist.

`5706FE96-…jpg` 1179×2096 · `D3098B1F-…jpg` 1179×2096 · `IMG_2024.PNG` 1179×2556 ·
`IMG_2025.PNG` 1179×2556 · `IMG_4821.jpeg` 1179×1333 · `IMG_5128.jpeg` 1179×1752 ·
`IMG_5332.JPG` 1080×1440 · `IMG_5334.jpg` 1179×1489 · `IMG_5335.jpg` 1179×1492 ·
`IMG_9272.jpeg` 1179×1535 · `IMG_9273.jpeg` 1179×726 · `photo-output.jpeg` 1680×2100 ·
`photo-output.png` 1632×2040 · `photo-output_2.png` 1896×2370

Heights vary 726–2556 px → a masonry/column layout is required; a fixed-row grid would crop them.
All need WebP derivation + light PII review (phone numbers / display names) before publishing.

## Coach imagery — `public/Shruti-Images/`
- `IMG_3676.jpeg` 4284×5712 (portrait) — candidate §15 coach portrait.
- `IMG_0693.jpeg` 2316×3088 (portrait).
Both need WebP derivation and downscaling to their rendered box (C16, target < 250 KB).

## Missing assets (blocking / declared placeholders)
- **VSL video** — none. Frame reserved per C16; declared placeholder.
- **Before/after photos** — none, and clients are private. §14 uses the chat wall instead.
- **Brand mark / logo** — none supplied.
- **Video-testimonial poster stills** — derived from `#t=` frames.
