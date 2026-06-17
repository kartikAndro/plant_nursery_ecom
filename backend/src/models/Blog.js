const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  authorName: { type: String, required: true, default: 'Nursery Expert' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Create text index for search support
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
