const path = require('path');


/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const settings = {
    PROJECT_DIR : __dirname,
    MODULES_DIR :  path.join(__dirname, '/node_modules/'),
    PORT:  normalizePort(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080),
    IP:    process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
};

module.exports = settings;