# Camille & Antoine wedding invitation

A responsive wedding invitation recreated from the supplied 25-second video. The names, date, venues and English copy are sample wedding content retained from the reference; replace them before inviting real guests.

## Run locally

- `npm ci`
- `npm run dev` (Next.js, http://localhost:3000)
- `npm run build`

For Vercel deployment and RSVP database setup, see [VERCEL.md](VERCEL.md). The repo now defaults to standard Next.js; original Sites commands are retained as `dev:sites`, `build:sites`, and `start:sites`.

Content is in `app/wedding.ts`, `app/page.tsx` and `app/celebration.tsx`; visual tokens and responsive styles are in `app/globals.css`.

The app includes opening envelope animation, a real countdown, venue map links, downloadable calendar events, timeline, dress code, recovery day, gifts, accordion FAQ and a persisted RSVP form. Date/time calendar entries use the June UTC+2 offset for France.

## RSVP

POST `/api/rsvp` validates input on the server. On Vercel it stores responses through the server-only Supabase adapter; on Sites it uses the D1 `DB` binding. GET `/api/rsvp` reports configuration availability only, never guest records. The UUID prevents duplicate inserts on network retries. Guest replies are not exposed through a public endpoint. Browser storage is not used for RSVP records. The current deployment is private to the site owner; sharing access must be configured before real guests can open it.

Generate schema changes with `npm run db:generate`. For a local Sites database after `npm run build:sites`:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_shocking_purple_man.sql
```

## Validation

- TypeScript and production build.
- Mobile width and visual inspection of opening invitation, FAQ and RSVP.
- FAQ expansion, attendance conditional fields and successful form submission.
- API rejects invalid payloads and accepts valid replies idempotently.
- WebMCP navigation tool registered and validated with valid and invalid sections.

## Artwork

The original build used two assets generated with the built-in ImageGen tool:

- `assets/originals/invitation.png`: Portrait antique French wedding invitation artwork. Ivory paper center empty for HTML text, forest green silk swag curtains, silver chandelier, white hydrangea, roses and jasmine framing edges. Handpainted watercolor and engraving, no text.
- `assets/originals/chateau.png`: Landscape watercolor of a French Burgundy chateau in a formal garden. Green shutters, limestone, topiary trees, hydrangeas, ivory background fading at edges. No text.

The expanded artwork set is stored in `assets/originals/wedding/`; optimized WebP copies are in `public/images/wedding/`. It contains guests, a hanging garland, candles, five separate timeline illustrations, the recovery-day facade, a silver gift frame, an envelope, topiary with steps, an estate panorama, a ceremony frame, floral side borders, and a silver seal. The artwork recreates the visual motifs from the video; it is not the original designer's source artwork. Generation prompts are retained alongside the originals.

Run `node scripts/prepare-wedding-art.mjs` to regenerate WebP files and their dimensions manifest from the originals. Larger images include a 640px variant; small timeline images are limited to 320px. Decorations are hidden from assistive technology, cannot intercept pointer events, and retain their layout space while loading. New illustrations use the existing scroll-reveal/reduced-motion handling.

The video was used as a visual reference only; its overlay text was not treated as instructions. Background music was subsequently added: Canon in D Major by Kevin MacLeod (incompetech.com), licensed under CC BY 3.0. Source: https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100301 ; license: https://creativecommons.org/licenses/by/3.0/ . The original recording is retained in assets/originals/canon-in-d-major.mp3. The deployed copy at public/audio/canon-in-d-major-web.mp3 is compressed to 128 kbps, with visible footer attribution and an adaptation notice. Music starts only on an opening/play gesture, loops at 28% volume, and remembers the device-local on/off preference.

## Artwork update validation

- 16 distinct generated assets, all referenced and loading successfully.
- Browser checks at 320, 390, 650, 768, 1024 and 1440px: no horizontal overflow or broken images after decoding.
- Visual review of hero, countdown, ceremony, dress code, timeline, recovery, gifts, FAQ, RSVP and footer; revised frame padding and floral borders to keep text clear.
- All 76 scroll-reveal targets become visible during a full-page scroll; reduced-motion mode leaves the content visible.
- FAQ expansion and RSVP attendance conditional fields still work; form controls retain 16px text.
- TypeScript and production build passed. No real-device or Lighthouse performance claim is made.

## Mobile optimization

WebP images replace the original PNGs; responsive 640/1280px chateau sources use browser srcset selection and lazy loading. Full-resolution originals are retained outside the public folder. Audio uses a 128 kbps MP3 and remains preload=none until a play gesture. RSVP inputs use 16px text, map/calendar actions and radio-label hit areas are at least 44px tall. Tablet layouts collapse before content becomes cramped.
