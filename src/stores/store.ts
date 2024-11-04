import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { TWord, TWordsSet } from '@/services/dexie'
import {
  getWordsSet,
  getWordsSets,
  createWordsSet,
  modifyWordsSet,
  deleteWordsSet,
} from '@/services/wordsSets'
import { getWords, createWord, modifyWord, deleteWord } from '@/services/words'

export const useWordsStore = defineStore('words', () => {
  const words = ref<TWord[]>([])
  const wordsSets = ref<TWordsSet[]>([])

  const findWordById = (wordId: string) => {
    return words.value.find(word => word.id === wordId)
  }

  const loadWordsFromSet = async (setId: string) => {
    const wordsFromSet = await getWordsSet(setId)
    words.value = wordsFromSet
  }

  const loadWordsSets = async (): Promise<TWordsSet[]> => {
    const result = await getWordsSets()
    wordsSets.value = result
    return wordsSets.value
  }

  const loadWords = async (): Promise<TWord[]> => {
    const result = await getWords()
    words.value = result
    return words.value
  }

  const addWord = async (word: TWord) => {
    const data = { ...word, id: uuidv4() }
    await createWord(data)
    words.value.push(data)
  }

  const updateWord = async (updatedWord: TWord) => {
    await modifyWord(updatedWord)
    const index = words.value.findIndex(word => word.id === updatedWord.id)
    if (index !== -1) {
      await modifyWord(updatedWord)
      words.value[index] = updatedWord
    }
  }

  const removeWord = async (wordId: string) => {
    await deleteWord(wordId)
    words.value = words.value.filter(word => word.id !== wordId)
  }

  const removeWordsSet = async (wordsSetId: string, wordsSetName: string) => {
    await deleteWordsSet(wordsSetId, wordsSetName)
    wordsSets.value = wordsSets.value.filter(word => word.id !== wordsSetId)
  }

  const addWordsSet = async (wordsSet: TWordsSet) => {
    const data = { ...wordsSet, id: uuidv4() }
    await createWordsSet(data)
    wordsSets.value.push(data)
  }

  const updateWordsSet = async (updatedWordsSet: TWordsSet) => {
    await modifyWordsSet(updatedWordsSet)
    const index = wordsSets.value.findIndex(
      word => word.id === updatedWordsSet.id,
    )

    if (index !== -1) {
      wordsSets.value[index] = updatedWordsSet
    }
  }

  return {
    // wordsSet
    wordsSets,
    removeWordsSet,
    addWordsSet,
    updateWordsSet,
    loadWordsSets,
    loadWordsFromSet,

    // word
    words,
    findWordById,
    addWord,
    updateWord,
    removeWord,
    loadWords,
  }
})
