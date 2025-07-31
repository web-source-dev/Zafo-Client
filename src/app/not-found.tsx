'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/language-context';
import Image from 'next/image';

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--sage)] via-[var(--taupe)] to-[var(--sage)] px-4">
            <div className="max-w-2xl mx-auto text-center animate-fadeIn">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-[var(--sage-green)] opacity-20 select-none">
                        404
                    </h1>
                </div>

                {/* Main Content */}
                <div className="relative z-10 -mt-20">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-[var(--sage-green)] rounded-full flex items-center justify-center shadow-lg hover-lift">
                        <Image src="/404.gif" alt="404" className='w-full h-full object-cover rounded-full border-4 border-[var(--sage)]' width={96} height={96} />

                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-4">
                        {t('notFound.title')}
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        {t('notFound.description')}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto transition-standard hover:shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                {t('notFound.goHome')}
                            </Button>
                        </Link>

                        <Link href="/events">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto transition-standard hover:shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {t('notFound.browseEvents')}
                            </Button>
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="border-t border-gray-200 pt-8">
                        <p className="text-sm text-gray-500 mb-4">{t('notFound.needHelp')}</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link
                                href="/contact"
                                className="text-[var(--sage-green)] hover:text-[var(--cognac)] transition-colors duration-200 hover:underline"
                            >
                                {t('notFound.contactUs')}
                            </Link>
                            <Link
                                href="/help"
                                className="text-[var(--sage-green)] hover:text-[var(--cognac)] transition-colors duration-200 hover:underline"
                            >
                                {t('notFound.helpCenter')}
                            </Link>
                            <Link
                                href="/faq"
                                className="text-[var(--sage-green)] hover:text-[var(--cognac)] transition-colors duration-200 hover:underline"
                            >
                                {t('notFound.faq')}
                            </Link>
                            <Link
                                href="/about"
                                className="text-[var(--sage-green)] hover:text-[var(--cognac)] transition-colors duration-200 hover:underline"
                            >
                                {t('notFound.aboutUs')}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--sage-green)] opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--cognac)] opacity-10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[var(--sage)] opacity-20 rounded-full blur-lg"></div>
            </div>
        </div>
    );
} 