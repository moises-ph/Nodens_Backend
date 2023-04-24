import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import Fastify from 'fastify';
import { MailerRoutes } from './routes/routes'

const server = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(MailerRoutes, {url: "/mailer"})

server.listen({port: 8000}, (err: any, addres: any) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('todo bien pa')
})
