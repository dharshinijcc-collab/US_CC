'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Clock, Calendar, User, BookOpen } from 'lucide-react';


export default function DynamicBlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/blogs?slug=${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setBlog(json.payload || null);
        }
      })
      .catch(err => {
        console.error('Error fetching blog details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

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

  // Auto parsing paragraphs
  const paragraphs = blog.content ? blog.content.split('\n\n').filter(Boolean) : [];

  return (
    <div style={{ backgroundColor: '#F8FAFC', color: '#0F172A', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #EEF2F6 0%, #E2E8F0 100%)', padding: '120px 24px 60px' }}>
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

      {/* Main Layout */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', marginBottom: '40px' }}
          />
        )}

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
            {blog.author_details.avatar_url && (
              <img
                src={blog.author_details.avatar_url}
                alt={blog.author_details.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{blog.author_details.name}</h4>
              <p style={{ margin: '2px 0 6px', fontSize: '13px', color: '#005AE2', fontWeight: 700, textTransform: 'uppercase' }}>{blog.author_details.role}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>{blog.author_details.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
