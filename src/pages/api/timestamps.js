// API para interactuar con el backend de timestamps
const API_BASE_URL = 'http://localhost:3000/api';

// Objeto con los métodos para interactuar con la API
export const urlApiGeneral = {
obtenerTimestamp: async () => {
  try {
    const response = await fetch("http://localhost:3000/api/timestamp");
    const data = await response.json();
    console.log('Timestamp obtenido:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener timestamp:', error);
    return null;
  }
}
};
