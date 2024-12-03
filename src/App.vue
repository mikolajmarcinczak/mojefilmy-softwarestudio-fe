<script lang="ts">
import MoviesList from "@/components/MoviesList.vue";
import NotificationComp from "@/components/NotificationComponent.vue";

export default {
  name: "App",
  components: {
    NotificationComp,
    MoviesList
  }
};
</script>

<template>
  <NotificationComp />
  <MoviesList />
</template>
