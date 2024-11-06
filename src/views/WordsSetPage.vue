<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col class="h-100 d-flex flex-column">
        <div>
          <h3 class="mb-5">
            <span>{{ wordsSet?.name }}</span
            ><v-btn variant="elevated" class="ml-3" size="small">
              <v-icon>mdi-pencil</v-icon>
              <WordSetModal v-if="wordsSet" :wordsSet="wordsSet" />
            </v-btn>
          </h3>
        </div>
        <div class="games-wrapper">
          <TranslateGameModal class="game-btn" :words="filterWords" />
          <TranslateGameModal
            class="game-btn"
            :words="filterWords"
            :toEnglish="true"
          />
          <FindPairsGameModal class="game-btn" :words="filterWords" />
        </div>
        <WordsTable :words="filterWords" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import WordSetModal from '@/components/WordSetModal.vue'
import { useWordsStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import WordsTable from '@/components/WordsTable.vue'
import TranslateGameModal from '@/components/TranslateGameModal.vue'
import FindPairsGameModal from '@/components/FindPairsGameModal.vue'

const wordsStore = useWordsStore()
const { words, wordsSets } = storeToRefs(wordsStore)
const route = useRoute()

const wordsSet = computed(() => {
  return wordsSets.value.find(set => set.id === route.params.id)
})

const filterWords = computed(() => {
  if (wordsSet.value && wordsSet.value.wordIds) {
    return words.value.filter(word =>
      wordsSet.value?.wordIds.includes(word.id as string),
    )
  } else {
    return []
  }
})
</script>

<style scoped>
.games-wrapper {
  display: flex;
}
.game-btn {
  margin-right: 1rem;
}
@media (max-width: 648px) {
  .games-wrapper {
    display: block;
  }
  .game-btn {
    margin-bottom: 1rem;
  }
}
</style>
