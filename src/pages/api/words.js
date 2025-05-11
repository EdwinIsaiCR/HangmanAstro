// API para interactuar con el backend de palabras (verbos)
const API_BASE_URL = 'http://localhost:3000/api';

// Objeto con los métodos para interactuar con la API
export const urlApiWords = {
obtenerVerbos: async () => {
  try {
    const response = await fetch("http://localhost:3000/api/words");
    const data = await response.json();
    console.log('Verbos obtenidos:', data.length);
    return data;
  } catch (error) {
    console.error('Error al obtener verbos:', error);
    return [];
  }
} 
};