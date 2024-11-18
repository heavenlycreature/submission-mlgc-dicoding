const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const InputError = require('../exceptions/InputError');
const loadModel = require('../inference/loadModel');
require('dotenv').config();

(async () => {

    
    const server = Hapi.server({
        port: process.env.APP_PORT || 3000,
        host:  process.env.APP_HOST ||'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
            payload: {
                maxBytes: 1 * 1024 * 1024,
            }
        }
    })
    const model = await loadModel();
    server.app.model = model;

    server.route(routes);
    
    server.ext('onPreResponse', function (req, h) {
        const response = req.response;
        
        if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: 'fail',
                message: `Payload content length greater than maximum allowed: 1000000`
            });
            newResponse.code(413);
            return newResponse;
        }

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
        return h.continue;
    })

    await server.start();
    console.log(`Server berjalan pada port: ${server.info.uri}`);
})()