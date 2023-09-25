 import twilio from 'twilio';
 // import config from '../config/config.js';
 import loggers from '../config/logger.js'
 import customError from '../services/error.log.js';

// Configuración de Twilio
const twilioNumberPhone = '+15736853494';
const twilioAccountSid = 'AC73582926104d4e2e58afdaab71f59e59';
const twilioAuthToken = 'd539793f9fbe265c13775948dacc5acf';

// Configuración de Twilio
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Función para enviar un SMS utilizando Twilio
export const sendSMS = async (userPhone) => {
 try {        
    const message = `El usuario con el número de celular: ${userPhone} acaba de realizar una compra en Lonne Open.`;       
        
   await twilioClient.messages.create({
       body: message,
       from: twilioNumberPhone,
       to: '+1169594538',
         });
     } catch (err) {
         customError(err);
         loggers.error('Error al enviar el SMS');
     }
 };
