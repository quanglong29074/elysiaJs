import { Elysia, t } from 'elysia';
import * as blogService from '../services/blogService';
import { isAuthenticated } from '../middleware/auth';

const blogPlugin = new Elysia()
  .group("/blogs", (group) =>
    group
      .get("/", async () => {
        return await blogService.getAllBlogs();
      }, {
        detail: {
          tags: ['Blogs']
        }
      })
      .get("/:id", async ({ params }) => {
        const { id } = params;
        return await blogService.getBlogById(id);
      }, {
        detail: {
          tags: ['Blogs']
        },
        params: t.Object({
          id: t.String()
        })
      })
       .get("/search", async ({ query }) => {
        const { search } = query;
        return await blogService.searchBlogs(search);
      }, {
        detail: {
          tags: ['Blogs']
        },
        query: t.Object({
          search: t.String()
        })
      })
      .post("/createBlog", async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        const { title, content, image } = body;
        return await blogService.createBlog(title, content, image, loggedUser.id);
      }, {
        detail: {
          tags: ['Blogs'],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          title: t.String(),
          content: t.String(),
          image: t.String()
        })

      })
      .put("/updateBlog/:id", async ({ headers, body, params }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        const { id } = params;
        const { title, content, image } = body;
        return await blogService.updateBlog(id, title, content, image);
      }, {
        detail: {
          tags: ['Blogs'],
          security: [
            { JwtAuth: [] }
          ],
        },
        body: t.Object({
          title: t.String(),
          content: t.String(),
          image: t.String()
        }),
        params: t.Object({
          id: t.String()
        })
      })
      .delete("/deleteBlog/:id", async ({ headers, params }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        const { id } = params;
        return await blogService.deleteBlog(id);
      }, {
        detail: {
          tags: ['Blogs'],
          security: [
            { JwtAuth: [] }
          ],
        },
        params: t.Object({
          id: t.String()
        })
      })
  );

export default blogPlugin;
