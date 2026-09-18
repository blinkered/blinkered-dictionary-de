# Blinkered dictionary: German

The German word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](../blinkered-attestation). The rule, the evidence format and
the reasoning live there; what lives here is German.

## What is in this repository

```
sources.mjs        which collections attest German, and why those six
build.mjs          runs the scan and writes the three files below
ATTESTATIONS.tsv   the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
```

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's current German list. The dictionaries that built it — the
`en.wiktionary` German category, CC BY-SA — are demoted to **proposing words worth looking up**.
Nothing they say survives into `words.txt` except as a question this build answered.

Six collections answer it:

| | register |
| --- | --- |
| German Wikipedia | modern encyclopedic prose |
| Leipzig `deu_news_2024_1M` | modern news |
| Leipzig `deu-de_web_2021_1M` | modern web prose |
| Tatoeba German | contemporary, conversational |
| Project Gutenberg German | published books |
| German Wikisource | digitised older published texts |

## Why six, and why those

**Register** is the variety of language that suits a setting: formal or casual, written or
spoken, technical or everyday. Same language, different words. A collection of text is never a
neutral sample of a language — it is a sample of one register.

The first build used three — Tatoeba, Gutenberg and Wikisource. Three unrelated organizations,
three separate downloads, and the rule was satisfied. It dropped OKAY, PIZZA, FERNSEHER,
KÜHLSCHRANK, HOMEPAGE and TSCHÜSS.

Two of those three collections are pre-1930s literature and the third is curated teaching
sentences. Blinkered's German candidates come from film subtitles, so the list is spoken,
colloquial and modern, and none of the three could reach it. Adding a fourth collection of
nineteenth-century novels would have satisfied the rule again and changed nothing.

```
                                     kept              OKAY, PIZZA, FERNSEHER
  tat + gut + wikisource             30,288  (83.0%)   dropped
  + Leipzig news, Leipzig web        34,061  (93.3%)   kept
  + German Wikipedia                 35,682  (97.8%)   kept
```

Register is not a nicety here. It is the difference between a defensible list and a broken one.

## Reading the result

**The keep rate is not the check. The drop list is.** A build that keeps a plausible-looking 83%
and drops PIZZA looks healthy in every summary number, and only `dropped.tsv` says otherwise.

It is sorted by how close each word came — two sources first, then one, then none — because a
word two collections attest is evidence of a missing collection, and a word nothing attests is
not. Someone who speaks German should read it before this list ships.

## Rebuilding

```sh
pnpm install
pnpm build      # writes ATTESTATIONS.tsv, words.txt, dropped.tsv
pnpm conform    # checks that words.txt says only what ATTESTATIONS.tsv supports
```

Collections are expected under `.cache/raw/`. They are not downloaded automatically, because
they total roughly 8GB and fetching that as a side effect of a build is rude.

## Before this ships

The common-tier cut in `sources.mjs` is carried over from Blinkered's calibration against the
**old** list. Blinkered sizes it by board density rather than by a round number, and the list has
changed, so it has to be re-measured — `pnpm dictionary weights` then `pnpm dictionary floor`, in
that order. Skipping it is a silent fault rather than a loud one: the word floor ends up above
what any board can reach, every draw is rejected, and the generator plays its best failed attempt
while reporting failure.
