import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, Clock, ArrowLeft, ArrowRight, Tag, BookOpen } from 'lucide-react';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected article ID (if view single post)
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogDetail, setBlogDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // List states
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Predefined filter tags list
  const tagsList = ['All', 'Care Guide', 'Indoor Plants', 'Succulents', 'Bonsai', 'Troubleshooting', 'Plant Care', 'Beginner Friendly', 'Outdoor', 'Pruning'];

  // Check URL query parameters for tag filter
  useEffect(() => {
    const urlTag = searchParams.get('tag');
    if (urlTag) {
      setSelectedTag(urlTag);
    }
  }, [searchParams]);

  // Fetch blogs list
  useEffect(() => {
    if (!selectedBlogId) {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTag && selectedTag !== 'All') params.append('tag', selectedTag);

      fetch(`http://localhost:5000/api/blogs?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setBlogs(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching blogs:', err);
          setLoading(false);
        });
    }
  }, [search, selectedTag, selectedBlogId]);

  // Fetch single article
  useEffect(() => {
    if (selectedBlogId) {
      setDetailLoading(true);
      fetch(`http://localhost:5000/api/blogs/${selectedBlogId}`)
        .then((res) => res.json())
        .then((data) => {
          setBlogDetail(data);
          setDetailLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setDetailLoading(false);
        });
    } else {
      setBlogDetail(null);
    }
  }, [selectedBlogId]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (tag === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ tag });
    }
  };

  // Basic formatter to convert seeding markdown headers/bold text into clean html tags
  const renderFormattedContent = (content) => {
    if (!content) return null;
    return content.split('\n').map((para, idx) => {
      const trimmed = para.trim();
      if (trimmed.startsWith('###')) {
        return <h3 key={idx} className="text-lg font-bold text-neutral-800 mt-6 mb-2">{trimmed.replace('###', '')}</h3>;
      }
      if (trimmed.startsWith('##')) {
        return <h2 key={idx} className="text-xl font-bold text-neutral-800 mt-8 mb-3">{trimmed.replace('##', '')}</h2>;
      }
      if (trimmed.startsWith('-')) {
        return <li key={idx} className="ml-4 list-disc text-sm text-neutral-600 mb-1">{trimmed.replace('-', '').trim()}</li>;
      }
      if (trimmed.startsWith('1.')) {
        return <li key={idx} className="ml-4 list-decimal text-sm text-neutral-600 mb-1">{trimmed.replace('1.', '').trim()}</li>;
      }
      
      // Parse bold **text** helper
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-sm text-neutral-600 leading-relaxed mb-4">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-neutral-800">{part}</strong> : part)}
          </p>
        );
      }

      return trimmed ? (
        <p key={idx} className="text-sm text-neutral-600 leading-relaxed mb-4">{trimmed}</p>
      ) : <div key={idx} className="h-2" />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* 1. Article Detailed Reader View */}
      {selectedBlogId && blogDetail ? (
        <article className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedBlogId(null)}
            className="text-xs font-semibold text-neutral-500 hover:text-nursery-600 flex items-center space-x-1.5 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Care Blog</span>
          </button>

          {detailLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {blogDetail.tags?.map((tag) => (
                    <span key={tag} className="bg-neutral-100 border text-neutral-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-850 tracking-tight leading-tight">
                  {blogDetail.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-xs text-neutral-400 font-medium pt-1">
                  <span className="flex items-center">
                    <User className="h-4.5 w-4.5 mr-1 text-neutral-300" />
                    {blogDetail.authorName}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4.5 w-4.5 mr-1 text-neutral-300" />
                    {new Date(blogDetail.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4.5 w-4.5 mr-1 text-neutral-300" />
                    {blogDetail.readTime}
                  </span>
                </div>
              </div>

              {/* Main Banner */}
              <div className="bg-neutral-50 rounded-3xl overflow-hidden aspect-video border border-neutral-100 max-h-[400px]">
                <img
                  src={blogDetail.imageUrl}
                  alt={blogDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Parsed body content */}
              <div className="prose max-w-none pt-4 border-t border-neutral-100">
                {renderFormattedContent(blogDetail.content)}
              </div>
            </div>
          )}
        </article>
      ) : (
        /* 2. Blog Lists view */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-850">Botanical Care Guides</h1>
              <p className="text-sm text-neutral-500 mt-1">Free educational guides and tips to keep your house plants thriving.</p>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search care articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Quick Tag filter bubbles list */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider mr-2 shrink-0">Tags:</span>
            {tagsList.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all focus:outline-none ${
                  (tag === 'All' && !selectedTag) || selectedTag === tag
                    ? 'bg-nursery-600 text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* List display grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-3xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-100 rounded-3xl p-8 space-y-4">
              <div className="p-4 bg-neutral-50 rounded-full border border-neutral-100 w-fit mx-auto">
                <BookOpen className="h-10 w-10 text-neutral-450" />
              </div>
              <h3 className="text-lg font-bold text-neutral-850">No Care Guides Found</h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                We couldn't find any articles matching "{search}" or the selected tag category.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedTag('');
                  setSearchParams({});
                }}
                className="px-4 py-2 bg-nursery-600 text-white rounded-xl text-xs font-bold"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="group bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-all duration-350 flex flex-col cursor-pointer"
                  onClick={() => setSelectedBlogId(blog._id)}
                >
                  {/* Article illustration cover */}
                  <div className="relative overflow-hidden bg-neutral-50 pt-[56.25%] border-b">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>

                      <h3 className="font-extrabold text-neutral-800 text-base group-hover:text-nursery-600 transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-50 pt-4">
                      {/* Tags */}
                      <span className="inline-flex items-center text-[10px] font-bold text-nursery-600">
                        <Tag className="h-3 w-3 mr-1" />
                        {blog.tags[0] || 'Care Advice'}
                      </span>

                      <span className="text-xs font-bold text-neutral-800 group-hover:text-nursery-600 transition-colors flex items-center">
                        <span>Read Guide</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
