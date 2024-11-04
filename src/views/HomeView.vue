<template>
  <v-container class="text-center mb-6">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-2 font-weight-bold">
          Welcome to Word Learning App!
        </h1>
        <p class="subheading mt-4">
          Improve your vocabulary by adding new words, organizing them into
          sets, and practicing through engaging quizzes and exercises.
        </p>
      </v-col>
    </v-row>

    <v-row class="my-4" align="center" justify="center">
      <v-col cols="12" md="4">
        <v-card outlined color="primary lighten-5" class="pa-5">
          <v-icon color="white" size="50">mdi-book-plus</v-icon>
          <h3>Add New Words</h3>
          <p class="mb-4">
            Add words with translations to build a personalized vocabulary
            library.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined color="secondary lighten-5" class="pa-5">
          <v-icon color="white" size="50">mdi-folder-multiple-outline</v-icon>
          <h3>Manage Word Sets</h3>
          <p class="mb-4">
            Organize words into thematic sets for focused learning sessions.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined color="grey" class="pa-5">
          <v-icon color="accent" size="50">mdi-school</v-icon>
          <h3>Practice & Quiz</h3>
          <p class="mb-4">
            Test your knowledge with quizzes and improve your memory retention.
          </p>
          <p>In develop...</p>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-8"></v-divider>
  </v-container>
</template>

<script lang="ts" setup></script>

<style scoped></style>
