import db from './dexie'
import { deleteWordsSet } from './wordsSets'

export type TWord = {
  id?: string
  word: string
  transcription?: string
  translation: string
  wordData?: TWordData
  sets?: string[]
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

export const getWords = async (): Promise<TWord[]> => {
  return await db.words.toArray()
}

export const createWord = async (word: TWord) => {
  return await db.words.add({ ...word })
}

export const createWords = async (words: TWord[]) => {
  return await db.words.bulkAdd(words)
}

export const modifyWord = async (word: TWord) => {
  return await db.words.put(JSON.parse(JSON.stringify(word)))
}

export const deleteWord = async (wordId: string) => {
  const deleteResult = await db.words.delete(wordId)

  const setToUpdate = await db.wordsSets
    .filter(({ wordIds }) => wordIds.includes(wordId))
    .toArray()
  for (const set of setToUpdate) {
    if (set.wordIds.includes(wordId)) {
      const updatedWordsIds = set.wordIds.filter((id: string) => id !== wordId)
      if (updatedWordsIds.length === 0) {
        await deleteWordsSet(set.id as string, set.name)
      } else {
        await db.wordsSets.update(set.id as string, {
          wordIds: updatedWordsIds,
        })
      }
    }
  }

  return deleteResult
}

export const getWordData = async (word: string): Promise<TWordData> => {
  if (!word) return null

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    )
    if (!response.ok) return null
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error(error)
    return null
  }
}
