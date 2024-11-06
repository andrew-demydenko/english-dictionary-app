<template>
  <v-data-table
    :sticky="true"
    class="words-table"
    :headers="headers"
    :items="words"
    item-key="id"
  >
    <template v-slot:item.word="{ item }">
      <PopupWordDetails
        v-if="item.wordData"
        :word="item.word"
        :wordData="item.wordData"
      />
      <span v-else>{{ item.word }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="text-no-wrap">
        <v-btn class="mr-3" icon size="x-small">
          <v-icon>mdi-pencil</v-icon>
          <WordModal :wordData="item" />
        </v-btn>

        <v-btn icon color="red" size="x-small">
          <v-icon>mdi-delete</v-icon>
          <Confirmation
            v-if="item.id"
            @submit="handleRemoveWord(item.id)"
            title="Remove word"
            text="Are you sure you want to remove this word?"
          ></Confirmation>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import PopupWordDetails from '@/components/PopupWordDetails.vue'
import Confirmation from '@/components/ConfirmationModal.vue'
import WordModal from './WordModal.vue'
import type { TWord } from '@/services/words'
import { useWordsStore } from '@/stores/store'

type ReadonlyHeaders = {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}[]

defineProps<{
  words: TWord[]
}>()

const wordsStore = useWordsStore()
const { removeWord } = wordsStore

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

const handleRemoveWord = async (id: string) => {
  try {
    await removeWord(id)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.words-table {
  flex: 1;
  min-height: 1px;
  padding-top: 1rem;
}
.words-table :deep(th) {
  font-weight: 600 !important;
}
</style>
