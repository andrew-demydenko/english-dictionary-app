import dictionaryDB from './dbOld'
import { v4 as uuidv4 } from 'uuid'

export const getWords = async (): Promise<TWord[]> => {
  try {
    const words = await dictionaryDB.getAllItems('words')
    return words as TWord[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getWordSets = async (): Promise<TSet[]> => {
  try {
    const sets = await dictionaryDB.getAllItems('wordsSets')
    return sets as TSet[]
  } catch (error) {
    console.error(error)
    return []
  }
}

type TSet = {
  id?: string
  name: string
  wordIds: string[]
}

export const saveWordsSet = async ({ name, wordIds }: TSet) => {
  const db = dictionaryDB.getDB()

  if (!db) {
    return
  }
  return new Promise(async (resolve, reject) => {
    const set = await dictionaryDB.searchByField<string, TSet>({
      storeName: 'wordsSets',
      fieldName: 'wordsSet',
      value: name,
      unique: true,
    })

    console.log(set)
    if (set) {
      return reject(`Set with the name "${name}" already exists.`)
    }

    const transaction = db.transaction(['wordsSets', 'words'], 'readwrite')
    const setsStore = transaction.objectStore('wordsSets')
    const wordsStore = transaction.objectStore('words')

    const newSet = { name, wordIds: wordIds.slice(), id: uuidv4() }
    setsStore.put(newSet)

    if (!wordIds.length) {
      return resolve(newSet)
    }
    wordIds.forEach(wordId => {
      const getRequest = wordsStore.get(wordId)

      getRequest.onsuccess = () => {
        const word = getRequest.result

        if (word) {
          if (!word.sets) {
            word.sets = []
          }
          if (!word.sets.includes(name)) {
            word.sets.push(name)
          }
          wordsStore.put(word)
        }
        resolve(newSet)
      }
    })
  })
}

export const updateSet = async ({ id, name, wordIds }: TSet): Promise<void> => {
  const db = dictionaryDB.getDB()
  return new Promise(async (resolve, reject) => {
    if (!db) return reject('Database not initialized')

    const set = await dictionaryDB.searchByField<string, TSet>({
      storeName: 'wordsSets',
      fieldName: 'wordsSet',
      value: name,
      unique: true,
    })
    if (set && set.id !== id) {
      return reject('Set with the name already exists')
    }
    const transaction = db.transaction(['words', 'wordsSets'], 'readwrite')
    const wordsStore = transaction.objectStore('words')
    const wordsSetsStore = transaction.objectStore('wordsSets')

    const updatedSet = { id, name, wordIds: wordIds.slice() }
    const updateSetRequest = wordsSetsStore.put(updatedSet)

    updateSetRequest.onerror = () => reject('Error updating word set')
    updateSetRequest.onsuccess = async () => {
      try {
        const allWordsRequest = wordsStore.getAll()
        allWordsRequest.onsuccess = () => {
          const allWords = allWordsRequest.result as TWord[]

          allWords.forEach(word => {
            if (word.sets?.includes(name) && !wordIds.includes(word.id || '')) {
              word.sets = word.sets.filter(
                (setName: string) => setName !== name,
              )
              wordsStore.put(word)
            }
          })

          wordIds.forEach(wordId => {
            const getWordRequest = wordsStore.get(wordId)
            getWordRequest.onsuccess = () => {
              const word = getWordRequest.result
              if (word) {
                word.sets = word.sets || []
                if (!word.sets.includes(name)) {
                  word.sets.push(name)
                  wordsStore.put(word)
                }
              }
            }
          })

          resolve()
        }

        allWordsRequest.onerror = () => reject('Error retrieving all words')
      } catch (error) {
        reject(`Error updating set in words ${error}`)
      }
    }
  })
}

export const deleteSet = async (
  setId: string,
  setName: string,
): Promise<void> => {
  const db = dictionaryDB.getDB()
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')

    const transaction = db.transaction(['words', 'wordsSets'], 'readwrite')
    const wordsStore = transaction.objectStore('words')
    const wordsSetsStore = transaction.objectStore('wordsSets')

    const deleteSetRequest = wordsSetsStore.delete(setId)

    deleteSetRequest.onsuccess = () => {
      const getAllWordsRequest = wordsStore.getAll()

      getAllWordsRequest.onsuccess = () => {
        const allWords = getAllWordsRequest.result as TWord[]

        allWords.forEach(word => {
          if (word.sets && word.sets.includes(setName)) {
            word.sets = word.sets.filter((name: string) => name !== setName)
            wordsStore.put(word)
          }
        })

        resolve()
      }

      getAllWordsRequest.onerror = () => reject('Error retrieving all words')
    }

    deleteSetRequest.onerror = () => reject('Error deleting word set')
  })
}

export const getSetWords = async (id: string) => {
  try {
    console.log(id)
  } catch (error) {
    console.error(error)
    return []
  }
}

export type TWord = {
  id?: string
  word: string
  transcription?: string
  translation: string
  wordData?: TWordData
  sets?: string[]
}

export const addWord = async (word: TWord) => {
  try {
    return await dictionaryDB.addItem('words', word)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateWord = async (word: TWord) => {
  try {
    return await dictionaryDB.updateItem('words', word)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteWord = async (word: TWord) => {
  try {
    return await dictionaryDB.deleteItem('words', word.id || '')
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getWordTranscription = async () => {}

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

export const getWordData = async (word: string): Promise<TWordData> => {
  if (!word) {
    return null
  }
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    )

    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error(error)
    return null
  }
}
