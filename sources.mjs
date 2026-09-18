/**
 * The six collections that attest German, and where each one comes from.
 *
 * This is the only language-specific file in the repository. Everything it says about *how* to
 * read a collection lives in `@blinkered/attestation`; what it says here is which collections,
 * and why those.
 *
 * **Chosen for register, not only for independence.** The first German build used Tatoeba,
 * Gutenberg and Wikisource — three unrelated organizations, which satisfies the rule — and
 * dropped OKAY, PIZZA, FERNSEHER and KÜHLSCHRANK, because two of the three are pre-1930s
 * literature and the third is curated teaching sentences. Blinkered's German candidates come
 * from film subtitles, so the list is spoken, colloquial and modern. The collections have to
 * reach that. Leipzig's 2024 news and 2021 web sets, and German Wikipedia, are what do.
 */

import { createReadStream, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  gutenbergBody,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

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

export const SOURCES = [
  {
    id: 'dewiki',
    what: 'German Wikipedia, modern encyclopedic prose',
    documents: () => wikiDocuments(`${CACHE}dewiki.xml.bz2`),
  },
  {
    id: 'lznews',
    what: 'Leipzig deu_news_2024_1M, modern news',
    documents: () => leipzig('deu_news_2024_1M'),
  },
  {
    id: 'lzweb',
    what: 'Leipzig deu-de_web_2021_1M, modern web prose',
    documents: () => leipzig('deu-de_web_2021_1M'),
  },
  {
    id: 'tat',
    what: 'Tatoeba German sentences, contemporary and conversational',
    documents: () => tatoebaDocuments(`${CACHE}deu_sentences.tsv`),
  },
  {
    id: 'gut',
    what: 'Project Gutenberg German, published books',
    documents: () => {
      const dir = `${CACHE}gutenberg-de`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'dewikisource',
    what: 'German Wikisource, digitised older published texts',
    documents: () => wikiDocuments(`${CACHE}dewikisource.xml.bz2`),
  },
]

/**
 * Where the common tier is cut.
 *
 * Carried over from Blinkered's own calibration, which sizes it by board density rather than by
 * a round number. It has to be re-measured against the rebuilt list before anything ships; see
 * this repository's README.
 */
export const COMMON_CUT = 16_918
