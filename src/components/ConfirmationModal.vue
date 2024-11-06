<template>
  <v-dialog activator="parent" v-model="isVisible" max-width="600">
    <template v-slot:default="{ isActive }">
      <v-card :text="text" :title="title">
        <template v-slot:actions>
          <v-btn color="grey-darken-2" @click="isActive.value = false"
            >Cancel</v-btn
          >
          <v-btn color="error" @click="onSubmit">Submit</v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['submit', 'close'])
defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
})
const isVisible = ref(false)

function closeDialog() {
  emit('close')
  isVisible.value = false
}

function onSubmit() {
  emit('submit')
  closeDialog()
}
</script>

<style scoped></style>
