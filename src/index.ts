import { Elysia, error, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/C')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
    
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);

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
  .listen(3000);

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

// Đăng ký người dùng và lưu vào cơ sở dữ liệu
app.post('/api/register', async ({ body }) => {
  const { username, password } = body;

  // Kiểm tra xem username đã tồn tại chưa
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return newUser;
}, {
  detail: {
    tags: ['auth']
  },
  body: t.Object({
    username: t.String(),
    password: t.String()
  })
});

// Đăng nhập và trả về JWT token
app.post('/api/login', async ({ body }) => {
  const { username, password } = body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  return { token };
}, {
  detail: {
    tags: ['auth']
  },
  body: t.Object({
    username: t.String(),
    password: t.String()
  })
});

// Lấy danh sách các blog
app.get('/api/blogs', async () => {
  const allBlogs = await Blog.find().populate('user_id', 'username');
  return allBlogs;
}, {
  detail: {
    tags: ['Blogs']
  }
});

app.get('/api/blogs/:id', async ({params,set}) => {
  const {id} = params
  const blog = await Blog.findOne({ _id: id}).populate('user_id', 'username');
  if (!blog) {
    set.status = 404;
    throw new Error('Blog not found or you do not have permission to update');
  }
  return blog;
},{
  detail: {
    tags:['Blogs']
  }
})


// Thêm mới một blog
app.post('/api/blogs', async ({ headers, body, set }) => {
  const token = headers.authorization;
  if (!token) {
    set.status = 403;
    throw new Error('Unauthorized');
  }

  const jwtToken = token.split(' ')[1];
  const loggedUser = jwt.verify(jwtToken, 'your_jwt_secret') as JwtPayloadWithId;
  const { title, content, image } = body;
  console.log(loggedUser.id);
  const userId = "668b51d70f6545801e61d77b"
  
  const newBlog = new Blog({ title, content, image, createdAt: new Date(), user_id: userId });
  await newBlog.save();

  return newBlog;
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
    image: t.String(),
  })
});

app.put('/api/blogs/:id', async ({ headers, params, body, set }) => {
  const token = headers.authorization;
  if (!token) {
    set.status = 403;
    throw new Error('Unauthorized');
  }

  const jwtToken = token.split(' ')[1];
  const loggedUser = jwt.verify(jwtToken, 'your_jwt_secret') as JwtPayloadWithId;
  const { id } = params;
  const { title, content, image } = body;

  

  // Kiểm tra xem blog có tồn tại và thuộc về người dùng đang đăng nhập không
  const blog = await Blog.findOne({ _id: id});
  if (!blog) {
    set.status = 404;
    throw new Error('Blog not found or you do not have permission to update');
  }

  // Cập nhật thông tin của blog
  blog.title = title;
  blog.content = content;
  blog.image = image;
  await blog.save();

  return blog;
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
    image: t.String(),
  })
});

app.delete('api/blogs/:id', async ({params}) => {
const {id} = params
const removeBlog = await Blog.deleteOne({_id: id})
if(removeBlog.deletedCount === 0 ){
  throw new Error('error')
}
return removeBlog
}, {
  detail: {
    tags: ['Blogs'],
    security: [
      { JwtAuth: [] }
    ],
  }
})


app.listen(3000, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
