import { Elysia, error, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import authPlugin from './plugins/auth';
import blogplugin from './plugins/blog';
import connectDb from './data-source';

connectDb();
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
