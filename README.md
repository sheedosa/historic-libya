# HistoricLibya

An editorial, museum-luxury home page for **HistoricLibya** — a history library and specialist heritage-travel company for Libya. Two thousand years of Greek, Roman and Saharan heritage, and the expert-led journeys that take you there.

Built as a fully static, self-contained site (HTML / CSS / vanilla JS) — no build step required.

## What's inside

- **Cinematic hero** over the Roman theatre at Sabratha, with the Marcellus inscriptional serif as the signature typeface.
- **Full section system** — value pillars, a 10-era horizontal-scroll timeline (drag + arrows + progress rail), an asymmetric sites grid, key figures, a teal *Visit Libya* travel band with sample itineraries, journal, and a working newsletter form.
- **Fully bilingual (English / Arabic)** — the EN / ع switch in the nav flips the entire site to professional Arabic with full right-to-left layout, the **Tajawal** typeface, mirrored arrows and timeline, and a remembered language preference.
- **Fully interactive** — frosted-on-scroll nav with scroll-spy, full-screen mobile menu, scroll reveals, email validation and smooth anchors — all collapsing under `prefers-reduced-motion`.
- **Real photography** of Sabratha, Leptis Magna, Apollonia, Cyrene and the Ptolemais coast, bundled under `assets/`.

## Structure

```
index.html                 # the page
design-system/tokens.css   # colour, type and spacing tokens
styles/main.css            # components and layout
scripts/site.js            # interactions (nav, timeline, reveals, forms)
assets/images/             # photography
```

## Running locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Credit

Designed in [Claude Design](https://claude.ai/design) and implemented with Claude Code.
