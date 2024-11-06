import Dexie, { type Table } from 'dexie'
import { saveAs } from 'file-saver'
import { type TWordsSet } from './wordsSets'
import { type TWord } from './words'

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

export const exportDatabaseAsJson = async () => {
  const exportData: Record<string, object[]> = {}

  await Promise.all(
    db.tables.map(async table => {
      const data = await table.toArray()
      exportData[table.name] = data
    }),
  )

  const jsonString = JSON.stringify(exportData, null, 2)

  const blob = new Blob([jsonString], { type: 'application/json' })
  saveAs(blob, 'database_backup.json')
}

export const eraseDatabase = async () => {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map(table => table.clear()))
  })
}

export const importDatabaseFromJson = async (json: string) => {
  const importData = JSON.parse(json)

  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map(table => table.clear()))
    console.log('All data is erased!')
    for (const [tableName, records] of Object.entries(importData)) {
      const table = db.table(tableName)

      if (table) {
        await table.bulkAdd(records as object[])
      } else {
        console.warn(`Table ${tableName} is not found in the database!`)
      }
    }
  })

  console.log('Data import is finished!')
}

const db = new DictionaryDB()
export default db
