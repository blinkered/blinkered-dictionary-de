/**
 * The collections that attest German, and where each comes from.
 *
 * The only language-specific file in this repository. How to read a collection lives in
 * `@blinkered/attestation`; what lives here is which collections, and why those.
 *
 * **Chosen for register as much as for independence.** The first German build used Tatoeba,
 * Gutenberg and Wikisource — three unrelated organizations, which satisfies the rule — and
 * dropped OKAY, PIZZA, FERNSEHER and KÜHLSCHRANK, because two of the three are pre-1930s
 * literature and the third is curated teaching sentences. Blinkered's German candidates come
 * from film subtitles, so the list is spoken, colloquial and modern. Leipzig's news and web sets
 * and German Wikipedia are what reach that.
 */

import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'de'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

const LEIPZIG = [
  'deu_news_2024_1M',
  'deu_news_2023_1M',
  'deu_news_2022_1M',
  'deu_news_2021_1M',
  'deu_newscrawl-public_2018_1M',
  'deu-de_web_2021_1M',
  'deu-at_web_2019_1M',
]

export const SOURCES = [
  {
    id: 'wiki:de',
    what: 'German Wikipedia — modern encyclopedic prose',
    needs: `${CACHE}dewiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}dewiki.xml.bz2`),
  },
  {
    id: 'wikisource:de',
    what: 'German Wikisource — same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}dewikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}dewikisource.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg} — modern news and web, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/deu/deu_sentences.tsv.bz2',
    what: 'Tatoeba German — contemporary and conversational',
    needs: `${CACHE}deu_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}deu_sentences.tsv`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg German — published books, a register nothing else here reaches',
    needs: `${CACHE}gutenberg-de`,
    documents: () => {
      const dir = `${CACHE}gutenberg-de`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'ebible:deuelo',
    from: 'https://ebible.org/Scriptures/deuelo_vpl.zip',
    what: 'Elberfelder 1905 — a translation, a family nothing else here belongs to',
    needs: `${CACHE}ebible-de`,
    documents: () => verseDocuments(`${CACHE}ebible-de/deuelo_vpl.txt`),
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive german books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-de`,
    from: 'https://archive.org/details/booksbylanguage_german',
    documents: () => {
      const dir = `${CACHE}archive-de`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      // `files.tsv` maps an item to the file we read; a book with no recorded name is skipped
      // rather than cited at a page that cannot support it.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // The filename is percent-encoded: two thirds of them contain spaces, and a locator with
        // a space in it would split into two locators, because the evidence format spends spaces
        // as separators. Encoding is also what the URL needs.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
].filter((source) => {
  if (existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * German publishers, each its own family, for the harvest that mops up the tail.
 *
 * German starts well off, so these exist to rescue the last few hundred words rather than to
 * carry the language. Across registers, and across the three countries that write it.
 */
export const DOMAINS = [
  // Books and scholarship, a register the news domains above never reach
  'zeno.org', 'deutschestextarchiv.de', 'projekt-gutenberg.org', 'literaturport.de',
  'perlentaucher.de', 'literaturkritik.de',
  'spiegel.de', 'zeit.de', 'faz.net', 'sueddeutsche.de', 'welt.de', 'taz.de',
  'tagesschau.de', 'ndr.de', 'wdr.de', 'br.de', 'heise.de', 'golem.de',
  'kicker.de', 'stern.de', 'focus.de', 'n-tv.de',
  // Austria and Switzerland, which are registers of their own
  'derstandard.at', 'diepresse.com', 'orf.at', 'nzz.ch', 'srf.ch', 'blick.ch',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 16_918
