import { build } from "./app";

const server = build({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
});

server.listen({ port: 8000 }, (err: any, address: any) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
