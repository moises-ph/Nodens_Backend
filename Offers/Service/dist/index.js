"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./configuration/config");
const server = (0, app_1.build)({
    logger: {
        level: 'info'
    }
});
server.listen({ host: config_1._HOST, port: parseInt(config_1._PORT, 10) }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
