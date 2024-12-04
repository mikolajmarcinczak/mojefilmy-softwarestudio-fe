import {defineStore} from "pinia";
import apiClient from "@/services/movies.api";
import {useNotificationStore} from "@/stores/notification.store";

export interface Movie {
  id: number;
  externalId?: number;
  title: string;
  director: string;
  rate: number;
  year: number;
}

export const useMovieStore = defineStore('movie',{
  state: () => ({
    movies: [] as Movie[],
  }),
  actions: {
    async fetchMovies() {
      try {
        const response = await apiClient.get<Movie[]>('/Movies');
        this.movies = response.data;
      } catch (error) {
        this.handleError('Error fetching movies ', error);
      }
    },
    async addMovie(movie: Omit<Movie, 'id'>) {
      try {
        await apiClient.post<Movie>('/Movies', movie);
        await this.fetchMovies();
        this.handleSuccess('Movie added successfully');
      } catch (error) {
        this.handleError('Error adding movie ', error);
      }
    },
    async updateMovie(movie: Movie) {
      try {
        await apiClient.put<Movie>(`/Movies/${movie.id}`, movie);
        await this.fetchMovies();
        this.handleSuccess('Movie updated successfully');
      } catch (error) {
        this.handleError('Error updating movie ', error);
      }
    },
    async deleteMovie(id: number) {
      try {
        await apiClient.delete(`/Movies/${id}`);
        await this.fetchMovies();
        //this.movies = this.movies.filter((movie) => movie.id !== id);
        this.handleSuccess('Movie deleted successfully');
      } catch (error) {
        this.handleError('Error deleting movie ', error);
      }
    },
    async importMovies() {
      try {
        await apiClient.post('/Movies/import');
        await this.fetchMovies();
        this.handleSuccess('Movies imported successfully');
      } catch (error) {
        this.handleError('Error importing movies ', error);
      }
    },
    handleSuccess(message: string) {
      const notificationStore = useNotificationStore();
      notificationStore.addNotification({ message, type: 'success' });
    },
    handleError(message: string, error: unknown) {
      console.error(message, error);
      const notificationStore = useNotificationStore();
      notificationStore.addNotification({ message, type: 'error' });
    },
  }
});
