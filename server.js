'use strict';

const Express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');

const settings = require('./settings');
const Config = require('./src/config');
const Main = require('./src');

const server = () => {
    const context = {
        config: initConfig()
    };
    context.app = setupApp();
    context.main = new Main(context);

    notFoundHandlers(context);
    errorHandlers(context);

    context.http = createServer(context);

    processListeners(context);

    return context.http;
};

const initConfig = () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'local';
    const config = Config(process.env.NODE_ENV);
    console.log(`Execution environment: ${config.environment}`);
    return config;
};

const setupApp = () => {
    const app = Express();
    app.use(helmet());
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    return app;
};

const createServer = ({app, main}) => {
    const server = app.listen(settings.PORT, settings.IP, () => {
        console.log(`Running on ${settings.IP}:${settings.PORT}`);
        main.start();
    });
    server.on('error', onError);
    return server;
};


const notFoundHandlers = ({app}) => {
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};

const errorHandlers = ({app, config}) => {
    // development error handler will print stacktrace
    // production error handler no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        formatError(err, req, res, !config.production)
    });
};

const formatError = (err, req, res, showDetails) => {
    res.format({
        json: function () {
            res.json({
                message: err.message,
                error: showDetails ? err : {}
            });
        },
        text: function () {
            res.type('txt').send('Not found');
        },
        default: function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
    });
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError =(error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`using port ${error.port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`port ${error.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const processListeners = (context) => {
    process.on('SIGTERM', () => {
        cleanup(context)
    });
    process.on('SIGINT', () => {
        cleanup(context)
    });
};

const cleanup = ({http, main}) => {
    console.log("terminating...");
    http.close(() => {
        console.log("Clean up application");
        // Close db connections, etc.
        main.stop();
        console.log("Done, terminated");
        process.exit(0);
    });

    setTimeout(() => {
        console.error("Could not terminate in time, forcefully shutting down");
        process.exit(1);
    }, 30 * 1000);
};

module.exports = server();