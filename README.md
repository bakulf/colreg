# COLREG

A drill app for the collision regulations, built to prepare for the RYA
Yachtmaster Shorebased instructor exam. Covers IRPCS (COLREGs), IALA buoyage in
Regions A and B, lights ashore, the magnetic compass, and tidal streams.

## Separate sections, never mixed

The home page has one tile per subject — COLREG, IALA buoyage, lights ashore,
the magnetic compass, tidal streams — each showing how much of it you would recall now and
what is due. Each subject is its own section with its own topics, its own
session and its own progress summary, and a paper is drawn from one of them
only. The list lives in `src/ui/subjects.tsx`; adding a subject there adds its
tile and its route (`#/colreg`, `#/iala`, `#/lights`, `#/compass`,
`#/streams`).

COLREG is divided the way the Convention divides itself: Part A (General),
Part B in its three Sections — I, any condition of visibility; II, vessels in
sight of one another; III, restricted visibility — then Parts C, D, E and F, and
the Annexes. A question belongs to the Part its first citation is in, and
`src/core/topics.test.ts` holds every question to that, generated ones
included. IALA is divided by mark category: lateral, cardinal, isolated
danger, safe water, special, and emergency wreck marking, as IALA
Recommendation R1001 (Ed. 2.0, June 2023) arranges them. The two regions differ
only in the lateral marks — Region B reverses the colours and keeps the shapes —
so lateral marks are two topics, one per region, and everything else is one.
Every lateral drill names its region and draws its wrong answers from that
region only: a red flash is port-hand in A and starboard-hand in B.

### Lights ashore

Lighthouses, beacons and sector lights, divided by the IALA recommendations
that govern them:

- **Rhythmic characters** — IALA R0110 (Ed. 5.0, June 2021). Each character
  is described by class, grouping, colour and period; its timeline is built
  from the timings R0110 uses in its examples, and `violations()` checks it
  against every limit R0110 sets (Table 1 maximum periods, eclipse ratios,
  quick-light rates, group sizes). The tests run the whole catalogue through
  it. Drills flash the light at true speed and ask for the chart notation;
  distractors are recoloured to the answer's colour, so the rhythm is the
  question.
- **Reading the chart** — what `Fl(3)WRG.15s21m18-14M` says, written as
  chart 5011 prints it (two ranges `18/14M` in the order of the colours, three
  or more `18-14M`, greatest and least), and sector limits as true bearings
  from seaward.
- **Range** — IALA R0202 (E-200-2, Ed. 2.1, December 2017): nominal range is
  the luminous range in 10 miles visibility, and luminous range for any other
  visibility comes from Allard's law, as R0202 prescribes. Geographic range is
  2.08 × (√H + √h); IHO S-12 uses 2.03, and the drills are checked to give the
  same answer with either.

### The magnetic compass

Divided by the items of section 2 of the RYA Coastal Skipper / Yachtmaster
Offshore syllabus: variation (allowing for it, and its change with time and
position), deviation (its causes, and allowing for it), checking for deviation
— "checks, but not correction" — and types of compass.

Everything rests on two lines, with east positive: magnetic = compass +
deviation, true = magnetic + variation. The drills build a situation — a
compass rose printed as on the chart ("4°15'W 2009 (8'E)"), a deviation card
tabulated against ship's head by compass, as in the training almanac — and
offer as wrong answers what the classic mistakes produce: a sign the wrong
way, a step left out, the card read for the bearing instead of the ship's head,
deviation applied to a hand-bearing compass. `compass.test.ts` re-reads every
generated prompt and recomputes its answer independently.

Roses and cards are invented for practice.

### Tidal streams, without a plotter

Divided by the items of section 4 of the syllabus — tidal stream information,
allowing for streams in a course to steer, races and overfalls, observing the
stream — with the estimated position of section 1, which is the same triangle
worked after the event.

