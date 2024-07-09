import { Elysia, error, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import mongoose from 'mongoose';

import authPlugin from './plugins/auth';
import blogplugin from './plugins/blog';

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/C')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const app = new Elysia()
  .use(swagger({
    path: '/swagger-ui',
    provider: 'swagger-ui',
    documentation: {
      info: {
        title: 'Elysia template',
        description: 'Elysia template API Documentation',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          JwtAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT Bearer token **_only_**'
          }
        }
      },
    },
    swaggerOptions: {
      persistAuthorization: true,
    }
  }))
  .group("/api", (group) =>
    group
      .use(authPlugin)
      .use(blogplugin)
  //add more plugins here
)
 
  .listen(3000);


app.listen(3000, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
