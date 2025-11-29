import { BibliotecaService } from './servicios/BibliotecaService.js';

const biblioteca = new BibliotecaService();

console.log("--- SISTEMA DE BIBLIOTECA: NUEVA SIMULACIÓN DE PRÉSTAMOS ---");

// Datos semilla: nuevos libros y usuarios
biblioteca.agregarLibro("El nombre del viento", "Patrick Rothfuss", "B100");
biblioteca.agregarLibro("Fundación", "Isaac Asimov", "B200");
biblioteca.registrarUsuario("Luis Méndez", "U10");
biblioteca.registrarUsuario("María López", "U20");

// 1. Registrar varios préstamos
console.log("\n> 1. Registrando préstamos de prueba...");
const prestamo1 = biblioteca.registrarPrestamo("B100", "U10"); // préstamo que luego devolveremos a tiempo
const prestamo2 = biblioteca.registrarPrestamo("B200", "U20"); // préstamo que devolveremos con retraso
const prestamo3 = biblioteca.registrarPrestamo("B100", "U20"); // intento extra (puede fallar si libro no disponible)

// Mostrar resumen inicial de préstamos válidos
[prestamo1, prestamo2, prestamo3].forEach((p, i) => {
    if (p) {
        console.log(`   Préstamo ${i + 1}: ${p.infoPrestamo()}`);
    } else {
        console.log(`   Préstamo ${i + 1}: No se pudo crear (recurso no disponible o datos inválidos).`);
    }
});

// 2. Simular devoluciones con distintos escenarios (espera breve)
console.log("\n> 2. Simulando devoluciones (espera 2 segundos)...");
setTimeout(() => {
    // a) Devolución a tiempo: retrocedemos 5 días (dentro del plazo)
    if (prestamo1) {
        const fechaSimulada1 = new Date();
        fechaSimulada1.setDate(fechaSimulada1.getDate() - 5);
        prestamo1.fechaPrestamo = fechaSimulada1;

        console.log("\n   a) Devolución de préstamo 1 (a tiempo)...");
        prestamo1.registrarDevolucion();
        console.log(`      Estado: ${prestamo1.infoPrestamo()}`);
    }

    // b) Devolución con retraso: retrocedemos 30 días (genera multa)
    if (prestamo2) {
        const fechaSimulada2 = new Date();
        fechaSimulada2.setDate(fechaSimulada2.getDate() - 30);
        prestamo2.fechaPrestamo = fechaSimulada2;

        console.log("\n   b) Devolución de préstamo 2 (con retraso)...");
        prestamo2.registrarDevolucion();
        console.log(`      Estado: ${prestamo2.infoPrestamo()}`);
    }

    // c) Prestamo3 pudo ser null; si existe, lo dejamos activo (no devuelto)
    if (prestamo3) {
        console.log("\n   c) Préstamo 3 se mantiene activo (no devuelto).");
        console.log(`      Estado: ${prestamo3.infoPrestamo()}`);
    }

    // 3. Búsqueda de préstamos por usuario (callback)
    console.log("\n> 3. Historial de préstamos del usuario 'U20'...");
    biblioteca.buscarPrestamosPorUsuario("U20", function(resultados) {
        console.log(`   Total registros encontrados: ${resultados.length}`);
        resultados.forEach(r => {
            const estado = r.devuelto ? 'Devuelto' : 'Activo';
            console.log(`   - Libro: ${r.libro.titulo} | Usuario: ${r.usuario.nombre} | Estado: ${estado} | Multa: $${r.multa}`);
        });
    });

    // 4. Cálculo de multas totales pendientes (reduce/arrow)
    const totalMultas = biblioteca.calcularMultasPendientes();
    console.log(`\n> 4. Balance: Total multas pendientes en el sistema: $${totalMultas}`);

    // 5. Auditoría rápida: listar libros disponibles (si el servicio tiene un método similar)
    if (typeof biblioteca.listarLibrosDisponibles === 'function') {
        console.log("\n> 5. Libros actualmente disponibles:");
        biblioteca.listarLibrosDisponibles().forEach(l => {
            console.log(`   - ${l.titulo} por ${l.autor} (ID: ${l.isbn})`);
        });
    } else {
        console.log("\n> 5. (Opcional) Método listarLibrosDisponibles no implementado en el servicio.");
    }

    console.log("\n--- FIN DE NUEVA SIMULACIÓN ---");
}, 2000);
