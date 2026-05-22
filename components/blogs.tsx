'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

// --- DATA & CONFIGURATION ---
const BLOG_CONFIG = {
  header: {
    title: "Our",
    accent: "Insights",
    suffix: "& Blog.",
    description: "The future of digital product engineering and AI."
  },
  categories: ["All", "Technology", "Startups", "Design", "Development", "Business"],
  posts: [
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866", category: "Design", date: "March 12, 2025", readTime: "4 min read", title: "Future of AI in Product Development: Transforming Ideas into Reality", excerpt: "Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development...", author: "Ahmed Faraz", slug: "future-of-ai-in-product-development" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768", category: "Startups", date: "March 10, 2025", readTime: "3 min read", title: "Building Successful MVP: A Complete Guide for Entrepreneurs", excerpt: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product...", author: "Moin Khan", slug: "building-successful-mvp-guide" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768", category: "Development", date: "March 5, 2025", readTime: "3 min read", title: "Digital Transformation Strategies for Modern Businesses", excerpt: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to...", author: "Karthik Raja", slug: "digital-transformation-strategies" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768", category: "Business", date: "March 3, 2025", readTime: "3 min read", title: "User Experience Design: Creating Products People Love", excerpt: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable...", author: "Tulasi Divya", slug: "user-experience-design-products" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768", category: "Technology", date: "February 28, 2025", readTime: "3 min read", title: "Startup Funding: Navigating the Investment Landscape", excerpt: "Essential security measures every development team should implement when building cloud-native applications.", author: "Swathi", slug: "startup-funding-investment-landscape" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768", category: "Startups", date: "February 25, 2025", readTime: "3 min read", title: "Agile Development Methodologies for Tech Teams", excerpt: "Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability", author: "Vinitha", slug: "agile-development-methodologies" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720", category: "Technology", date: "March 1, 2025", readTime: "3 min read", title: "Cloud Computing: Transforming Business Infrastructure", excerpt: "Cloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible and cost...", author: "Satheesh", slug: "cloud-computing-business-infrastructure" },
    { image: "https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768", category: "Business", date: "February 28, 2025", readTime: "3 min read", title: "Data-Driven Decision Making in Modern Business", excerpt: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations", author: "Mythrehe", slug: "data-driven-decision-making" },
  ]
};

const COLORS = {
  heroBg: 'radial-gradient(at 0% 0%, #EEF2FF 0, transparent 50%), radial-gradient(at 100% 0%, #E0F2FE 0, transparent 50%), radial-gradient(at 50% 100%, #F8FAFC 0, transparent 50%), #F1F5F9',
  bgBase: '#F3F5F9',
  primary: '#4F46E5',
  textBlack: '#020617',
  textMuted: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
};

const FONT_PRIMARY = "'Plus Jakarta Sans', sans-serif";

export default function BlogsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredBlogs = BLOG_CONFIG.posts.filter(post => {
    const matchesFilter = activeFilter === "All" || post.category === activeFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: COLORS.bgBase, minHeight: '100vh', fontFamily: FONT_PRIMARY }}>

      {/* 1. HERO SECTION - Aligned with Careers/Vacancies */}
      <section style={{ 
        padding: 'clamp(80px, 12vw, 120px) 24px clamp(40px, 8vw, 80px)', 
        background: COLORS.heroBg, 
        position: 'relative', 
        overflow: 'hidden', 
        textAlign: 'center' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `linear-gradient(${COLORS.textMuted}11 1px, transparent 1px), linear-gradient(90deg, ${COLORS.textMuted}11 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        <div style={{ maxWidth: 'min(850px, 95%)', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            style={{ 
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', 
              fontWeight: 800, 
              color: COLORS.textBlack, 
              letterSpacing: '-0.03em', 
              margin: 'clamp(16px, 3vw, 24px) 0', 
              lineHeight: 1.1 
            }}>
            {BLOG_CONFIG.header.title} <span style={{ color: COLORS.primary }}>{BLOG_CONFIG.header.accent}</span> {BLOG_CONFIG.header.suffix}
          </motion.h1>
          
          <p style={{ 
            fontSize: 'clamp(16px, 2.5vw, 18px)', 
            color: COLORS.textMuted, 
            fontWeight: 500, 
            lineHeight: 1.6, 
            marginBottom: 'clamp(20px, 4vw, 32px)' 
          }}>
            {BLOG_CONFIG.header.description}
          </p>
        </div>
      </section>

      {/* 2. FILTER & SEARCH BAR */}
      <main style={{ maxWidth: '1200px', margin: 'clamp(-20px, -4vw, -40px) auto 80px auto', padding: '0 20px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', border: `1px solid ${COLORS.white}`, marginBottom: '36px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }} size={20} />
            <input 
              type="text" 
              placeholder="Search articles or authors..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '16px', border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white, fontSize: '14px', fontWeight: 500, outline: 'none' }} 
            />
          </div>
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
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: COLORS.primary, padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: COLORS.white, textTransform: 'uppercase' }}>
                    {post.category}
                  </div>
                </div>

                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>
                      <Calendar size={12} color={COLORS.primary} /> {post.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>
                      <Clock size={12} color={COLORS.primary} /> {post.readTime}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.textBlack, lineHeight: 1.3, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, marginBottom: '20px', fontWeight: 500 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: `${COLORS.primary}12`, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                        {post.author[0]}
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}