const Blog = require('../models/Blog');

// @desc    Get all blog articles
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = {};

    if (search) {
      // Use text search index or regex
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog article by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog article not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog article not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog article (Admin)
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, tags, readTime } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt,
      author: req.user._id,
      authorName: req.user.name,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
      tags,
      readTime: readTime || '5 min read'
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog article (Admin)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, tags, readTime } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.excerpt = excerpt || blog.excerpt;
      blog.imageUrl = imageUrl || blog.imageUrl;
      blog.tags = tags || blog.tags;
      blog.readTime = readTime || blog.readTime;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog article (Admin)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog article removed successfully' });
    } else {
      res.status(404).json({ message: 'Blog article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
