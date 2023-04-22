import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import Fastify from 'fastify';


const server = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

server.listen({port: 8000}, (err: any, addres: any) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('todo bien pa')
})
