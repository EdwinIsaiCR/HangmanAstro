// API para interactuar con el backend de arenagame
const API_BASE_URL = 'http://localhost:3000/api';

// Objeto con los métodos para interactuar con la API
export const urlApiArena = {

// Función para crear un nuevo juego
crearNuevoJuego: async (nombre) => {
  try {
    const response = await fetch("http://localhost:3000/api/nuevo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre })
    });
    const data = await response.json();
    console.log('Nuevo juego creado:', data);
    return data;
  } catch (error) {
    console.error('Error al crear nuevo juego:', error);
    return null;
  }
},

// Función para finalizar un juego
finalizarJuego: async (id, puntos, rindio = 0) => {
  try {
    const response = await fetch("http://localhost:3000/api/fin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, puntos, rindio })
    });
    const data = await response.json();
    console.log('Juego finalizado:', data);
    return data;
  } catch (error) {
    console.error('Error al finalizar juego:', error);
    return null;
  }
},

// Función para insertar un juego completo
insertarJuego: async (nombre, tsI, tsF, puntos, totaltime) => {
  try {
    const response = await fetch("http://localhost:3000/api/insertar", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, tsI, tsF, puntos, totaltime })
    });
    const data = await response.json();
    console.log('Juego insertado:', data);
    return data;
  } catch (error) {
    console.error('Error al insertar juego:', error);
    return null;
  }
},

// Función para obtener la tabla general
obtenerTablaGeneral: async () => {
  try {
    const response = await fetch("http://localhost:3000/api/tablaGeneral");
    const data = await response.json();
    console.log('Tabla general:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener tabla general:', error);
    return null;
  }
}

};
