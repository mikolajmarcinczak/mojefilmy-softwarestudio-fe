<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Edit Movie' : 'Add Movie' }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label">Title *</label>
              <input
                type="text"
                id="title"
                class="form-control"
                v-model="$v.form.title"
                :class="{ 'is-invalid': $v.form.title.$error }"
              />
              <div class="invalid-feedback">
                {{ getTitleError }}
              </div>
            </div>

            <div class="mb-3">
              <label for="director" class="form-label">Director</label>
              <input
                type="text"
                id="director"
                class="form-control"
                v-model="$v.form.director"
              />
            </div>

            <div class="mb-3">
              <label for="year" class="form-label">Year *</label>
              <input
                type="number"
                id="year"
                class="form-control"
                v-model.number="$v.form.year"
                :class="{ 'is-invalid': $v.form.year.$error }"
              />
              <div class="invalid-feedback">
                {{ getYearError }}
              </div>
            </div>

            <div class="mb-3">
              <label for="rate" class="form-label">Rate</label>
              <input
                type="number"
                id="rate"
                class="form-control"
                v-model.number="$v.form.rate"
                min="0"
                max="10"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="$v.$invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {type Movie, useMovieStore} from "@/stores/movie.store";
//import useVuelidate from "@vuelidate/core";
import {between, maxLength, required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notification.store";
import {assertIsError} from "@/error.guard";

export default defineComponent({
  name: "MovieModal",
  props: {
    movie: {
      type: Object as () => Movie | null,
      default: null
    },
  },
  setup() {
    return { /*$v: useVuelidate(),*/ movieStore: useMovieStore(), notificationStore: useNotificationStore() };
  },
  data() {
    return {
      from: {
        id: this.movie?.id ?? 0,
        title: this.movie?.title ?? '',
        director: this.movie?.director ?? '',
        year: this.movie?.year ?? 0,
        rate: this.movie?.rate ?? 0,
      },
    };
  },
  validations() {
    return {
      form: {
        title: { required, maxLength: maxLength(255) },
        year: { required, between: between(1900, 2200) },
      },
    };
  },
  computed: {
    editMode(): boolean {
      return !!this.movie;
    },
    getTitleError(): string {
      const title = this.$v.form.title;
      if (!title.$dirty) return '';
      if (!title.required) {
        return 'Title is required';
      } else if (!title.maxLength) {
        return 'Title is too long';
      }
      return '';
    },
    getYearError(): string {
      const year = this.$v.form.year;
      if (!year.$dirty) return '';
      if (!year.required) {
        return 'Year is required';
      } else if (!year.between) {
        return 'Year must be between 1900 and 2200';
      }
      return '';
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        const movieData: Movie = {
          id: this.$v.form.id,
          title: this.$v.form.title,
          director: this.$v.form.director,
          year: this.$v.form.year,
          rate: this.$v.form.rate,
        };

        if (this.editMode) {
          await this.movieStore.updateMovie(movieData);
        } else {
          await this.movieStore.addMovie(movieData);
        }
        await this.movieStore.fetchMovies();
        this.$emit('close');
      } catch (e: unknown) {
        assertIsError(e);
        this.notificationStore.addNotification({ type: 'error', message: 'An unexpected error occured ' + e.message });
        console.log('Error: ', e);
      }
    }
  }
})
</script>

<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
