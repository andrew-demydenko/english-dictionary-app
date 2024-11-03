<template>
  <v-container>
    <v-row>
      <v-col>
        <SetList />
        <v-btn class="mr-3" @click="showDialog">Add a word</v-btn>
        <v-btn>Create Word Set<WordSetModal :words="words" /></v-btn>

        <v-dialog persistent v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline"
                >{{ formInputs.id ? 'Edit' : 'Add' }} word</span
              >
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="formInputs.word" label="English word" />
              <v-text-field
                v-model="formInputs.translation"
                label="Translation"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn @click="closeDialog">Cancel</v-btn>
              <v-btn color="primary" :loading="formLoading" @click="saveWord"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-data-table :headers="headers" :items="words" item-key="id">
          <template v-slot:item.word="{ item }">
            <PopupWordDetails
              v-if="item.wordData"
              :word="item.word"
              :wordData="item.wordData"
            />
            <span v-else>{{ item.word }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn class="mr-3" icon size="x-small" @click="editWord(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon color="red" size="x-small">
              <v-icon>mdi-delete</v-icon>
              <Confirmation
                @submit="item.id ? handleRemoveWord(item.id) : null"
                title="Remove word"
                text="Are you sure you want to remove this word?"
              ></Confirmation>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getWordData } from '@/services/words'
import type { TWord } from '@/services/dexie'
import PopupWordDetails from '@/components/PopupWordDetails.vue'
import Confirmation from '@/components/ConfirmationModal.vue'
import WordSetModal from '@/components/WordSetModal.vue'
import SetList from '@/components/SetList.vue'
import { useWordsStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

type ReadonlyHeaders = {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}[]

const wordsStore = useWordsStore()
const { updateWord, addWord, removeWord, findWordById } = wordsStore
const { words } = storeToRefs(wordsStore)
const dialog = ref(false)
const formLoading = ref(false)
const formInputs = ref<Pick<TWord, 'id' | 'word' | 'translation'>>({
  word: '',
  translation: '',
})

const headers: ReadonlyHeaders = [
  { title: 'English', key: 'word' },
  { title: 'Translation', key: 'translation' },
  {
    title: 'Transcription',
    key: 'transcription',
    sortable: false,
  },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const closeDialog = () => {
  dialog.value = false
  formInputs.value = {
    word: '',
    translation: '',
  }
}

const showDialog = () => {
  dialog.value = true
}

const saveWord = async () => {
  try {
    formLoading.value = true
    if (formInputs.value.id) {
      const word = findWordById(formInputs.value.id)
      const updatedWord = {
        ...word,
        ...formInputs.value,
      }

      await updateWord(updatedWord)
      closeDialog()
    } else {
      const newWord: TWord = { ...formInputs.value }
      const data = await getWordData(newWord.word)

      if (data) {
        newWord.transcription = data.phonetic
        newWord.wordData = data
      }
      await addWord(newWord)
      closeDialog()
    }
  } catch (error) {
    console.error(error)
  } finally {
    formLoading.value = false
  }
}

const handleRemoveWord = async (id: string) => {
  try {
    await removeWord(id)
  } catch (error) {
    console.error(error)
  }
}

const editWord = (word: TWord) => {
  formInputs.value = {
    id: word.id,
    word: word.word,
    translation: word.translation,
  }
  dialog.value = true
}
</script>

<style scoped></style>
