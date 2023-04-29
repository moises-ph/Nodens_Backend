"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const server = (0, app_1.build)({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty'
        }
    }
});
server.listen({ port: 8000 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
