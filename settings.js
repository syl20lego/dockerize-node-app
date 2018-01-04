const path = require('path');

const settings = {
    PROJECT_DIR : __dirname,
    MODULES_DIR :  path.join(__dirname, '/node_modules/'),
    DEFAULT_PORT: 3000
};

module.exports = settings;