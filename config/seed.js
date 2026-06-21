const Usuaria = require('../src/models/usuaria.model');

const cargarDatosDePrueba = async () => {
    try {
        // Contamos si ya existen usuarias para no duplicar datos
        const count = await Usuaria.count();
        if (count > 0) {
            console.log('🌱 La base de datos ya tiene usuarias cargadas.');
            return;
        }

        console.log('🌱 Insertando usuarias de prueba...');

        await Usuaria.bulkCreate([
            // --- OPERADORAS (idUsuario: 1) ---
            {
                nombre: 'Martina López',
                telefono: '3884010203',
                email: 'martina.operadora@transporte.com',
                usuario: 'martina_op',
                contraseña: 'password123', // En producción iría haseada
                rol: 'operadora'
            },
            // --- PASAJERAS (idUsuario: 2 y 3) ---
            {
                nombre: 'Laura Benítez',
                telefono: '3884556677',
                email: 'laura.pasajera@gmail.com',
                usuario: 'laura_pasajera',
                contraseña: 'password123',
                rol: 'pasajera'
            },
            {
                nombre: 'Sofía Rodríguez',
                telefono: '3884998811',
                email: 'sofia.rodriguez@gmail.com',
                usuario: 'sofia_pasajera',
                contraseña: 'password123',
                rol: 'pasajera'
            },
            // --- CONDUCTORAS (idUsuario: 4, 5, 6, 7) ---
            {
                nombre: 'Elena Gómez',
                telefono: '3884112233',
                email: 'elena.conductora@outlook.com',
                usuario: 'elena_viajes',
                contraseña: 'password123',
                rol: 'conductora',
                disponible: true,
                matricula: 45502
            },
            {
                nombre: 'Valeria Cruz',
                telefono: '3885889900',
                email: 'valeria.conductora@gmail.com',
                usuario: 'valeria_viajes',
                contraseña: 'password123',
                rol: 'conductora',
                disponible: true,
                matricula: 61129
            },
            {
                nombre: 'Tatiana Gonzales',
                telefono: '3884112233',
                email: 'tatigonzales.conductora@outlook.com',
                usuario: 'tati_viajes',
                contraseña: 'password123',
                rol: 'conductora',
                disponible: true,
                matricula: 45511
            },
            {
                nombre: 'Patricia Cruz',
                telefono: '3885889900',
                email: 'paty.conductora@gmail.com',
                usuario: 'paty_viajes',
                contraseña: 'password123',
                rol: 'conductora',
                disponible: true,
                matricula: 61100
            }
        ]);

        console.log('✅ Usuarias de prueba insertadas con éxito.');
    } catch (error) {
        console.error('❌ Error al cargar el seed de datos:', error);
    }
};

module.exports = cargarDatosDePrueba;