<template>
  <div class="container mt-4">
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="directorFilter" class="form-label">Director</label>
        <input
          type="text"
          id="directorFilter"
          class="form-control"
          v-model="filters.director"
          placeholder="Filter by director"
        />
      </div>
      <div class="col-md-3">
        <label for="yearFilter" class="form-label">Year</label>
        <input
          type="number"
          id="yearFilter"
          class="form-control"
          v-model.number="filters.year"
          placeholder="Filter by year"
        />
      </div>
      <div class="col-md-3">
        <label for="rateFilter" class="form-label">Minimum Rate</label>
        <input
          type="number"
          id="rateFilter"
          class="form-control"
          v-model.number="filters.minRate"
          placeholder="Filter by minimum rate"
          min="0"
          max="10"
        />
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button class="btn btn-secondary me-2" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Movie List</h2>
      <div>
        <button class="btn btn-primary me-2" @click="openModal(null)">Add Movie</button>
        <button class="btn btn-success" @click="importMovies">Download Movies</button>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
      <tr>
        <th>Title</th>
        <th>Director</th>
        <th>Year</th>
        <th>Rate</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="movie in filteredMovies" :key="movie.id">
        <td>{{ movie.title }}</td>
        <td>{{ movie.director }}</td>
        <td>{{ movie.year }}</td>
        <td>{{ movie.rate }}</td>
        <td>
          <button class="btn btn-sm btn-primary me-2" @click="openModal(movie)">Edit</button>
          <button class="btn btn-sm btn-danger" @click="confirmDelete(movie.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <MovieModal
      v-if="showModal"
      :movie="selectedMovie"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import MovieModal from "@/components/MovieModal.vue";
import {type Movie, useMovieStore} from "@/stores/movie.store";

export default defineComponent({
  name: "MoviesList",
  components:{
    MovieModal
  },
  setup() {
    return { movieStore: useMovieStore() };
  },
  data() {
    return {
      showModal: false,
      selectedMovie: null as Movie | null,
      filters: {
        director: '',
        year: null as number | null,
        minRate: null as number | null
      }
    };
  },
  computed: {
    movies(): Movie[] {
      return this.movieStore.movies;
    },
    filteredMovies(): Movie[] {
      return this.movies.filter((movie) => {
        const matchesDirector = this.filters.director
          ? movie.director.toLowerCase().includes(this.filters.director.toLowerCase())
          : true;

        const matchesYear = this.filters.year ? movie.year === this.filters.year : true;

        const matchesMinRate = this.filters.minRate ? movie.rate >= this.filters.minRate : true;

        return matchesDirector && matchesYear && matchesMinRate;
      })
    }
  },
  created() {
    this.movieStore.fetchMovies();
  },
  methods: {
    openModal(movie: Movie | null) {
      this.selectedMovie = movie ? { ...movie } : null;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    confirmDelete(id: number) {
      if (confirm('Are you sure you want to delete this movie?')) {
        this.movieStore.deleteMovie(id);
      }
    },
    importMovies() {
      this.movieStore.importMovies();
    },
    clearFilters() {
      this.filters.director = '';
      this.filters.year = null;
      this.filters.minRate = null;
    },
  }
});
</script>

<style scoped>

</style>
