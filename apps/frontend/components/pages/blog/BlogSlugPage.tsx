'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Clock, Calendar, User, BookOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { STATIC_BLOG_POSTS } from '@/lib/blog_data';

export default function DynamicBlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const found = STATIC_BLOG_POSTS.find(p => p.slug === slug);
    setBlog(found || null);
    setLoading(false);
  }, [slug]);

  // Handle browser back/forward button clicks correctly
  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split('/');
      const currentSlug = pathParts[pathParts.length - 1];
      if (currentSlug) {
        const found = STATIC_BLOG_POSTS.find(p => p.slug === currentSlug);
        if (found) {
          setBlog(found);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleArticleChange = (targetPost: any) => {
    // Instantly transition local state
    setBlog(targetPost);
    // Update browser URL silently without Next.js full routing reload
    window.history.pushState(null, '', `/blogs/${targetPost.slug}`);
    // Smooth scroll to top of the viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #005AE2', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p style={{ fontWeight: 600 }}>Loading article details...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'sans-serif', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <BookOpen size={48} style={{ color: '#64748B', marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Article Not Found</h2>
          <p style={{ color: '#64748B', marginBottom: 24 }}>We couldn't find the article you are looking for. It may have been unpublished or removed.</p>
          <button onClick={() => router.push('/blogs')} style={{ background: '#005AE2', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Back to Blogs</button>
        </div>
      </div>
    );
  }

  const paragraphs = blog.content ? blog.content.split('\n\n').filter(Boolean) : [];

  return (
    <>
      <Header currentPage="blogs" />
      <div style={{ backgroundColor: '#F8FAFC', color: '#0F172A', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #EEF2F6 0%, #E2E8F0 100%)', padding: '170px 24px 60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => router.push('/blogs')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748B', fontWeight: 600, cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
          >
            <ChevronLeft size={18} />
            <span>Back to Blogs</span>
          </button>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ background: '#E0EFFF', color: '#005AE2', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
              {blog.category}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            {blog.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: '#64748B', fontSize: '14px', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} />
              <span>{new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} />
              <span>{blog.read_time || '3 min'} read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              <span>{blog.author_details?.name || blog.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for responsive 2-column layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 992px) {
          .blog-layout-grid {
            display: grid !important;
            grid-template-columns: 280px 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 991px) {
          .blog-layout-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 40px !important;
          }
          .blog-sidebar {
            position: static !important;
            margin-bottom: 20px !important;
          }
        }
      ` }} />

      {/* Main Layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div className="blog-layout-grid" style={{ display: 'grid' }}>
          
          {/* Left Sidebar navigation */}
          <aside className="blog-sidebar" style={{ position: 'sticky', top: '120px', alignSelf: 'start' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Manrope', sans-serif" }}>
              All Articles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {STATIC_BLOG_POSTS.map(post => {
                const isActive = post.slug === blog.slug;
                return (
                  <button
                    key={post.slug}
                    onClick={() => handleArticleChange(post)}
                    style={{
                      textAlign: 'left',
                      background: isActive ? '#E0EFFF' : 'transparent',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: isActive ? '#005AE2' : '#475569',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 500,
                      lineHeight: 1.4,
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid #005AE2' : '3px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#005AE2';
                        e.currentTarget.style.background = 'rgba(0, 90, 226, 0.03)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {post.title}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Content */}
          <main style={{ maxWidth: '800px', width: '100%' }}>
            <article style={{ fontSize: '17px', lineHeight: 1.8, color: '#334155' }}>
              {paragraphs.map((p: string, idx: number) => {
                if (p.startsWith('# ')) {
                  return <h1 key={idx} style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginTop: '32px', marginBottom: '16px' }}>{p.replace('# ', '')}</h1>;
                }
                if (p.startsWith('## ')) {
                  return <h2 key={idx} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '28px', marginBottom: '14px' }}>{p.replace('## ', '')}</h2>;
                }
                if (p.startsWith('### ')) {
                  return <h3 key={idx} style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '24px', marginBottom: '12px' }}>{p.replace('### ', '')}</h3>;
                }
                return <p key={idx} style={{ marginBottom: '24px' }}>{p}</p>;
              })}
            </article>

            {/* Relational Author Card */}
            {blog.author_details && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '60px', padding: '24px', background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{blog.author_details.name}</h4>
                  <p style={{ margin: '2px 0 6px', fontSize: '13px', color: '#005AE2', fontWeight: 700, textTransform: 'uppercase' }}>{blog.author_details.role}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>{blog.author_details.bio}</p>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
