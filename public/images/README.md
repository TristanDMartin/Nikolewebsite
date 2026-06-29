# Portfolio image folders

One folder per project under `public/images/`. Drop originals here at **2000px+** wide (2400px+ ideal).

| Project | Folder | Slug |
|---------|--------|------|
| Clinique UV Solutions | `clinique-uv-solutions/` | `clinique-uv-solutions` |
| Clinique Chubby Franchise | `clinique-chubby-franchise/` | `clinique-chubby-franchise` |
| Bumble and bumble Holiday 2024 | `bumble-2024/` | `bumble-and-bumble-holiday-2024` |
| Bumble and bumble Holiday 2023 | `bumble-2023/` | `bumble-and-bumble-holiday-2023` |
| Bumble and bumble Holiday 2022 | `bumble-2022/` | `bumble-and-bumble-holiday-2022` |
| Hum by Colgate | `hum/` | `hum-by-colgate` |
| Colgate Collab Explore | `colgate-collab-explore/` | `colgate-collab-explore` |
| Colgate Magik | `colgate-magik/` | `colgate-magik` |
| Colgate Optic White Overnight Pen | `colgate-optic-white-overnight-pen/` | `colgate-optic-white-overnight-pen` |
| Softsoap Room | `softsoap-room/` | `softsoap-room` |
| Nikole's Soles | `nikoles-soles/` | `nikoles-soles` |
| Yankee Candle Holiday Gift Set 2018 | `yankee-candle-2018-holiday-gift-sets/` | `yankee-candle-2018-holiday-gift-sets` |
| Yankee Candle Holiday Concept | `yankee-candle-holiday-deep-dive/` | `yankee-candle-holiday-deep-dive` |
| Yankee Candle Target Limited Edition 2018 | `yankee-candle-2018-target-limited-edition/` | `yankee-candle-2018-target-limited-edition` |
| Newell Brands Global Packaging Innovation Tokyo, 2017 | `packaging-innovation-in-tokyo/` | `packaging-innovation-in-tokyo` |
| Sharpie Limited Edition Packs 2017 | `sharpie-2017-limited-edition-packs/` | `sharpie-2017-limited-edition-packs` |
| Prismacolor National Coloring Day | `prismacolor-instagram-videos/` | `prismacolor-instagram-videos` |
| Papermate Flair Color Kit | `paper-mate-flair-coloring-kit/` | `paper-mate-flair-coloring-kit` |
| Baby Jogger Rebrand Explore | `baby-jogger-rebrand-exploration/` | `baby-jogger-rebrand-exploration` |
| Baby Jogger City Tour Retail Display | `baby-jogger-city-tour-display/` | `baby-jogger-city-tour-display` |
| Sharpie Global Brand Refresh | `sharpie-rebrand/` | `sharpie-rebrand` |

## Workflow
1. Export or copy originals into the project folder (Finder drag-and-drop is fine).
2. Name files `01-description.png`, `02-description.png`, etc.
3. Wire paths in `src/data/projects.js` (`image` + `gallery` arrays).
4. Run `npm run check:images` to verify resolution.

Do not upload images through chat — they are compressed to ~1024px wide.
