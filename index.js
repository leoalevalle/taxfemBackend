const express = require('express'); 
const cors = require('cors'); 
const sequelize = require('./config/database'); 
const cargarDatosDePrueba = require('./config/seed');

// === CENTRALIZACIÓN DE RELACIONES (Para evitar bucles de importación) ===
const Usuaria = require('./src/models/usuaria.model');
const SolicitudViaje = require('./src/models/solicitudViaje.model');
const Viaje = require('./src/models/viaje.model');

// === Configuración de Swagger ===
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

var app = express(); 
 
//middlewares 
app.use(cors());
app.use(express.json());
 
// Interfaz de Swagger expuesta en la raíz /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Cargamos el modulo de direccionamiento de rutas 
app.use('/api/solicitud', require('./src/routes/solicitud.route'));
app.use('/api/conductora', require('./src/routes/conductora.route'));
app.use('/api/viaje', require('./src/routes/viaje.route'));
 
//setting 
app.set('port', process.env.PORT || 3000); 

// 1. Pasajera ----> Solicitudes
Usuaria.hasMany(SolicitudViaje, { foreignKey: 'pasajeraId', as: 'solicitudes' });
SolicitudViaje.belongsTo(Usuaria, { foreignKey: 'pasajeraId', as: 'pasajera' });

// 2. SolicitudViaje ----> Viaje
SolicitudViaje.hasOne(Viaje, { foreignKey: 'solicitudId', as: 'viaje' });
Viaje.belongsTo(SolicitudViaje, { foreignKey: 'solicitudId', as: 'solicitud' });

// 3. Operadora ----> Viajes Asignados
Usuaria.hasMany(Viaje, { foreignKey: 'operadoraId', as: 'viajesAsignados' });
Viaje.belongsTo(Usuaria, { foreignKey: 'operadoraId', as: 'operadora' });

// 4. Conductora ----> Viajes Realizados
Usuaria.hasMany(Viaje, { foreignKey: 'conductoraId', as: 'viajesRealizados' });
Viaje.belongsTo(Usuaria, { foreignKey: 'conductoraId', as: 'conductora' });

// Sincronizar Base de Datos y arrancar el servidor 
sequelize.sync({ force: true, alter: true }) // <-- ¡Recuerda volver a false el force!
    .then(async () => { // <-- Asegúrate de agregar 'async' aquí
        console.log('Tablas de PostgreSQL sincronizadas');
        
        await cargarDatosDePrueba(); // <-- 2. Ejecuta la carga de datos aquí

        app.listen(app.get('port'), () => {
            console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
            console.log(`Documentación interactiva Swagger: http://localhost:${app.get('port')}/api-docs`);
            console.log(`Viajes: http://localhost:${app.get('port')}/api/viaje`);
            console.log(`solicitud: http://localhost:${app.get('port')}/api/solicitud`);
            console.log(`usuaria: http://localhost:${app.get('port')}/api/usuaria`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar: ', err);
    });
    
    
    