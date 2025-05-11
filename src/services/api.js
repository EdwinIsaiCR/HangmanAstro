// frontend/src/services/api.js

// URL base de la API
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Servicio para interactuar con la API del backend
 */
export const apiService = {
  /**
   * Realizar una petición a la API
   * @param {string} endpoint - Ruta de la API sin la URL base
   * @param {Object} options - Opciones de fetch
   * @returns {Promise<any>} - Respuesta de la API en formato JSON
   */
  async fetchAPI(endpoint, options = {}) {
    // Configuración por defecto para las peticiones
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Combinar opciones
    const fetchOptions = {
      ...defaultOptions,
      ...options,
    };

    // Si hay cuerpo y es un objeto, convertirlo a JSON
    if (fetchOptions.body && typeof fetchOptions.body === 'object') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Devolver datos como JSON
      return await response.json();
    } catch (error) {
      console.error('Error en la petición API:', error);
      throw error;
    }
  },

  // Métodos específicos para usuarios
  users: {
    getAll() {
      return apiService.fetchAPI('/users');
    },
    getById(id) {
      return apiService.fetchAPI(`/users/${id}`);
    },
    create(userData) {
      return apiService.fetchAPI('/users', {
        method: 'POST',
        body: userData,
      });
    },
    update(id, userData) {
      return apiService.fetchAPI(`/users/${id}`, {
        method: 'PUT',
        body: userData,
      });
    },
    delete(id) {
      return apiService.fetchAPI(`/users/${id}`, {
        method: 'DELETE',
      });
    },
    getScores(id) {
      return apiService.fetchAPI(`/users/${id}/scores`);
    },
  },

  // Métodos para el juego de hangman
  game: {
    getWords() {
      return apiService.fetchAPI('/games/words');
    },
    saveScore(gameData) {
      return apiService.fetchAPI('/games/scores', {
        method: 'POST',
        body: gameData,
      });
    },
    getLeaderboard() {
      return apiService.fetchAPI('/games/leaderboard');
    },
  },
};

export default apiService;