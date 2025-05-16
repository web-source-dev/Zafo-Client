'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import BlogSection from '@/components/sections/blog/BlogSection';

const BlogPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Header with background image */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Blog header background"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 bg-gradient-to-t from-black/80 to-transparent py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-100">
              {t('blog.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Blog Section with posts and sidebar */}
      <BlogSection />
    </div>
  );
};

export default BlogPage; 