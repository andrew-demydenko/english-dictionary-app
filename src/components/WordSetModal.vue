<template>
  <v-dialog activator="parent" v-model="isVisible" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Word Set</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-text-field v-model="name" label="Name of set" />
      </v-card-text>

      <v-card-text class="pb-0">
        <v-text-field
          v-model="searchImmediate"
          label="Search words"
          clearable
          @click:clear="searchImmediate = ''"
        />
      </v-card-text>
      <v-card-text class="pt-0 overflow-auto">
        <v-list class="py-0">
          <v-list-item
            v-for="word in filteredWords"
            :key="word.id"
            color="primary"
            variant="tonal"
            :subtitle="word.translation"
            :title="word.word"
            :active="selectedWordIds.includes(word.id || '')"
            @click="onSelect(word)"
          >
            <template #prepend="{ isActive }">
              <v-list-item-action>
                <v-checkbox-btn :model-value="isActive" />
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey-darken-2" @click="close">Cancel</v-btn>
        <v-btn color="primary" :disabled="!name" @click="saveSet"
          >Save Set</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUpdated } from 'vue'
import { debounce } from 'lodash'
import { type TWord } from '@/services/words'
import { type TWordsSet } from '@/services/wordsSets'
import { useWordsStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const wordsStore = useWordsStore()
const { words } = storeToRefs(wordsStore)
const { addWordsSet, updateWordsSet } = wordsStore

const props = defineProps({
  wordsSet: {
    type: Object as () => TWordsSet,
  },
  onSave: {
    type: Function,
  },
  onClose: {
    type: Function,
  },
})

onUpdated(() => {
  if (props.wordsSet) {
    selectedWordIds.value = [...props.wordsSet.wordIds]
    name.value = props.wordsSet.name
  }
})

const emit = defineEmits(['close', 'save'])
const isVisible = ref(false)
const name = ref('')
const selectedWordIds = ref<string[]>([])
const searchImmediate = ref('')
const debouncedSearch = ref('')

const filteredWords = computed(() => {
  return words.value.filter(word => {
    return (
      selectedWordIds.value.includes(word.id || '') ||
      word.word.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
      word.translation
        .toLowerCase()
        .includes(debouncedSearch.value.toLowerCase())
    )
  })
})

const updateDebouncedSearch = debounce((newSearch: string) => {
  debouncedSearch.value = newSearch
}, 300)

watch(searchImmediate, newValue => {
  updateDebouncedSearch(newValue)
})

const close = () => {
  selectedWordIds.value = []
  isVisible.value = false
  searchImmediate.value = ''
  debouncedSearch.value = ''
  name.value = ''
  emit('close')
}

const onSelect = (data: TWord) => {
  const id = data.id || ''
  const index = selectedWordIds.value.indexOf(id)
  if (index === -1) {
    selectedWordIds.value.push(id)
  } else {
    selectedWordIds.value.splice(index, 1)
  }
}

const saveSet = async () => {
  const wordSet = {
    id: props.wordsSet?.id,
    name: name.value,
    wordIds: selectedWordIds.value,
  }
  if (props.wordsSet) {
    await updateWordsSet({
      id: wordSet.id,
      name: name.value,
      wordIds: selectedWordIds.value,
    })
  } else {
    await addWordsSet({
      name: name.value,
      wordIds: selectedWordIds.value,
    })
  }

  emit('save', { wordSet })
  close()
}
</script>
