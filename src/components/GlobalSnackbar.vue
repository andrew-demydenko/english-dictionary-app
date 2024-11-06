<template>
  <v-snackbar
    transition="scale-transition"
    class="custom-snackbar"
    v-model="snackbar.visible"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    :location="snackbar.position"
    :multi-line="snackbar.multiLine"
    @click:outside="closeSnackbar"
  >
    <div class="d-flex justify-space-between align-center">
      {{ snackbar.message }}
      <v-btn
        icon
        size="small"
        color="white"
        variant="text"
        @click="closeSnackbar"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/services/snackbar'

const snackbar = useSnackbar()

const closeSnackbar = () => {
  snackbar.value.visible = false
  if (snackbar.value.onClose) {
    snackbar.value.onClose()
  }
}
</script>

<style scoped>
.custom-snackbar :deep(.v-snackbar__content) {
  padding: 0.5rem 1rem;
}
</style>
