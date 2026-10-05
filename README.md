# PSAD website redesign concept

A static rebuild of psadeaf.org. Plain HTML, one stylesheet, one small script. No build step, no framework, no hosting cost.

## Put it on GitHub Pages

1. Create a repository and upload everything in this folder to the root.
2. In the repository, open Settings, then Pages. Set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/` in about a minute.

All links are relative, so it works at a project URL or a custom domain.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home, with the photo time rail and the six doors |
| `about.html` | Mission, vision, core values, board |
| `history.html` | Full timeline, 1900 to 2026, with photo zoom |
| `events.html` | Upcoming and past events |
| `125th.html` | Recap of the September 27, 2026 anniversary |
| `resources.html` | Filterable community resource list and registration form |
| `meetings.html` | Meetings, past notes, sociocracy initiative, ReOrg letter |
| `join.html` | Membership (links to the existing Square checkout) |
| `host.html` | Partner on an event or rent PSAD Hall |
| `donate.html` | Giving (links to the existing Square checkout) |

## Before it goes live

- **Forms.** GitHub Pages cannot receive form posts. Until an endpoint is set, each form opens the visitor's email app addressed to info@psadeaf.org. To collect submissions properly, create a free form endpoint (Formspree, Basin, Getform) and paste its URL into `FORM_ENDPOINT` at the top of `assets/js/site.js`.
- **Social links.** Facebook and Instagram in the footer point to `#`. Search for `TODO` in any page.
- **ASL welcome video.** The home page has a marked slot. Swap it for the snippet in the HTML comment above it, using a YouTube video ID.
- **Next meeting.** Shown as "Date to be announced" on `index.html` and `meetings.html`.
- **Two resource links** (NWWCD, WSDSC) show "Website link coming" because no working site could be confirmed.

## Content to confirm with PSAD

The current site disagrees with itself in a few places. This concept picked one reading for each:

- Founding year: the seal, footer, and history page say 1900; the home banner says "EST. 1901"; the About page says "122 years ago". This concept uses 1900 throughout.
- Timeline years 1904 ("recognized in law") and 1926 ("nonprofit incorporation") were matched to their captions by position on the current page.
- Chefs dinner: the history page says September 2019, the events page says April 28, 2019.
- BBQ and disc golf: July 7, 2022 on one page, July 10, 2022 on another. Shown as "July 2022" in the timeline.
- 1961 entry: the current site calls Dr. Peter Wisher a "Deaf Washingtonian". That wording was left out pending a check.
- 2014 entry: the president's name on the current site looks like a typo, so the name was left out.
- Secretary and one board member have no headshot on the current site; initials are shown.

## Credits

Photos, logos, and text are PSAD's, carried over from the current site, which was designed by Perseus McDaniel. Typefaces: Bricolage Grotesque and Atkinson Hyperlegible Next, both from Google Fonts.
