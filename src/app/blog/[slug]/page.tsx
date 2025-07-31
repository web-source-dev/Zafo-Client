'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n/language-context';
import { FiCalendar, FiTag, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blogData';
import LoadingScreen from '@/components/ui/LoadingScreen';

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
    return <LoadingScreen />;
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--sage)] via-[var(--taupe)] to-[var(--sage)]">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={blogPost.image}
          alt={postTitle}
          fill
          className="object-cover brightness-[0.6] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors duration-200 group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" /> 
              {t('blog.backToBlog') || 'Back to Blog'}
            </Link>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {postTitle}
              </h1>
              <div className="flex flex-wrap items-center text-white/90 gap-6 mb-8">
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 ring-2 ring-white/20">
                    <Image
                      src={blogPost.authorImage}
                      alt={blogPost.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-medium">{blogPost.author}</span>
                    <div className="text-sm text-white/70">Author</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-[var(--sage)]" />
                  <span>{formatDate(blogPost.date)}</span>
                </div>
                <div className="flex items-center">
                  <FiTag className="mr-2 text-[var(--sage)]" />
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {t(`blog.categories.${blogPost.category}`) || blogPost.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
            <div 
              className="prose-headings:text-[var(--sage-green)] prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[var(--sage-green)] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-[var(--sage-green)] prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: postContent }} 
            />

          {/* Share */}
          <div className="mt-8 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-[var(--sage-green)] mb-6 flex items-center">
              <FiShare2 className="mr-2" />
              {t('blog.sharePost') || 'Share this post'}
            </h3>
            <div className="flex gap-4">
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl">
                <FiTwitter className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4267B2] text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl">
                <FiFacebook className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077B5] text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl">
                <FiLinkedin className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl">
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gradient-to-br from-[var(--sage)] via-[var(--taupe)] to-[var(--sage)] py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--sage-green)] mb-4">
                  {t('blog.relatedPosts') || 'Related Posts'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more insights and tips to enhance your event planning journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(post => {
                  const relatedTitle = post.title[currentLanguage as keyof typeof post.title] || post.title.en;
                  return (
                    <article key={post.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                      <Link href={`/blog/${post.slug}`} className="block group">
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={post.image}
                            alt={relatedTitle}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-8">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <FiCalendar className="mr-2 text-[var(--sage-green)]" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[var(--sage-green)] transition-colors duration-200 line-clamp-2">
                            {relatedTitle}
                          </h3>
                          <span className="inline-flex items-center text-[var(--sage-green)] font-medium group-hover:translate-x-1 transition-transform duration-200">
                            {t('blog.readMore') || 'Read more'} <FiArrowRight className="ml-2" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage; 