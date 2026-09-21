# Blinkered dictionary: German

The German word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](../blinkered-attestation). The rule, the evidence format and
the reasoning live there; what lives here is German.

## What is in this repository

```
sources.mjs        which collections attest German, and why those
attestations/      the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
SATURATION.md      what each family was worth, measured from the evidence
searched.tsv       the harvest: which pages were fetched, and what they held
```

The evidence is a **directory** rather than one file because German's runs to sixty megabytes
and GitHub warns above fifty. Each shard is a complete, independently valid evidence file with
its own header and digest; `readEvidence` puts them back together and refuses a repository that
somehow holds both layouts. Nothing reads them by globbing.

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's current German list. The dictionaries that built it — the
`en.wiktionary` German category, CC BY-SA — are demoted to **proposing words worth looking up**.
Nothing they say survives into `words.txt` except as a question this build answered.

Twelve collections answer it, in five families:

| family | collections | register |
| --- | --- | --- |
| Wikimedia | German Wikipedia, German Wikisource | encyclopedic prose; digitised older texts |
| Leipzig | seven news and web packages, 2018 to 2024 | modern news and web prose |
| Tatoeba | German sentences | contemporary, conversational |
| Gutenberg | German books | published literature |
| eBible | `deuelo` | scripture, a register of its own |

Twelve collections and five families, and the second number is the one that counts. Two Wikimedia
projects are one organization making one editorial decision about what German is; seven Leipzig
packages are one crawler run seven times. The rule asks for three *independent* families, and
counting collections instead would let a language pass on a single source consulted repeatedly.

## Why those, and why five families

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

## What each family was worth

[`SATURATION.md`](SATURATION.md) has the curve, measured from the committed evidence. The short
version: German's third family took it to 92.6% and its fifth added sixteen words. This is a
language with more text behind it than the question needs.

**The harvest is collected and not yet counted.** `searched.tsv` holds 1,990 pages fetched from
ten German publishers, gathered to chase the last few hundred words. The build that produced the
current evidence finished forty minutes before the harvest did, so those pages are recorded here
and are not in `attestations/`. The next rebuild folds them in; at 97.9% the words at stake are
few, and the honest thing is to say which files the numbers come from rather than to leave a
reader to assume.

## Reading the result

**The keep rate is not the check. The drop list is.** A build that keeps a plausible-looking 83%
and drops PIZZA looks healthy in every summary number, and only `dropped.tsv` says otherwise.

It is sorted by how close each word came — two sources first, then one, then none — because a
word two collections attest is evidence of a missing collection, and a word nothing attests is
not. Someone who speaks German should read it before this list ships.

## Rebuilding

```sh
pnpm install
pnpm build       # writes the evidence, words.txt, dropped.tsv
pnpm conform     # checks that words.txt says only what the evidence supports
pnpm saturation  # re-measures what each family was worth
pnpm verify --sample 10      # fetches cited pages and checks they hold the word
pnpm harvest 250 # fetches more pages from the publishers in DOMAINS
```

A change here is not finished until the roll-up in `blinkered-attestation` is regenerated —
`node scripts/languages.mjs` there. That is [the rule](../blinkered-attestation/README.md#the-rule-for-changing-a-language),
and it exists because a summary nobody can trust is worse than no summary.

Collections are expected under `.cache/raw/`. They are not downloaded automatically, because
they total roughly 8GB and fetching that as a side effect of a build is rude.

## Before this ships

The common-tier cut in `sources.mjs` is carried over from Blinkered's calibration against the
**old** list. Blinkered sizes it by board density rather than by a round number, and the list has
changed, so it has to be re-measured — `pnpm dictionary weights` then `pnpm dictionary floor`, in
that order. Skipping it is a silent fault rather than a loud one: the word floor ends up above
what any board can reach, every draw is rejected, and the generator plays its best failed attempt
while reporting failure.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the
project: a licence that claimed more than we can support would undo the argument the
evidence is here to make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, `attestations/*.tsv`, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `CC-BY-SA-4.0` | `dropped.tsv` — **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were
found to contain it. The record of which collections, and where in them, is a statement
of fact about those texts rather than a copy of them, and nothing a licence governs was
taken from the dictionary that proposed the candidates. To the extent any right subsists
in the compilation, it is waived.

**Why `dropped.tsv` is not.** Every other file here rests on evidence we gathered. That
one does not: it is the candidates that failed, and a candidate that failed is a word we
have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms — here
`CC-BY-SA-4.0`. See
[`blinkered-attestation/candidates/de/LICENSE`](https://github.com/blinkered/blinkered-attestation/blob/main/candidates/de/LICENSE).
