<template>
  <v-dialog activator="parent" v-model="isVisible" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline"
          >{{ props.wordData?.id ? 'Edit' : 'Add' }} word</span
        >
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="formInputs.word" label="English word" />
        <v-text-field v-model="formInputs.translation" label="Translation" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-2" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" :loading="formLoading" @click="saveWord"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onUpdated, ref, type PropType } from 'vue'
import { type TWord } from '@/services/words'
import { useWordsStore } from '@/stores/store'
import { getWordData } from '@/services/words'

const wordsStore = useWordsStore()
const { updateWord, addWord, findWordById } = wordsStore
const isVisible = ref(false)
const formLoading = ref(false)
const formInputs = ref<Pick<TWord, 'id' | 'word' | 'translation'>>({
  word: '',
  translation: '',
})

const props = defineProps({
  wordData: {
    type: Object as PropType<TWord>,
  },
})

const closeDialog = () => {
  formInputs.value = {
    word: '',
    translation: '',
  }
  isVisible.value = false
}

onUpdated(() => {
  if (props.wordData) {
    formInputs.value = {
      word: props.wordData.word,
      translation: props.wordData.translation,
    }
  }
})

const saveWord = async () => {
  try {
    formLoading.value = true
    if (props.wordData?.id) {
      const word = findWordById(props.wordData.id)
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
</script>
