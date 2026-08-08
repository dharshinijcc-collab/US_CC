'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import EditableText from "@/components/pages/admin/EditableText";
import { useAdmin } from "@/context/AdminContext";
import { useContent } from "@/context/ContentContext";
import { STATIC_BLOG_POSTS } from "@/lib/blog_data";

// --- DATA & CONFIGURATION ---
const BLOG_CONFIG = {
  header: {
    title: "Our",
    accent: "Insights",
    suffix: "& Blog.",
    description: "The future of digital product engineering and AI."
  },
  categories: ["All", "Technology", "Startups", "Design", "Development", "Business"],
  posts: [] as any[]
};

const COLORS = {
  heroBg: '#FFFFFF',
  bgBase: '#F3F5F9',
  primary: '#005AE2',
  textBlack: '#020617',
  textMuted: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

const FONT_PRIMARY = "'Inter', sans-serif";
const FONT_HEADING = "'Manrope', sans-serif";

export default function BlogsPage({ showHero = true }: { showHero?: boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAdminMode } = useAdmin();
  const { content } = useContent();

  useEffect(() => {
    setPosts(STATIC_BLOG_POSTS);
    setLoading(false);
  }, []);

  // Read saved values from ContentContext (set by admin edits), fall back to hardcoded defaults
  const heroBadge   = content?.blog?.hero?.badge       || "Our Blog";
  const heroTitle   = content?.blog?.hero?.title       || BLOG_CONFIG.header.title;
  const heroAccent  = content?.blog?.hero?.accent      || BLOG_CONFIG.header.accent;
  const heroSuffix  = content?.blog?.hero?.suffix      || BLOG_CONFIG.header.suffix;
  const heroDesc    = content?.blog?.hero?.description || BLOG_CONFIG.header.description;

  const filteredBlogs = posts.filter(post => {
    const matchesFilter = activeFilter === "All" || post.category === activeFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: showHero ? '#FFFFFF' : 'transparent', minHeight: showHero ? '100vh' : 'auto', fontFamily: FONT_PRIMARY }}>

      {/* 1. HERO SECTION - Styled like Studio page hero */}
      {showHero && (
        <section className="hero-section" style={{
          backgroundColor: '#F1F5F9',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '128px 0 48px 0',
        }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient glow orbs - Blue only, matching studio page */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: 'min(850px, 95%)', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-block',
                backgroundColor: '#F0F5FF',
                color: '#005AE2',
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '24px',
                marginTop: '0px',
                fontFamily: FONT_HEADING
              }}
            >
              <EditableText
                contentKey="blog.hero.badge"
                value={heroBadge}
                as="span"
                style={{ fontFamily: FONT_HEADING }}
              />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: FONT_HEADING,
                fontSize: '52px',
                fontWeight: 800,
                color: COLORS.textBlack,
                letterSpacing: '-0.03em',
                margin: '0 auto clamp(16px, 3vw, 24px)',
                lineHeight: 1.15,
                textAlign: 'center'
              }}>
              <EditableText contentKey="blog.hero.title" value={heroTitle} as="span" />{' '}
              <span style={{ color: COLORS.primary }}>
                <EditableText contentKey="blog.hero.accent" value={heroAccent} as="span" style={{ color: COLORS.primary }} />
              </span>{' '}
              <EditableText contentKey="blog.hero.suffix" value={heroSuffix} as="span" />
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ 
                fontFamily: FONT_PRIMARY,
                fontSize: 'clamp(0.95rem, 2vw, 1.125rem)', 
                color: COLORS.textMuted, 
                fontWeight: 500, 
                lineHeight: 1.7, 
                maxWidth: '520px',
                margin: '0 auto 40px',
                textAlign: 'center'
              }}>
              <EditableText
                contentKey="blog.hero.description"
                value={heroDesc}
                as="span"
                style={{ color: COLORS.textMuted }}
              />
            </motion.p>
          </div>
        </section>
      )}

      {/* 2. FILTER & SEARCH BAR */}
      <main style={{ maxWidth: '1200px', margin: showHero ? '48px auto 80px auto' : '10px auto 80px auto', padding: '0 20px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', border: `1px solid ${COLORS.white}`, marginBottom: '36px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          {/* Left: Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BLOG_CONFIG.categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '10px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', border: 'none',
                  backgroundColor: activeFilter === cat ? COLORS.primary : COLORS.white, 
                  color: activeFilter === cat ? COLORS.white : COLORS.textMuted,
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Search Input Box */}
          <div style={{ position: 'relative', flex: '0 1 320px', marginLeft: 'auto' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, zIndex: 5, pointerEvents: 'none' }} size={18} />
            <input 
              type="text" 
              className="blog-search-input"
              placeholder="Search articles or authors..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 18px 12px 46px', borderRadius: '100px', border: `1.5px solid ${COLORS.border}`, backgroundColor: COLORS.white, fontSize: '14px', fontWeight: 500, outline: 'none' }} 
            />
          </div>
        </div>

        {/* 3. BLOG GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((post) => (
              <motion.article 
                key={post.slug} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -10 }}
                style={{ backgroundColor: COLORS.white, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${COLORS.border}`, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => router.push(`/blogs/${post.slug}`)}
              >
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img src={post.image_url || post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: COLORS.primary, padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: COLORS.white, textTransform: 'uppercase' }}>
                    {post.category}
                  </div>
                </div>

                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>
                      <Calendar size={12} color={COLORS.primary} /> {
                        post.published_at 
                          ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : post.date || 'March 1, 2025'
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>
                      <Clock size={12} color={COLORS.primary} /> {post.read_time || post.readTime}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.textBlack, lineHeight: 1.3, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '20px', fontWeight: 500 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: `${COLORS.primary}12`, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                        {post.author ? post.author[0] : 'U'}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: COLORS.textBlack }}>{post.author}</span>
                    </div>

                    <div style={{ color: COLORS.primary, fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Read More <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
