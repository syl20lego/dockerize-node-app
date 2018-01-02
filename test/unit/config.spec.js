'use strict';
const Config = require('../../src/config');

describe('test suite for config', () => {
    ['test', 'local'].forEach((environment) => {
        it('should have environment', () => {
            const config = Config(environment);
            expect(config.environment).toBe(environment);
        });
        it('should have production value set', () => {
            const production = {
                test: false,
                local: false
            };
            const config = Config(environment);
            expect(config.production).toBe(production[environment]);
        });
    });
});