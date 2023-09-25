// import config from '../config/config.js';
import __dirname from '../server/utils.js';

const url = 'http://127.0.0.1:8080/';
const ports = 'http://127.0.0.1:8080/';
const email = 'ovejero.gustavo92@gmail.com';

export const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce para Proyecto Final de Coderhouse',
            version: '1.0.0',
            description: '<img src="/img/Logo-canguro.webp" alt="Lonne Open" height="180" /> <br><br><img src="https://jobs.coderhouse.com/assets/logos_coderhouse.png" alt="CoderHouse" height="80" /> <br><br><br> Descripción: <br><br>API de prueba para el curso de Backend de Coderhouse 2023<br><br>Autenticación: Esta API no requiere autenticación para las operaciones de solo lectura (GET). <br>Sin embargo, las operaciones de escritura (POST, PUT, DELETE) requieren autenticación del usuario administrador.<br><br> Formato de fecha: Las fechas se deben proporcionar en el formato ISO 8601 (por ejemplo, "2023-07-25 | 12:34:56").<br><br> Errores: La API devuelve errores detallados en formato JSON si ocurre algún problema durante las operaciones.',
            termsOfService: 'https://www.coderhouse.com/legales',
            contact: {
                name: 'Gustavo Ovejero',
                email: email,
            },

        },
        servers: [
            {
                url: `${url}:${ports}`,
            },
        ],
        externalDocs: {
            description: 'Volver al sitio web',
            target: '_self',
            url: '/',
        },
    },
    apis: [
        `${__dirname}/docs/**/*.yaml`,
    ],
};
