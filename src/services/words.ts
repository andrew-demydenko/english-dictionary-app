import db, { type TWord, type TWordData } from './dexie'

export const getWords = async (): Promise<TWord[]> => {
  return await db.words.toArray()
}

export const createWord = async (word: TWord) => {
  return await db.words.add({ ...word })
}

export const modifyWord = async (word: TWord) => {
  return await db.words.put(JSON.parse(JSON.stringify(word)))
}

export const deleteWord = async (wordId: string) => {
  return await db.words.delete(wordId)
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
