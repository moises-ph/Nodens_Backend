import { build } from "./app";
import { _HOST, _PORT } from "./configuration/config";

const server = build({
  logger: {
    level: 'info'
  }
});

server.listen({ host : _HOST,port: parseInt(_PORT,10) }, (err: any, address: any) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
