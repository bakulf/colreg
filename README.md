# COLREG

A drill app for the collision regulations, built to prepare for the RYA
Yachtmaster Shorebased instructor exam. Covers IRPCS (COLREGs) and IALA Region A
buoyage.

## Running it

```sh
npm install
npm run dev        # http://localhost:5173 and on the LAN
```

`npm run dev` binds to all interfaces, so the Network address it prints works
from a phone or tablet on the same Wi-Fi. No build step, no app store, no
account — progress is kept in `localStorage` on the device.

To install it as an app on a phone, open the Network URL and use *Add to Home
Screen*. Full offline support arrives with the service worker in M6.

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
  types.ts         Question, QuestionSource, Scene, Topic
  rng.ts           seeded RNG, so a session is reproducible from its seed
  rules.ts         index of IRPCS Rules 1–38
  vessels.ts       every vessel configuration in Part C
  questions/       hand-written content, one file per topic
  lights/          Rule 21 arcs, vessel lights, projection, night drills
  shapes/          day signals and their drills
  buoyage/         IALA Region A marks and their light characters
  scenarios/       encounter geometry, Rules 9–19, and their drills
  signals/         Rule 34 and 35 sound signals as timelines
  distress/        Rule 37 and Annex IV, and the signals mistaken for them
  ruleindex/       what each rule says, drilled by number and by subject
  quiz.ts          session state machine, timing and scoring
  srs.ts           the spaced-repetition scheduler
  progress.ts      per-concept tally
src/storage.ts     the only place that touches localStorage
src/ui/            React views and the four SVG renderers
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

## Coverage

`src/core/coverage.test.ts` generates every source, collects the rules each one
cites, and fails if any of Rules 1 to 38 is left undrilled. There is no
exclusion list: the coverage claim is checked on every run rather than asserted
in a README that drifts.

Annex II (additional signals for fishing vessels in close proximity) and Annex
IV (distress signals) are covered. Annexes I and III are construction and
technical specifications — mounting heights, chromaticity, whistle
frequencies — and carry nothing a drill can usefully ask.

## Roadmap

- [x] **M0** — project, quiz engine, 65 hand-written questions (definitions 9, steering 21, lights 15, sound 11, buoyage 9)
- [x] **M1** — Part C renderers: 24 vessel types, 39 configurations, drawn in SVG at the eight standard bearings by night and as day shapes, with generated drills
- [x] **M2** — FSRS-style spaced repetition scheduled over concepts, graded from correctness and answer time
- [x] **M3** — sound signals as real-time timelines at true blast lengths (audio still to come)
- [x] **M4** — encounter drills generated from geometry and classified by the same code that answers them, including restricted visibility
- [x] **M5** — all twelve IALA Region A marks, by day and by night with the light character flashing at true rate
- [x] **M7** — Rule 37 and Annex IV distress signals, Rule 36 attention signals, and the near-misses people mistake for them
- [x] **M8** — Rule 9 and Rule 10 geometry: narrow channels and traffic lanes, where "shall not impede" displaces the steering rules
- [x] **M9** — the rule index: what each of the 38 rules says, drilled by number, by subject and by wording
- [ ] **M6** — exam mode, audio for the sound signals, offline PWA

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

Rule text is taken from the Merchant Shipping (Distress Signals and Prevention of
Collisions) Regulations 1996 (SI 1996/75), Schedule 1, published on
legislation.gov.uk under the Open Government Licence v3.0, © Crown copyright.

No RYA course material and no Admiralty chart data is used. Teaching notes and
question wording are original.
