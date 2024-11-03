import db, { type TWordsSet, type TWord } from './dexie'

export const getWordsSets = async (): Promise<TWordsSet[]> => {
  return await db.wordsSets.toArray()
}

export const getWordsSet = async (setId: string): Promise<TWord[]> => {
  const set = await db.wordsSets.get(setId)
  if (!set) {
    return []
  }
  return (await db.words.bulkGet(set.wordIds)) as TWord[]
}

export const createWordsSet = async ({ name, wordIds, id }: TWordsSet) => {
  const existingSet = await db.wordsSets.where('name').equals(name).first()

  if (existingSet) {
    throw new Error(`Set with the name "${name}" already exists.`)
  }

  console.log(name, wordIds, id)
  const newSet: TWordsSet = { name, wordIds: wordIds.slice(), id }
  await db.wordsSets.add(newSet)

  await db.words.bulkGet(wordIds).then(words => {
    const updatedWords = words
      .map(word => {
        if (word) {
          word.sets = word.sets || []
          if (!word.sets.includes(name)) {
            word.sets.push(name)
          }
        }
        return word
      })
      .filter((word): word is TWord => word !== undefined)
    db.words.bulkPut(updatedWords)
  })

  return newSet
}

export const modifyWordsSet = async ({
  id,
  name,
  wordIds,
}: TWordsSet): Promise<void> => {
  const existingSet = await db.wordsSets.where('name').equals(name).first()

  if (existingSet && existingSet.id !== id) {
    throw new Error(`Set with the name "${name}" already exists.`)
  }

  await db.wordsSets.put({ id, name, wordIds: wordIds.slice() })

  const allWords = await db.words.toArray()

  const wordsToRemoveSet = allWords.filter(
    word => word.sets?.includes(name) && !wordIds.includes(word.id || ''),
  )
  wordsToRemoveSet.forEach(word => {
    word.sets = word.sets?.filter(setName => setName !== name)
  })
  await db.words.bulkPut(wordsToRemoveSet)

  const wordsToAddSet = await db.words.bulkGet(wordIds)
  wordsToAddSet.forEach(word => {
    if (word && !word.sets?.includes(name)) {
      word.sets = word.sets || []
      word.sets.push(name)
    }
  })
  await db.words.bulkPut(wordsToAddSet as TWord[])
}

export const deleteWordsSet = async (
  setId: string,
  setName: string,
): Promise<void> => {
  await db.wordsSets.delete(setId)

  const words = await db.words.toArray()
  words.forEach(word => {
    if (word.sets?.includes(setName)) {
      word.sets = word.sets.filter(name => name !== setName)
    }
  })
  await db.words.bulkPut(words)
}
