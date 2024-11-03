<template>
  <v-dialog v-model="isVisible" max-width="600">
    <template #activator="{ props }">
      <a class="cursor-pointer" v-bind="props" @click="openDialog">
        {{ word }}
      </a>
    </template>

    <v-card v-if="wordData">
      <v-card-title class="text-h5">Word details</v-card-title>
      <v-card-text>
        <div v-if="wordData.phonetic">
          <h4 class="text-h6 mt-0">Phonetic: {{ wordData.phonetic }}</h4>
        </div>
        <div
          class="mt-3"
          v-if="wordData.phonetics && wordData.phonetics.length"
        >
          <v-btn
            class="mr-3"
            v-for="(phonetic, index) in wordData.phonetics"
            :key="index"
            icon
            size="small"
            @click="playAudio(phonetic.audio)"
          >
            ▶️
          </v-btn>
        </div>

        <v-divider class="my-4"></v-divider>
        <div v-for="(meaning, mIndex) in wordData.meanings" :key="mIndex">
          <h4 class="text-h6 font-weight-bold">{{ meaning.partOfSpeech }}</h4>
          <p v-if="meaning.definitions"><strong>Definitions:</strong></p>
          <ul>
            <li
              v-for="(definition, dIndex) in meaning.definitions"
              :key="dIndex"
            >
              <p>{{ definition.definition }}</p>
            </li>
          </ul>
          <p v-if="meaning.synonyms.length"><strong>Synonyms:</strong></p>
          <p>
            <span v-for="(synonym, sIndex) in meaning.synonyms" :key="sIndex">
              {{
                `${synonym}${sIndex === meaning.synonyms.length - 1 ? '.' : ','} `
              }}</span
            >
          </p>
        </div>
        <v-divider class="my-4"></v-divider>
        <div v-if="wordData.sourceUrls && wordData.sourceUrls.length">
          <h4>Source:</h4>
          <ul>
            <li v-for="(url, index) in wordData.sourceUrls" :key="index">
              <a :href="url" target="_blank">{{ url }}</a>
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { PropType } from 'vue'
import type { TWordData } from '@/services/dexie'

defineProps({
  word: {
    type: String,
    required: true,
  },
  wordData: {
    type: Object as PropType<TWordData>,
    required: true,
  },
})

const isVisible = ref(false)

function openDialog() {
  isVisible.value = true
}

function closeDialog() {
  isVisible.value = false
}

function playAudio(audioUrl: string) {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play()
  }
}
</script>

<style scoped>
h4 {
  margin-top: 1rem;
}
</style>
