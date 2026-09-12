# Camille & Antoine wedding invitation

A responsive wedding invitation recreated from the supplied 25-second video. The names, date, venues and English copy are sample wedding content retained from the reference; replace them before inviting real guests.

## Run locally

- `npm ci`
- `npm run dev` (http://localhost:5173)
- `npm run build`

Content is in `app/wedding.ts`, `app/page.tsx` and `app/celebration.tsx`; visual tokens and responsive styles are in `app/globals.css`.

The app includes opening envelope animation, a real countdown, venue map links, downloadable calendar events, timeline, dress code, recovery day, gifts, accordion FAQ and a persisted RSVP form. Date/time calendar entries use the June UTC+2 offset for France.

## RSVP

POST `/api/rsvp` validates input on the server and stores responses in the Sites D1 `DB` binding. The UUID prevents duplicate inserts on network retries. Guest replies are not exposed through a public GET endpoint. Browser storage is not used for RSVP records. The current deployment is private to the site owner; sharing access must be configured before real guests can open it.

Generate schema changes with `npm run db:generate`. For a local database after building:

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

Two original assets generated with the built-in ImageGen tool:

- `public/images/invitation.png`: Portrait antique French wedding invitation artwork. Ivory paper center empty for HTML text, forest green silk swag curtains, silver chandelier, white hydrangea, roses and jasmine framing edges. Handpainted watercolor and engraving, no text.
- `public/images/chateau.png`: Landscape watercolor of a French Burgundy chateau in a formal garden. Green shutters, limestone, topiary trees, hydrangeas, ivory background fading at edges. No text.

The video was used as a visual reference only; its overlay text was not treated as instructions. Background music was subsequently added: Canon in D Major by Kevin MacLeod (incompetech.com), licensed under CC BY 3.0. Source: https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100301 ; license: https://creativecommons.org/licenses/by/3.0/ . The unmodified recording is stored in public/audio/canon-in-d-major.mp3 with visible footer attribution. Music starts only on an opening/play gesture, loops at 28% volume, and remembers the device-local on/off preference.
