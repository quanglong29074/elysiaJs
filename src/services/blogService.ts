import {Blog} from '../entity/blog';

export const getAllBlogs = async (title: string , startDate: Date, endDate: Date) => {
    try {
        const query: any = {};

        // lọc theo title (tìm gần đúng, không phân biệt hoa thường)
        if (title) {
            query.title = { $regex: title, $options: "i" };
        }

        // lọc theo createdAt trong khoảng startDate - endDate
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = startDate;
            if (endDate) query.createdAt.$lte = endDate;
        }

        const allBlogs = await Blog.find(query)
            .populate("user_id", "username")
            .sort({ createdAt: -1 }); // ví dụ sắp xếp mới nhất trước

        return allBlogs;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Could not fetch blogs");
    }
};

export const getBlogById = async (id: string, title: string , startDate: Date, endDate: Date) => {
    const query: any = {};

    // lọc theo title (tìm gần đúng, không phân biệt hoa thường)
    if (title) {
        query.title = { $regex: title, $options: "i" };
    }

    // lọc theo createdAt trong khoảng startDate - endDate
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
    }
    const blog = await Blog.find({_id: id}).find(query).populate('user_id', 'username');
    return blog;
};

export const createBlog = async (title: string, content: string, image: string, userId: string) => {
       const newBlog = new Blog({title, content, image, createdAt: new Date(), user_id: userId});
       await newBlog.save();
       return newBlog;
};

export const updateBlog = async (id: string, title: string, content: string, image: string) => {
    const blog = await Blog.findOne({_id: id});
    if (!blog) {
        throw new Error('Blog not found or you do not have permission to update');
    }

    blog.title = title;
    // blog.content = content;
    // blog.image = image;
    await blog.save();

    return blog;
};

export const deleteBlog = async (id: string) => {
        const result = await Blog.deleteOne({_id: id});
        if (result.deletedCount === 0) {
            throw new Error('Error deleting blog');
        }
        return result;
};

export const searchBlogs = async (search: string) => {
    try {
        const regex = new RegExp(search, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
        const blogs = await Blog.find({
            $or: [
                {title: {$regex: regex}},
                {content: {$regex: regex}}
            ]
        }).populate('user_id', 'username');
        return blogs;
    } catch (error) {
        console.error('Error searching blogs:', error);
        throw new Error('Could not search blogs');
    }
};
