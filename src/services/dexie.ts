import Dexie, { type Table } from 'dexie'

export type TWord = {
  id?: string
  word: string
  transcription?: string
  translation: string
  wordData?: TWordData
  sets?: string[]
}

export type TWordsSet = {
  id?: string
  name: string
  wordIds: string[]
}

export type TWordData = {
  word: string
  phonetics: {
    text: string
    audio: string
  }[]
  phonetic: string
  sourceUrls: string[]
  meanings: {
    synonyms: string[]
    partOfSpeech: string
    definitions: {
      definition: string
      example: string
      synonyms: string[]
    }[]
  }[]
} | null

class DictionaryDB extends Dexie {
  words!: Table<TWord, string>
  wordsSets!: Table<TWordsSet, string>

  constructor() {
    super('DictionaryDB')
    this.version(1).stores({
      words: 'id, word, translation, sets',
      wordsSets: 'id, name',
    })
  }
}

const db = new DictionaryDB()
export default db
