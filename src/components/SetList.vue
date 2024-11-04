<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
        Words sets
        <v-icon class="ml-2">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-list width="400px">
        <v-list-item v-for="set in wordsSets" :key="set.id">
          <v-list-item-title
            ><RouterLink :to="`/words-sets/${set.id}`">{{
              set.name
            }}</RouterLink></v-list-item-title
          >
          <v-list-item-subtitle
            >Words: {{ set.wordIds.length }}</v-list-item-subtitle
          >

          <template #append>
            <v-list-item-action>
              <v-btn class="mr-3" size="small">
                <v-icon>mdi-pencil</v-icon>
                <WordSetModal
                  @save="isActive.value = false"
                  :words="words"
                  :wordsSet="set"
                />
              </v-btn>

              <v-btn color="red" size="small">
                <v-icon>mdi-delete</v-icon>
                <Confirmation
                  v-if="set.id"
                  @submit="removeWordsSet(set.id, set.name)"
                  title="Remove words set"
                  text="Are you sure you want to remove this words set?"
                ></Confirmation>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Confirmation from '@/components/ConfirmationModal.vue'
import WordSetModal from '@/components/WordSetModal.vue'
import { useWordsStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const wordsStore = useWordsStore()
const { removeWordsSet } = wordsStore
const { words, wordsSets } = storeToRefs(wordsStore)
</script>

<style scoped></style>
