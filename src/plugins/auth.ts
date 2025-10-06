// import { Elysia, t } from 'elysia';
// import * as userService from '../services/userService';
// import { isAuthenticated } from '../middleware/auth';

// const authPlugin = new Elysia()
//   .group("/auth", (group) =>
//     group
//   .get("/users", async ({  }) => {
//     return await userService.getAllUser();
//   }, {
//     detail: {
//       tags: ['auth'],
//     }
//   })
//       .post("/register", async ({ body }) => {
//         return await userService.register(body);
//       }, {
//         detail: {
//           tags: ['auth'],
//         },
//         body: t.Object({
//           username: t.String(),
//           password: t.String()
//         })
//       })
//       .post("/login", async ({ body }) => {
//         return await userService.login(body);
//       }, {
//         detail: {
//           tags: ['auth'],
//         },
//         body: t.Object({
//           username: t.String(),
//           password: t.String()
//         })
//       })
     
//   );

// export default authPlugin;
