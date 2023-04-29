import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import Fastify from 'fastify';
import { MailerRoutes } from './routes/routes'
import {HOST, PORT} from './config/config'

const server = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(MailerRoutes, {url: "/mailer"})

server.listen({host: HOST,port: parseInt(PORT)}, (err: any, addres: any) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('todo bien pa')
})
