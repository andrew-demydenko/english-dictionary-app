<template>
  <div>
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <template #activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" :color="toEnglish ? 'green' : 'primary'">
          {{ toEnglish ? 'Learn in English' : 'Learn from English' }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          {{ toEnglish ? 'Translate to English' : 'Translate from English' }}
        </v-card-title>

        <v-card-text>
          <v-slide-x-transition mode="out-in">
            <div v-if="currentWord" :key="currentWord.id">
              <p class="text-h6 mb-2">
                {{ toEnglish ? currentWord.translation : currentWord.word }}
              </p>

              <v-text-field
                :label="
                  toEnglish
                    ? 'Your translation in English'
                    : 'Your translation in native language'
                "
                v-model="userTranslation"
                :error-messages="errorMessage"
                @keyup.enter="checkAnswer"
              ></v-text-field>

              <v-btn
                class="my-3"
                color="primary"
                @click="checkAnswer"
                :disabled="answerChecked"
              >
                Check
              </v-btn>

              <div v-if="answerChecked">
                <p
                  :class="{
                    'text-green': isCorrect,
                    'text-error': !isCorrect,
                  }"
                >
                  <v-icon :color="isCorrect ? 'green' : 'red'">{{
                    isCorrect ? 'mdi-check-circle' : 'mdi-alert-circle'
                  }}</v-icon>
                  <span v-if="isCorrect">Correct!</span>
                  <span v-else>
                    Incorrect. The correct answer is:
                    <strong class="text-black">{{
                      toEnglish ? currentWord.word : currentWord.translation
                    }}</strong></span
                  >
                </p>
              </div>
              <div v-else>{{ '&nbsp;' }}</div>
            </div>
          </v-slide-x-transition>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" @click="nextWord">Next Word</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-2" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { type TWord } from '@/services/dexie'

const props = defineProps({
  words: {
    type: Array as () => TWord[],
    required: true,
  },
  toEnglish: {
    type: Boolean,
    default: false,
  },
})

const showModal = ref(false)
const currentWord = ref<TWord | null>(null)
const userTranslation = ref('')
const answerChecked = ref(false)
const isCorrect = ref(false)
const errorMessage = ref<string>('')

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * props.words.length)
  currentWord.value = props.words[randomIndex]
  userTranslation.value = ''
  answerChecked.value = false
  isCorrect.value = false
  errorMessage.value = ''
}

watch(
  () => showModal.value,
  newVal => {
    if (newVal) {
      getRandomWord()
    }
  },
)

watch(
  () => userTranslation.value,
  newVal => {
    if (newVal.trim() !== '') {
      errorMessage.value = ''
    }
  },
)

const checkAnswer = () => {
  if (userTranslation.value.trim() === '') {
    errorMessage.value = 'Please enter a translation'
    return
  }
  isCorrect.value =
    userTranslation.value.trim().toLowerCase() ===
    (props.toEnglish
      ? currentWord.value?.word.toLowerCase()
      : currentWord.value?.translation.toLowerCase())
  answerChecked.value = true
}

const nextWord = () => {
  getRandomWord()
}

const closeModal = () => {
  showModal.value = false
  currentWord.value = null
}
</script>

<style scoped></style>
