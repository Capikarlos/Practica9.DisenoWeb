import { formatearFechaFlecha } from '../helpers/Funciones.js';

/**
 * Clase que representa un libro en la biblioteca.
 * Contiene estado básico (título, autor, ISBN, disponibilidad y fecha de registro)
 * y métodos para operaciones habituales sobre el libro.
 */
export class Libro {
  /**
   * Crea una instancia de Libro.
   * @param {string} titulo - Título del libro.
   * @param {string} autor - Autor del libro.
   * @param {string} isbn - Identificador ISBN (formato esperado según validarISBN).
   */
  constructor(titulo, autor, isbn) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.disponible = true;
    this.fechaRegistro = new Date();
  }

  /**
   * Intenta prestar el libro.
   * Cambia el estado a no disponible si el libro estaba disponible.
   * @returns {boolean} true si el préstamo se realizó; false si ya estaba prestado.
   */
  prestar() {
    if (this.disponible) {
      this.disponible = false;
      return true;
    }
    return false;
  }

  /**
   * Devuelve el libro.
   * Implementado como método flecha para enlazar this correctamente si se pasa como callback.
   * Realiza un efecto secundario (log) y no devuelve valor.
   */
  devolver = () => {
    this.disponible = true;
    console.log(`Libro devuelto: ${this.titulo}`);
  };

  /**
   * Devuelve una cadena con la fecha de registro formateada.
   * Utiliza la función helper importada formatearFechaFlecha.
   * @returns {string} Fecha de registro formateada.
   */
  infoRegistro() {
    return `Registrado el: ${formatearFechaFlecha(this.fechaRegistro)}`;
  }

  /**
   * Descripción legible del libro (titulo - autor).
   * Usar como propiedad de solo lectura.
   * @returns {string}
   */
  get descripcion() {
    return `${this.titulo} - ${this.autor}`;
  }

  /**
   * Calcula los días de préstamo según el estado del libro.
   * Implementado como método flecha para sintaxis compacta y binding léxico.
   * @returns {number} 0 si está disponible, 15 si está prestado (valor por defecto).
   */
  diasPrestamo = () => this.disponible ? 0 : 15;

  /**
   * Consulta si el libro está disponible.
   * Método tradicional por claridad cuando solo se requiere lectura de estado.
   * @returns {boolean}
   */
  estaDisponible() {
    return this.disponible;
  }

  /**
   * Crea una instancia de libro de ejemplo.
   * Útil para pruebas o demostraciones rápidas.
   * @returns {Libro}
   */
  static crearLibroDemo = () => new Libro("Libro Demo", "Autor Demo", "000000");

  /**
   * Valida el formato del ISBN.
   * Actualmente acepta exactamente 6 dígitos (ajustar la expresión regular si cambia el formato esperado).
   * @param {string} isbn
   * @returns {boolean} true si el ISBN cumple el patrón; false en caso contrario.
   */
  static validarISBN = (isbn) => /^\d{6}$/.test(isbn);
}