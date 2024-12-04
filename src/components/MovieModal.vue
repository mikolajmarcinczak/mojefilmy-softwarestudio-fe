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
                v-model="form.title"
								@blur="v$.title.$touch()"
                :class="{ 'is-invalid': v$.title.$error }"
              />
            </div>

            <div class="mb-3">
              <label for="director" class="form-label">Director *</label>
              <input
                type="text"
                id="director"
                class="form-control"
                v-model="form.director"
								@blur="v$.director.$touch()"
								:class="{ 'is-invalid': v$.director.$error }"
              />
            </div>

            <div class="mb-3">
              <label for="year" class="form-label">Year * /1900-2200/</label>
              <input
                type="number"
                id="year"
                class="form-control"
                v-model.number="form.year"
								@blur="v$.year.$touch()"
                :class="{ 'is-invalid': v$.year.$error }"
              />
            </div>

            <div class="mb-3">
              <label for="rate" class="form-label">Rate</label>
              <input
                type="number"
                id="rate"
                class="form-control"
                v-model.number="form.rate"
                min="0"
                max="10"
								step="0.1"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="v$.$invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script lang="ts">
import {defineComponent, watch} from 'vue'
import {type Movie, useMovieStore} from "@/stores/movie.store";
import useVuelidate from "@vuelidate/core";
import {between, maxLength, numeric, required} from "@vuelidate/validators";
import {useNotificationStore} from "@/stores/notification.store";
import {assertIsError} from "@/error.guard";
import {reactive} from "vue";

export default defineComponent({
  name: "MovieModal",
  props: {
    movie: {
      type: Object as () => Movie | null,
      default: null
    },
  },
	emits: ['close'],
  setup(props) {
		const form = reactive({
			id: props.movie?.id ?? 0,
			title: props.movie?.title ?? '',
			director: props.movie?.director ?? '',
			year: props.movie?.year ?? null,
			rate: props.movie?.rate ?? null,
		});

		const rules = {
			title: { required, maxLength: maxLength(255) },
			director: { required, maxLength: maxLength(255) },
			year: { required, between: between(1900, 2200), numeric },
		};

		const v$ = useVuelidate(rules, form);

		watch(() => props.movie, (newMovie) => {
			if (newMovie) {
				form.id = newMovie.id;
				form.title = newMovie.title;
				form.director = newMovie.director;
				form.year = newMovie.year;
				form.rate = newMovie.rate;
			} else {
				form.id = 0;
				form.title = '';
				form.director = '';
				form.year = null;
				form.rate = null;
			}
			v$.value.$reset();
		}, { immediate: true });

    return { v$, movieStore: useMovieStore(), notificationStore: useNotificationStore(), form };
  },
  computed: {
    editMode(): boolean {
      return !!this.movie;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.v$.title.$touch();
        this.v$.year.$touch();

				const isValid = await this.v$.$validate() && !this.v$.$invalid;
        if (!isValid) {
					return;
				}

        const movieData = {
					...this.form,
					rate: parseFloat(this.form.rate?.toString() || '0')
				} as Movie;

        if (this.movie && this.editMode) {
          await this.movieStore.updateMovie(movieData);
        } else {
          await this.movieStore.addMovie(movieData);
        }
        await this.movieStore.fetchMovies();
				this.v$.$reset();
        this.$emit('close');
      } catch (e: unknown) {
        assertIsError(e);
        this.notificationStore.addNotification({ type: 'error', message: 'An unexpected error occurred ' + e.message });
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
