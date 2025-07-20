'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n/language-context';
import { FiCalendar, FiTag, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blogData';

interface BlogPost {
  id: string;
  title: {
    en: string;
    de: string;
  };
  content: {
    en: string;
    de: string;
  };
  date: string;
  author: string;
  authorImage: string;
  tags: string[];
  image: string;
  category: string;
  slug: string;
}

const BlogPostPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the imported functions instead of accessing blogPosts directly
    const fetchBlogPost = () => {
      setLoading(true);
      setTimeout(() => {
        const post = getBlogPostBySlug(slug);
        
        if (post) {
          // Find related posts using the imported function
          const related = getRelatedPosts(post.category, post.id);
          
          setBlogPost(post);
          setRelatedPosts(related);
        }
        
        setLoading(false);
      }, 300);
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--taupe)]">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--taupe)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('blog.postNotFound') || 'Post not found'}</h1>
          <p className="text-gray-600 mb-8">{t('blog.postNotFoundDesc') || 'The blog post you are looking for does not exist or has been removed.'}</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[var(--sage-green)] hover:opacity-90"
          >
            <FiArrowLeft className="mr-2" /> {t('blog.backToBlog') || 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const postTitle = blogPost.title[currentLanguage as keyof typeof blogPost.title] || blogPost.title.en;
  const postContent = blogPost.content[currentLanguage as keyof typeof blogPost.content] || blogPost.content.en;
  
  return (
    <div className="min-h-screen bg-[var(--taupe)]">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={blogPost.image}
          alt={postTitle}
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white mb-4 hover:text-[var(--sage)]"
            >
              <FiArrowLeft className="mr-2" /> {t('blog.backToBlog') || 'Back to Blog'}
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {postTitle}
            </h1>
            <div className="flex flex-wrap items-center text-white gap-4">
              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                  <Image
                    src={blogPost.authorImage}
                    alt={blogPost.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>{formatDate(blogPost.date)}</span>
              </div>
              <div className="flex items-center">
                <FiTag className="mr-2" />
                <span>{t(`blog.categories.${blogPost.category}`) || blogPost.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Article Content */}
        <article className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: postContent }} />
        </article>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-[var(--sage-green)] mb-4">{t('blog.tags') || 'Tags'}</h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="inline-block bg-[var(--taupe)] px-3 py-1 rounded-full text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-gray-200 bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-[var(--sage-green)] mb-4">{t('blog.sharePost') || 'Share this post'}</h3>
          <div className="flex gap-4">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:opacity-90">
              <FiTwitter />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4267B2] text-white hover:opacity-90">
              <FiFacebook />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5] text-white hover:opacity-90">
              <FiLinkedin />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--cognac)] text-white hover:opacity-90">
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mb-8">{t('blog.relatedPosts') || 'Related Posts'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(post => {
                const relatedTitle = post.title[currentLanguage as keyof typeof post.title] || post.title.en;
                return (
                  <article key={post.id} className="bg-[var(--taupe)] border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <Link href={`/blog/${post.slug}`} className="block group">
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image}
                          alt={relatedTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FiCalendar className="mr-1" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-[var(--sage-green)]">
                          {relatedTitle}
                        </h3>
                        <span className="text-sm text-[var(--sage-green)] flex items-center mt-4">
                          {t('blog.readMore') || 'Read more'} <FiArrowRight className="ml-1" />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage; 