On a phone there is no chart and no plotter, so the chartwork is split into
the steps an examiner checks, and each is a question for the head: which row
of the diamond applies, the rate interpolated by range (round ranges, simple
fractions), which way and how far to steer up-tide by the one-in-sixty rule
(streams straight across the track, at rates that give whole degrees), leeway
into the wind, then variation; arrival times with a fair or foul stream; the
EP as the stream's drift from the DR. One drill shows four triangles and asks
which is built right — the construction itself, which is what the examiner
looks at. After answering, the app draws the exact triangle with the
conventional arrows (one for the water track, two ground, three stream), and
the tests check that the mental answer and the exact solution agree within a
degree.

Diamonds, ports and passages are invented.

The IALA recommendations are published at
[github.com/IALAPublications/Recommendations](https://github.com/IALAPublications/Recommendations).
They are cited and paraphrased here, not reproduced.

## Running it

```sh
npm install
npm run dev        # http://localhost:5173 and on the LAN
```

`npm run dev` binds to all interfaces, so the Network address it prints works
from a phone or tablet on the same Wi-Fi. No build step, no app store, no
account — progress is kept in `localStorage` on the device.

## Offline and on a phone

The built site is a Progressive Web App. Open it once and it works with no
network from then on — cold start included — and *Add to Home Screen* (iOS)
or *Install app* (Android, desktop Chrome and Edge) installs it with its own
icon, full screen.

- `public/manifest.webmanifest` and `public/icons/` make it installable. The
  icons are drawn in `icon.svg` and `icon-maskable.svg`; the PNGs are rendered
  from them.
- `pwa/sw.js` is the service worker, and `pwa/plugin.ts` the Vite plugin that
  fills in, at build time, the exact list of files the build emitted and a
  version hashed from their contents and the worker's own code. Everything is
  precached at install and served cache-first; Vite's file names are
  content-hashed, so a cached file is never stale, and each deploy is a new
  worker with a new cache.
- A new version waits instead of taking over. The app shows *A new version is
  ready — Reload*, so an update never swaps the code under a quiz in progress.
- Installed to the home screen, it asks the browser to keep its storage
  persistent, so progress is not evicted under storage pressure. Export is
  still the only real backup.

The worker is registered only in a production build, so `npm run dev` behaves
as before. To try the offline behaviour locally, `npm run build && npm run
preview`, load the page once, stop the server and reload.

Service workers need a secure context: HTTPS, or `localhost`. GitHub Pages is
HTTPS, so the published site installs and works offline. The LAN address
`npm run dev` and `npm run preview` print is plain HTTP, so from a phone it
runs but neither installs nor works offline — *Add to Home Screen* makes only
a bookmark. To test the real thing on an Android phone before publishing,
connect it by USB and forward the port so the phone sees it as `localhost`:

```sh
npm run build && npm run preview     # port 4173
adb reverse tcp:4173 tcp:4173        # then open http://localhost:4173 on the phone
```

`chrome://inspect` → *Port forwarding* does the same from desktop Chrome.

Progress lives in `localStorage` and nowhere else, so clearing site data loses
it. **Export** writes a JSON backup; **Import** reads one back, ignoring
anything that does not look like a card rather than wiping what you have.

```sh
npm test           # engine and content validation
npm run typecheck
npm run build      # static bundle in dist/
npm run preview    # serve dist/ on the LAN
```

## Layout

```
src/core/          pure TypeScript — no React, no DOM
  types.ts         Question, QuestionSource, Scene, Domain, Topic
  topics.ts        which Part a citation belongs to, which category a mark
  coastal/         lights ashore: R0110 characters, R0202 and geographic range, drills
  compass/         variation, deviation cards, conversions, and their drills
  tidal/           diamonds, rates, the vector triangle, CTS and EP, and their drills
  rng.ts           seeded RNG, so a session is reproducible from its seed
  rules.ts         index of IRPCS Rules 1–41
  regs/            the full text of Rules 1–41 and Annexes I–IV, and citation parsing
  vessels.ts       every vessel configuration in Part C
  questions/       hand-written content, one file per topic
  lights/          Rule 21 arcs, vessel lights, projection, night drills
  shapes/          day signals and their drills
  buoyage/         IALA marks, Regions A and B, and their light characters
  scenarios/       encounter geometry, Rules 9–19, and their drills
  signals/         Rule 34 and 35 sound signals as timelines
  distress/        Rule 37 and Annex IV, and the signals mistaken for them
  ruleindex/       what each rule says, drilled by number and by subject
  quiz.ts          session state machine, timing and scoring
  srs.ts           the spaced-repetition scheduler
  progress.ts      per-concept tally
src/storage.ts     the only place that touches localStorage
src/pwa.ts         service worker registration and the update prompt
pwa/               the service worker template and the Vite plugin that fills it in
src/ui/            React views, the SVG renderers and the Regulations reader
```

The `core/` boundary is deliberate. Everything the learning engine does is
independent of how it is displayed, so the renderers and generators planned
below can be added without touching the engine, and a native shell could reuse
the whole layer unchanged.

### Concepts, not questions

A `Question` carries a `concept` — the thing actually being tested. Progress is
tracked per concept, and the quiz engine talks only to `QuestionSource`, which
mints a question on demand. Some sources return a fixed hand-written question;
the light sources build a new one on every call. Nothing downstream needs to
know the difference, which is also why progress survives a concept gaining a
generator.

### The light drills

A vessel is described by what she is, not by a picture: `{ kind: 'trawler',
lengthM: 62, makingWay: true }`. From that, `lightsFor` produces the lights she
carries and where they sit; `project` decides which of them reach an observer at
a given relative bearing, using the Rule 21 arcs themselves. The renderer only
plots the result, so the drawing cannot show a light the Rules do not allow.

Views are the **eight standard relative bearings**, not arbitrary ones. The set
of lights a vessel shows changes only at a cut-off bearing, so the horizon holds
four genuinely different answers to "which lights can I see", not 3600. Drawing
her at 37.4° rather than 45° teaches nothing extra and costs the student a
geometry problem while they are still learning that green over white means
trawling. The bearing is captioned under the picture for the same reason.

Three properties are enforced rather than hoped for, and tested:

- **Every vessel the picture could be is named in the answer.** Part C gives
  different vessels identical lights: a vessel under tow shows exactly what a
  sailing vessel shows, a motorsailing yacht exactly what a motorboat of her
  size shows, and from ahead a vessel pushing is indistinguishable from one
  towing astern. They are collected into one option, and the drill says why they
  cannot be told apart. Naming only one would be answerable by elimination while
  teaching something false.
- **No two options look alike.** Each candidate distractor is projected at the
  same bearing and rejected if its picture matches the answer's.
- **Uninformative bearings are skipped.** Dead astern nearly everything is a
  single white sternlight; bearings where more than three vessels share the
  picture are passed over for ones that discriminate.

Day signals get their own model and renderer. They carry no arcs and no aspect,
and they resolve far less than the lights do — so vessels are described at the
grain the shapes can actually support: every fishing vessel is "a vessel engaged
in fishing", because the two cones say nothing about trawling, length, or
whether she is making way.

The sidelights carry the 2° of overlap across the bow that Annex I §9(a)(i)
permits. That detail is load-bearing: without it, "both sidelights and nothing
above them" — the head-on picture, and the only way a sailing vessel ever shows
two lights at once — would exist at exactly one bearing and could never be
drawn.

## The Regulations

The COLREG text tab carries the full text of Rules 1 to 41 and Annexes I to IV,
with a search. Every citation in a question — the chips under the answer and
any "Rule 17(a)(ii)" or "Annex IV" in the explanation — is a link. In a quiz it
opens the rule over the question with the cited paragraph highlighted, so
checking it does not lose your place; *Open in COLREG text* takes you to the
full reader. The reader keeps its position in the URL (`#/regs/r17-a-ii`), so
the back button works and a paragraph can be linked to.

The text lives in `src/core/regs/text/` in a small line format described in
`src/core/regs/model.ts`: one paragraph per line, nesting by indentation,
labels as printed. Anchors are built from the labels, and
`src/core/regs/regs.test.ts` checks that every citation in the question bank
resolves to the exact paragraph it names.

## Coverage

`src/core/coverage.test.ts` generates every source, collects the rules each one
cites, and fails if any of Rules 1 to 41 is left undrilled. There is no
exclusion list: the coverage claim is checked on every run rather than asserted
in a README that drifts.

All four Annexes are cited. Annex II (fishing vessels in close proximity) and
Annex IV (distress signals) are drilled in depth; Annexes I and III are
construction specifications, so only the few points worth knowing — the
sidelight cut-off, whistle frequencies — are asked.

## Roadmap

- [x] **M0** — project, quiz engine, 65 hand-written questions (definitions 9, steering 21, lights 15, sound 11, buoyage 9)
- [x] **M1** — Part C renderers: 24 vessel types, 39 configurations, drawn in SVG at the eight standard bearings by night and as day shapes, with generated drills
- [x] **M2** — FSRS-style spaced repetition scheduled over concepts, graded from correctness and answer time
- [x] **M3** — sound signals as real-time timelines at true blast lengths
- [x] **M4** — encounter drills generated from geometry and classified by the same code that answers them, including restricted visibility
- [x] **M5** — all twelve IALA Region A marks, by day and by night with the light character flashing at true rate
- [x] **M7** — Rule 37 and Annex IV distress signals, Rule 36 attention signals, and the near-misses people mistake for them
- [x] **M8** — Rule 9 and Rule 10 geometry: narrow channels and traffic lanes, where "shall not impede" displaces the steering rules
- [x] **M9** — the rule index: what each of the 38 rules says, drilled by number, by subject and by wording
- [x] **M10** — the full text of the Regulations, with every citation in a question linked to the paragraph it cites
- [x] **M11** — COLREG and IALA as separate sections, COLREG topics by Part and Section of the Convention, light theme
- [x] **M12** — lights ashore: R0110 characters flashed at true rate, chart notation and sectors, R0202 luminous range and rising/dipping distances
- [x] **M6** — offline PWA: installable, precached, update prompt
- [x] **M13** — IALA Region B: reversed lateral and preferred channel marks, by day and by night
- [x] **M14** — home page with a tile per subject
- [x] **M15** — the magnetic compass: variation, deviation card, checks, types
- [x] **M16** — tidal streams: diamonds, rates by range, course to steer by one in sixty, leeway, EP, triangles
- [ ] Tides: heights, secondary ports, clearances
- [ ] Meteorology

Sound signals stay as timelines, without audio, by choice. There is no exam mode.

## Deploying

`.github/workflows/deploy.yml` typechecks and tests on every push and pull
request, and on `main` publishes the built site to GitHub Pages.

It uses the Pages deployment action rather than committing the build to a
`gh-pages` branch. Both work, but the artifact route keeps built output out of
the repository's history, needs no write permission on `contents`, and gives a
deployment log and a rollback in the Pages UI. There is no branch to keep in
sync and no force-push.

One setting is needed once, in **Settings → Pages → Build and deployment**: set
the source to **GitHub Actions**.

A project site is served from `https://<user>.github.io/<repo>/`, not from the
root, so the workflow passes `BASE_PATH` and `vite.config.ts` uses it. Without
that every asset URL would 404 — the usual way a Vite site fails on Pages.
Local builds leave it unset and serve from `/`.

## Sources and licensing

Rule text is the consolidated text of the Convention as amended, as given
effect in the UK by MSN 1781 (M+F) under the Merchant Shipping (Distress
Signals and Prevention of Collisions) Regulations 1996, published under the
Open Government Licence v3.0, © Crown copyright. Annex IV follows IMO
resolution A.1004(25) and Part F (Rules 39 to 41) resolution A.1085(28).

No RYA course material and no Admiralty chart data is used. Teaching notes and
question wording are original.
