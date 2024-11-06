<template>
  <v-menu v-model="isMenuActive">
    <template #activator="{ props }">
      <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item @click="showImportPopup = true">
        <v-list-item-title>Import words</v-list-item-title>
      </v-list-item>
      <v-list-item @click="exportDatabaseAsJson">
        <v-list-item-title>Save backup file</v-list-item-title>
      </v-list-item>
      <v-list-item @click="() => {}">
        <v-list-item-title
          >Clear database
          <Confirmation
            @submit="resetDatabase"
            title="Erase database"
            text="Are you sure you want to erase the database?"
          ></Confirmation
        ></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog :loading="formLoading" v-model="showImportPopup" max-width="600px">
    <v-card>
      <div v-if="formLoading" class="loader-overlay">
        <v-progress-circular
          indeterminate
          color="primary"
          size="46"
        ></v-progress-circular>
      </div>
      <v-card-title class="headline">Import Words</v-card-title>
      <div class="px-6 pt-2">
        <v-switch
          color="primary"
          v-model="isBackup"
          label="Import backup"
        ></v-switch>
      </div>
      <v-card-text>
        <v-textarea
          v-model="importText"
          label="Paste your JSON here"
          rows="10"
          outlined
        >
          <template #append>
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-icon v-bind="props" class="ml-2">mdi-help-circle</v-icon>
              </template>
              <pre>{{ isBackup ? importExampleBackup : importExample }}</pre>
            </v-tooltip>
          </template></v-textarea
        >
        <v-alert v-if="isBackup" type="error" variant="flat">
          Data will be erased
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="formLoading || !importText"
          @click="isBackup ? importBackup() : importWords()"
          >Import</v-btn
        >
        <v-btn color="grey-darken-2" @click="onClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Confirmation from '@/components/ConfirmationModal.vue'
import {
  exportDatabaseAsJson,
  importDatabaseFromJson,
  eraseDatabase,
} from '@/services/dexie'
import { type TWord, getWordData } from '@/services/words'
import { storeToRefs } from 'pinia'
import { useWordsStore } from '@/stores/store'
const isMenuActive = ref(false)
const showImportPopup = ref(false)
const importText = ref('')
const formLoading = ref(false)
const isBackup = ref(false)
const wordsStore = useWordsStore()
const { words } = storeToRefs(wordsStore)
import { showSnackbar } from '@/services/snackbar'

const importExample = `Example: [
  {"word": "hello", "translation": "привет"}
]`
const importExampleBackup = `Example: {
  "words": [{
    id: 1,
    "word": "hello",
    "translation": "привет",
    "transcription": "[həˈləʊ]",
    wordData: {...}
  }],
  wordsSets: [{
    id: 1,
    name: "Set 1",
    wordIds: [1, 2, 3]
  }]
}`

const importWords = async () => {
  try {
    const wordsArray = JSON.parse(importText.value)
    const newWords: TWord[] = []

    formLoading.value = true
    for (const [index, item] of wordsArray.entries()) {
      const newWord: TWord = {
        word: item.word,
        translation: item.translation,
        transcription: '',
        wordData: null,
      }

      const existingWord = words.value.find((w: TWord) => item.word === w.word)
      if (!existingWord) {
        if ((index + 1) % 30 === 0) {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
        await new Promise(resolve => setTimeout(resolve, 400))
        //help to avoid limit of service requests
        const data = await getWordData(newWord.word)
        if (data) {
          newWord.transcription = data.phonetic
          newWord.wordData = data
        }

        newWords.push(newWord)
      }
    }

    if (newWords.length > 0) {
      await wordsStore.addWords(newWords)
    }

    showImportSnackbar('Words imported successfully', 'success')
  } catch (error) {
    showImportSnackbar('Error while words importing', 'error')
    console.error('Error importing words:', error)
  } finally {
    resetData()
  }
}

const importBackup = async () => {
  try {
    formLoading.value = true
    await importDatabaseFromJson(importText.value)

    await wordsStore.loadWordsSets()
    await wordsStore.loadWords()

    showImportSnackbar('Words imported successfully', 'success')
  } catch (error) {
    showImportSnackbar('Error while words importing', 'error')
    console.error('Error importing backup:', error)
  } finally {
    resetData()
  }
}

const resetDatabase = async () => {
  try {
    await eraseDatabase()
    await wordsStore.loadWordsSets()
    await wordsStore.loadWords()

    showImportSnackbar('Database erased successfully', 'success')
  } catch (error) {
    showImportSnackbar('Error while erasing database', 'error')
    console.error('Error erasing database:', error)
  } finally {
    isMenuActive.value = false
  }
}

const showImportSnackbar = (message: string, type: string) => {
  showSnackbar({
    message,
    color: type,
    timeout: 3000,
    position: 'top right',
  })
}

const resetData = async () => {
  formLoading.value = false
  importText.value = ''
  showImportPopup.value = false
  isBackup.value = false
  isMenuActive.value = false
}

const onClose = () => {
  resetData()
}
</script>

<style scoped>
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
