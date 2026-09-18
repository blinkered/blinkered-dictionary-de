/**
 * Builds the German list from the evidence, and writes the three files this repository ships.
 *
 * Candidates come from Blinkered's current German list: the dictionaries that made it are
 * demoted to proposing words worth looking up, and nothing they say survives into the output
 * except as a question this build answered.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { alphabetFor } from '@blinkered/engine'
import { build, scan } from '@blinkered/attestation'
import { SOURCES, COMMON_CUT } from './sources.mjs'

const CANDIDATES = process.env.CANDIDATES ??
  '/Users/nick/work/tightline/blinkered/packages/words/data/de/words.txt'

const candidates = new Set(
  readFileSync(CANDIDATES, 'utf8').split('\n').slice(1).filter(Boolean)
    .map((line) => line.split('\t')[0]),
)
const fold = alphabetFor('de').fold
process.stderr.write(`candidates: ${candidates.size}\n`)

const results = []
for (const source of SOURCES) {
  const started = Date.now()
  const result = await scan(source.id, source.documents(), candidates, fold)
  results.push(result)
  process.stderr.write(
    `  ${source.id.padEnd(13)} ${String(result.hits.size).padStart(6)} words  ` +
    `${String(result.tokens).padStart(11)} tokens  ${((Date.now() - started) / 1000).toFixed(0)}s\n`,
  )
}

const today = new Date().toISOString().slice(0, 10)
const built = build('de', today, candidates, results, COMMON_CUT)
writeFileSync('ATTESTATIONS.tsv', built.attestations)
writeFileSync('words.txt', built.words)
writeFileSync('dropped.tsv', built.dropped)

const total = built.kept + built.droppedCount
process.stderr.write(
  `\nkept ${built.kept} (${(100 * built.kept / total).toFixed(1)}%)  ` +
  `dropped ${built.droppedCount} (${(100 * built.droppedCount / total).toFixed(1)}%)\n`,
)
