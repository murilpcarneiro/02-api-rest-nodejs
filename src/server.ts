import { app } from './app'
import { env } from './env'

const PORT = env.PORT || 3333

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log(`The server is running on port ${PORT}`))
