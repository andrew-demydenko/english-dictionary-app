class DictionaryDB {
  private dbName = 'DictionaryDB'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('words')) {
          const store = db.createObjectStore('words', {
            keyPath: 'id',
          })
          store.createIndex('wordIndex', 'word')
        }
        if (!db.objectStoreNames.contains('wordsSets')) {
          const store = db.createObjectStore('wordsSets', {
            keyPath: 'id',
          })
          store.createIndex('wordsSetIndex', 'name', { unique: true })
        }
      }

      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve('IndexedDB initialized')
      }

      request.onerror = event => {
        reject(event)
      }
    })
  }

  getDB(): IDBDatabase | null {
    return this.db
  }

  async addItem<T>(storeName: string, item: T): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      console.log(item)
      const request = store.add(item)

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject('Error adding item')
    })
  }

  async getItem<T>(storeName: string, id: number): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result as T)
      request.onerror = () => reject('Error getting item')
    })
  }

  async updateItem<T>(storeName: string, updatedItem: T): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      const request = store.put(updatedItem)

      request.onsuccess = () => resolve()
      request.onerror = () => reject('Error updating item')
    })
  }

  async deleteItem(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject('Error deleting item')
    })
  }

  async getAllItems<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as T[])
      request.onerror = () => reject('Error getting all items')
    })
  }

  async searchByField<T extends IDBValidKey, Y>({
    storeName,
    fieldName,
    value,
    unique = false,
  }: {
    storeName: string
    fieldName: string
    value: T
    unique?: boolean
  }): Promise<Y> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized')

      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(`${fieldName}Index`)

      const request = unique ? index.get(value) : index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject('Error searching by field')
    })
  }
}

export default new DictionaryDB()
