// Importar el módulo Express para la creación del servidor
const express = require('express');
// Crear una instancia de la aplicación Express
const app = express();
// Iniciar el servidor en el puerto 3000 y mostrar un mensaje en la consola
app.listen(3000, console.log('Tienda de Joyas Server ON'));

// Importar funciones específicas desde el módulo 'TiendaDeJoyas'
const { getJoyas, prepararHATEOAS, getJoyasSearch } = require('./services/TiendaDeJoyas');

// Middleware para reportar información sobre cada consulta recibida
const reportarConsulta = async (req, res, next) => {
  // Obtener los parámetros y la URL de la consulta actual
  const parametros = req.query;
  const url = req.url;
  // Mostrar información detallada sobre la consulta en la consola
  console.log(`
    Hoy ${new Date()}
    Consulta realizada en la ruta ${url}
    Parámetros de consulta:
  `, parametros);
  // Llamar a la siguiente función en la cadena de middleware
  next();
};

// Endpoint para obtener todas las joyas con información HATEOAS
app.get('/joyas', reportarConsulta, async (req, res) => {
  try {
    // Obtener los parámetros de la consulta
    const queryString = req.query;
    // Obtener las joyas según los parámetros y preparar información HATEOAS
    const joyas = await getJoyas(queryString);
    const HATEOAS = await prepararHATEOAS(joyas);
    // Enviar la respuesta JSON con información HATEOAS
    res.json(HATEOAS);
  } catch ({ code, message }) {
    // Manejar errores y enviar una respuesta de error con el código y el mensaje
    res.status(code).send(message);
  }
});

// Endpoint para realizar búsquedas de joyas con filtros específicos
app.get('/joyas/filtros', reportarConsulta, async (req, res) => {
  try {
    // Obtener los parámetros de la consulta de búsqueda
    const queryString = req.query;
    // Obtener las joyas según los parámetros de búsqueda
    const joyas = await getJoyasSearch(queryString);
    // Enviar la respuesta JSON con las joyas encontradas
    res.json(joyas);
  } catch ({ code, message }) {
    // Manejar errores y enviar una respuesta de error con el código y el mensaje
    res.status(code).send(message);
  }
});
