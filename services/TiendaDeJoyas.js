// Importa las bibliotecas necesarias
const { Pool } = require("pg");
const format = require("pg-format");

// Configura la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true
});

/**
 * Obtiene un conjunto de joyas paginadas y ordenadas según los parámetros dados.
 * @param {Object} options - Opciones para la consulta (limits, page, order_by).
 * @returns {Promise<Array>} - Retorna un array de joyas.
 * @throws {Object} - Lanza un error si no se encuentran resultados.
 */
const getJoyas = async ({ limits = 10, page = 1, order_by = 'id_ASC' }) => {
  // Desestructura el parámetro 'order_by' para obtener campo y dirección de ordenamiento
  const [campo, direccion] = order_by.split("_");
  const offset = (page - 1) * limits;

  // Crea y formatea la consulta SQL utilizando pg-format
  const query = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);

  // Ejecuta la consulta en la base de datos
  const { rows: joyas, rowCount } = await pool.query(query);

  // Manejo de errores si no se encuentran resultados
  if (rowCount === 0) {
    throw { code: 404, message: `No se encontraron resultados` };
  };

  // Retorna el conjunto de joyas
  return joyas;
};

/**
 * Realiza una búsqueda de joyas filtradas por precio, categoría y metal.
 * @param {Object} filters - Filtros para la búsqueda (precio_min, precio_max, categoria, metal).
 * @returns {Promise<Array>} - Retorna un array de joyas que coinciden con los filtros.
 * @throws {Object} - Lanza un error si no se encuentran resultados.
 */
const getJoyasSearch = async ({ precio_min, precio_max, categoria, metal }) => {
  // Inicializa arrays para construir la consulta SQL y sus valores asociados
  let filtros = [];
  const values = [];

  // Función para agregar filtros según los parámetros dados
  function agregarFiltros(campo, comparador, valor) {
    values.push(valor);
    const { length } = filtros
    filtros.push(`${campo} ${comparador} $${length + 1}`)
  }

  // Agrega filtros según los parámetros dados
  if (precio_min) agregarFiltros('precio', '>=', precio_min);
  if (precio_max) agregarFiltros('precio', '<=', precio_max);
  if (categoria) agregarFiltros('categoria', '=', categoria);
  if (metal) agregarFiltros('metal', '=', metal);

  // Construye la consulta SQL según los filtros
  let consulta = 'SELECT * FROM inventario';
  if (filtros.length > 0) {
    filtros = filtros.join(' AND ');
    consulta += ` WHERE ${filtros}`
  };

  // Ejecuta la consulta en la base de datos
  const { rows: joyas, rowCount } = await pool.query(consulta, values);

  // Manejo de errores si no se encuentran resultados
  if (rowCount === 0) {
    throw { code: 404, message: `La consulta no tiene resultados, pruebe con otros parametros` };
  };

  // Retorna el conjunto de joyas que coinciden con los filtros
  return joyas;
};

/**
 * Prepara datos HATEOAS (Hypermedia as the Engine of Application State) para el conjunto de joyas dado.
 * @param {Array} joyas - Conjunto de joyas.
 * @returns {Object} - Retorna un objeto con datos HATEOAS.
 */
const prepararHATEOAS = (joyas) => {
  // Mapea cada joya a un objeto con nombre y enlace (HATEOAS)
  const results = joyas.map((j) => {
    return {
      name: j.nombre,
      href: `joyas/joya/${j.id}`,
    }
  });

  // Calcula el total de joyas y el total de stock en el conjunto dado
  const totalJoyas = joyas.length
  const totalStock = joyas.reduce((total, j) => total + j.stock, 0);

  // Construye el objeto HATEOAS con los resultados y estadísticas
  const HATEOAS = {
    totalJoyas,
    totalStock,
    results
  }

  // Retorna el objeto HATEOAS
  return HATEOAS;
};

// Exporta las funciones para su uso en otros módulos
module.exports = { getJoyas, prepararHATEOAS, getJoyasSearch };
