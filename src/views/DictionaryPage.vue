<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col class="h-100 d-flex flex-column">
        <div class="controls">
          <div class="controls-creation">
            <v-btn class="controls-creation-btn" @click="showDialog"
              >Add a word<WordModal
            /></v-btn>
            <v-btn class="controls-creation-btn"
              >Create Word Set<WordSetModal :words="words"
            /></v-btn>
          </div>
          <SetList />
        </div>

        <WordsTable :words="words" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WordSetModal from '@/components/WordSetModal.vue'
import SetList from '@/components/SetList.vue'
import { useWordsStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import WordModal from '@/components/WordModal.vue'
import WordsTable from '@/components/WordsTable.vue'

const wordsStore = useWordsStore()
const { words } = storeToRefs(wordsStore)
const dialog = ref(false)

const showDialog = () => {
  dialog.value = true
}
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
}

.controls-creation-btn {
  margin-right: 1rem;
}

@media (max-width: 648px) {
  .controls-creation-btn {
    display: block;
    margin-bottom: 0.5rem;
  }
  .controls {
    display: block;
  }
}
</style>
