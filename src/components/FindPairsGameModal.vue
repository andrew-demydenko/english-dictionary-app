<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          Find Pairs Game
          <v-icon class="ml-2">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-body-1 pb-0">Select Grid Size</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(size, index) in gridSizes"
              :key="index"
              :minHeight="30"
              @click="selectGridSize(size)"
            >
              <v-list-item-title>{{ size }} x {{ size }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-dialog v-model="showGameModal" max-width="100%" height="100%" persistent>
      <v-card class="d-flex flex-column" height="100%">
        <v-card-title class="headline">Find the Pairs</v-card-title>

        <v-card-text>
          <div
            class="game-grid"
            :style="{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            }"
          >
            <v-card
              v-for="(card, index) in cards"
              :key="index"
              :disabled="card.matched"
              class="game-card"
              :color="
                card.matched
                  ? 'green'
                  : card.error
                    ? 'red'
                    : card.selected
                      ? 'yellow'
                      : 'blue'
              "
              @click="selectCard(card, index)"
            >
              <v-card-title class="game-card-title">{{
                card.text
              }}</v-card-title>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <div class="px-6 pt-2">
          <h4 v-if="gameOver">Completed in {{ timeElapsed }} seconds!</h4>
          <v-card-actions class="px-0">
            <v-btn color="primary" @click="restartGame">Restart Game</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-2" @click="closeGameModal">Close</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { shuffleArray } from '@/utils'
import { type TWord } from '@/services/dexie'

interface ICard {
  text: string
  id: string
  selected: boolean
  matched: boolean
  error?: boolean
}
interface SelectedCard {
  card: ICard
  index: number
}

let timer: ReturnType<typeof setTimeout> | null = null
const showGridPopup = ref(false)
const showGameModal = ref(false)
const gameOver = ref(false)
const timeElapsed = ref(0)
const selectedCards = ref<SelectedCard[]>([])
const gridSize = ref(0)
const gridSizes = [3, 4, 5, 6, 7, 8, 9, 10]

const { words } = defineProps({
  words: {
    type: Array as () => TWord[],
    required: true,
  },
})

const cards = ref<ICard[]>([])

const selectGridSize = (size: number) => {
  const maxGridSize = Math.ceil(Math.sqrt(words.length * 2))
  const newGridSize = maxGridSize > size ? size : maxGridSize
  gridSize.value = newGridSize
  showGridPopup.value = false
  initGame()
}

const initGame = () => {
  const selectedWords = shuffleArray([...words]).slice(
    0,
    (gridSize.value * gridSize.value) / 2,
  )
  cards.value = shuffleArray([
    ...selectedWords.map((word: TWord) => ({
      text: word.word,
      id: word.word,
      selected: false,
      matched: false,
    })),
    ...selectedWords.map((word: TWord) => ({
      text: word.translation,
      id: word.word,
      selected: false,
      matched: false,
    })),
  ])
  startTimer()
  showGameModal.value = true
}

const selectCard = (card: ICard, index: number) => {
  if (card.selected || card.matched || selectedCards.value.length >= 2) return
  card.selected = true
  selectedCards.value.push({ card, index })

  if (selectedCards.value.length === 2) {
    checkForMatch()
  }
}

const checkForMatch = () => {
  const [first, second] = selectedCards.value
  if (!first || !second) return
  if (first.card.id === second.card.id) {
    first.card.matched = second.card.matched = true
    if (cards.value.every(card => card.matched)) {
      endGame()
    }
  } else {
    first.card.error = second.card.error = true
    setTimeout(() => {
      first.card.selected = second.card.selected = false
      first.card.error = second.card.error = false
    }, 500)
  }
  selectedCards.value = []
}

const restartGame = () => {
  showGameModal.value = false
  gameOver.value = false
  timeElapsed.value = 0
  initGame()
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => timeElapsed.value++, 1000)
}
const endGame = () => {
  gameOver.value = true
  if (timer) clearInterval(timer)
}
const closeGameModal = () => {
  if (timer) clearInterval(timer)
  showGameModal.value = false
}
</script>

<style scoped>
.game-grid {
  display: grid;
  gap: 10px;
  width: 100%;
  height: 100%;
}

.game-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.game-card-title {
  max-width: 100%;
  text-overflow: initial;
  white-space: normal;
  text-align: center;
}

@media (max-width: 648px) {
  .game-card-title {
    font-size: 1rem;
  }
}
</style>
