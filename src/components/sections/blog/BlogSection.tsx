'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n/language-context';
import { FiSearch, FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import { getBlogPosts } from '@/lib/blogData';

// Define interface for blog post data
interface BlogPost {
  id: string;
  slug: string;
  title: {
    en: string;
    de?: string;
    [key: string]: string | undefined;
  };
  content: {
    en: string;
    de?: string;
    [key: string]: string | undefined;
  };
  date: string;
  author: string;
  category: string;
  image: string;
  tags?: string[];
}

const BlogSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch blog posts
    const fetchBlogPosts = () => {
      setLoading(true);
      try {
        // Get blog posts from the same function used by the dynamic route
        const posts = getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const categories = [
    { id: 'all', name: t('blog.categories.all') },
    { id: 'tips', name: t('blog.categories.tips') },
    { id: 'guides', name: t('blog.categories.guides') },
    { id: 'industry', name: t('blog.categories.industry') },
    { id: 'technology', name: t('blog.categories.technology') },
  ];

  // Filter posts based on search query and active category
  const filteredPosts = blogPosts.filter(post => {
    const postTitle = post.title[currentLanguage] || post.title.en;
    const postContent = post.content[currentLanguage] || post.content.en;
    
    const matchesSearch = searchQuery 
      ? postTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
        postContent.substring(0, 300).toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = activeCategory && activeCategory !== 'all'
      ? post.category === activeCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Create excerpt from HTML content
  const createExcerpt = (htmlContent: string): string => {
    // Remove HTML tags and get plain text
    const plainText = htmlContent.replace(/<[^>]+>/g, '');
    // Return first 150 characters as excerpt
    return plainText.substring(0, 150) + '...';
  };

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--taupe)]">
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Search Bar */}
          <div className="mb-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)] text-gray-900 bg-white"
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Featured Post - First Post */}
          {filteredPosts.length > 0 && !searchQuery && !activeCategory && (
            <div className="mb-12">
              <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                <Link href={`/blog/${filteredPosts[0].slug}`} className="block">
                  <div className="relative h-[450px] w-full">
                    <Image
                      src={filteredPosts[0].image}
                      alt={filteredPosts[0].title[currentLanguage] || filteredPosts[0].title.en}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-8 text-white">
                        <div className="flex items-center text-sm mb-3">
                          <FiCalendar className="mr-2" />
                          <span>{formatDate(filteredPosts[0].date)}</span>
                          <span className="mx-2">•</span>
                          <FiUser className="mr-2" />
                          <span>{filteredPosts[0].author}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                          {filteredPosts[0].title[currentLanguage] || filteredPosts[0].title.en}
                        </h2>
                        <p className="text-gray-200 mb-4">
                          {createExcerpt(filteredPosts[0].content[currentLanguage] || filteredPosts[0].content.en)}
                        </p>
                        <span className="inline-flex items-center text-[var(--sage)]">
                          {t('blog.readMore')} <FiArrowRight className="ml-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skip the first post if we're showing it as featured */}
              {(searchQuery || activeCategory ? filteredPosts : filteredPosts.slice(1)).map((post) => {
                const postTitle = post.title[currentLanguage] || post.title.en;
                const postContent = post.content[currentLanguage] || post.content.en;
                const excerpt = createExcerpt(postContent);
                
                return (
                  <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                    <Link href={`/blog/${post.slug}`} className="block group">
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image}
                          alt={postTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FiCalendar className="mr-1" />
                          <span>{formatDate(post.date)}</span>
                          <span className="mx-2">•</span>
                          <FiUser className="mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-[var(--sage-green)]">
                          {postTitle}
                        </h3>
                        <p className="text-gray-600 mb-4">{excerpt}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FiTag className="mr-1 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {t(`blog.categories.${post.category}`)}
                            </span>
                          </div>
                          <span className="text-sm text-[var(--sage-green)] group-hover:underline flex items-center">
                            {t('blog.readMore')} <FiArrowRight className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <p className="text-xl text-gray-600">{t('blog.noResults')}</p>
              <p className="mt-2 text-gray-500">{t('blog.tryDifferentSearch')}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4 mt-10 md:mt-0">
          {/* Categories */}
          <div className="bg-white p-6 rounded-lg mb-8 sticky top-24 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--sage-green)]">{t('blog.categoriesTitle')}</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeCategory === category.id
                      ? 'bg-[var(--sage-green)] text-white'
                      : 'text-gray-700 hover:bg-[var(--taupe)]'
                  }`}
                  onClick={() => setActiveCategory(category.id === 'all' ? null : category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white p-6 rounded-lg sticky top-80 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--sage-green)]">{t('blog.recentPostsTitle')}</h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => {
                const postTitle = post.title[currentLanguage] || post.title.en;
                return (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={postTitle}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-[var(--sage-green)]">
                        {postTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 