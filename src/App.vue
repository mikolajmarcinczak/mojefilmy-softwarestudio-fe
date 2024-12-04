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

<style>
.btn-primary,
.btn-primary:hover {
	background-color: #EC661A;
	border-color: #EC661A;
}

.btn-primary:hover {
	background-color: #c25416;
	border-color: #c25416;
}

.btn-outline-info {
	color: #EE9100;
	border-color: #EE9100;
}
</style>