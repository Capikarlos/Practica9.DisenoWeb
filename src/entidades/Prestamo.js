import { formatearFechaFlecha } from '../helpers/Funciones.js';

export class Prestamo {
    /**
     * Clase que representa un préstamo de libro.
     * Contiene referencias al libro y al usuario, además de fechas y multa.
     *
     * @constructor
     * @param {object} libro - Instancia de la clase Libro.
     * @param {object} usuario - Instancia de la clase Usuario.
     */
    constructor(libro, usuario) {
        this.libro = libro;
        this.usuario = usuario;
        this.fechaPrestamo = new Date(); // cuando se realiza el préstamo
        this.fechaDevolucion = null;     // se rellenará al devolver el libro
        this.multa = 0;                  // multa calculada (si aplica)
    }

    /**
     * _diasTranscurridos
     * Función "privada" (convención con guión bajo) que devuelve
     * el número de días completos entre dos fechas.
     *
     * @param {Date} fechaInicio
     * @param {Date} fechaFin
     * @returns {number} días redondeados hacia arriba
     */
    _diasTranscurridos(fechaInicio, fechaFin) {
        const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
        // Convertimos milisegundos a días (1000 ms * 60 s * 60 min * 24 h).
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * registrarDevolucion
     * Marca el préstamo como devuelto si aún no lo estaba, guarda la fecha,
     * calcula la multa y notifica al libro que ha sido devuelto.
     *
     * @returns {boolean} true si se registró la devolución por primera vez, false si ya estaba devuelto
     */
    registrarDevolucion() {
        if (!this.fechaDevolucion) {
            this.fechaDevolucion = new Date();
            // Al fijar la fecha de devolución, recalculamos la multa correspondiente.
            this.multa = this.calcularMulta();
            this.libro.devolver(); // acción sobre la instancia Libro
            return true;
        }
        // Si ya tenía fecha de devolución, no hacemos nada.
        return false;
    }

    /**
     * calcularMulta
     * Método como arrow function para garantizar el this léxico.
     * Calcula la multa según los días de retraso: $2 por día adicional
     * sobre los días permitidos por el libro.
     *
     * Nota: si no hay fecha de devolución aún, la multa es 0.
     *
     * @returns {number} monto de la multa en la misma unidad monetaria usada por la app
     */
    calcularMulta = () => {
        if (!this.fechaDevolucion) return 0;

        const diasTranscurridos = this._diasTranscurridos(this.fechaPrestamo, this.fechaDevolucion);
        const diasBase = this.libro.diasPrestamo(); // límite de préstamo definido por Libro
        const diasRetraso = Math.max(0, diasTranscurridos - diasBase);

        // Regla de negocio: $2 por cada día de retraso.
        return diasRetraso * 2;
    }

    /**
     * infoPrestamo
     * Devuelve una cadena legible con el estado del préstamo, fecha,
     * usuario, libro y multa calculada.
     *
     * Se usa una arrow function interna para construir el estado dinámico.
     *
     * @returns {string} resumen formateado del préstamo
     */
    infoPrestamo() {
        const estadoPrestamo = () => this.fechaDevolucion 
            ? `DEVUELTO el ${formatearFechaFlecha(this.fechaDevolucion)}.`
            : 'ACTIVO (pendiente de devolución).';

        return `
--- DETALLE DEL PRÉSTAMO ---
Libro: ${this.libro.descripcion} (${this.libro.isbn})
Usuario: ${this.usuario.nombre} (ID: ${this.usuario.id})
Fecha Préstamo: ${formatearFechaFlecha(this.fechaPrestamo)}
Estado: ${estadoPrestamo()}
Multa Calculada: $${this.multa}
-----------------------------
        `.trim();
    }
}