'use strict';
const assert = require('assert');

const indexRouter = require('./routes/index.router');

class Main {

    constructor({app, config}) {
        assert(app && config, `expected express application ${app} and environment configurations ${config}`);

        app.get('/', indexRouter)
    }

    start() {
        console.log(`App running`);
    }

    stop() {
        console.log(`App terminating`);
    }
}

module.exports = Main;
