import fastify from 'fastify'
import 

const app = fastify()

app.get('/', async (request, reply) => {
  
})

app.listen({ port: 3333 }, () => console.log('Server on port 3333'))