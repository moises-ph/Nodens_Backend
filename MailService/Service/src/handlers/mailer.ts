import { FastifyRequest, FastifyReply } from 'fastify'

export const sendMailInApplication = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    
  } 
  catch(err) {
    return res.code(500).send(err);
  }
}