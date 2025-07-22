// import { Blog } from '../entity/blog';
//
// export const getAllBlogs = async () => {
// const allBlogs = await Blog.find().populate('user_id', 'username');
// return allBlogs;
// };
//
// export const getBlogById = async (id: string) => {
//   const blog = await Blog.find({ _id: id }).populate('user_id', 'username');
//   return blog;
// };
//
// export const createBlog = async (title: string, content: string, image: string, userId: string) => {
//   const newBlog = new Blog({ title, content, image, createdAt: new Date(), user_id: userId });
//   await newBlog.save();
//   return newBlog;
// };
//
// export const updateBlog = async (id: string, title: string, content: string, image: string) => {
//   const blog = await Blog.findOne({ _id: id });
//   if (!blog) {
//     throw new Error('Blog not found or you do not have permission to update');
//   }
//
//   blog.title = title;
//   // blog.content = content;
//   // blog.image = image;
//   await blog.save();
//
//   return blog;
// };
//
// export const deleteBlog = async (id: string) => {
//   const result = await Blog.deleteOne({ _id: id });
//   if (result.deletedCount === 0) {
//     throw new Error('Error deleting blog');
//   }
//   return result;
// };
//
// export const searchBlogs = async (search: string) => {
//   const regex = new RegExp(search, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
//   const blogs = await Blog.find({
//     $or: [
//       { title: { $regex: regex } },
//       { content: { $regex: regex } }
//     ]
//   }).populate('user_id', 'username');
//   return blogs;
// };
