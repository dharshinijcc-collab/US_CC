'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Building Successful MVP: A Complete Guide for Entrepreneurs",
  category: "Startups",
  date: "March 10, 2025",
  readTime: "3 min read",
  author: "Moin Khan",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768",
  tags: ["#MVP", "#Entreprenuership"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product or MVP. An MVP is not the final version of your product, but rather the simplest form that can be launched to gather real user feedback. It allows you to test assumptions, refine ideas, and avoid spending months or years building features no one needs. By focusing on essentials, you can validate demand quickly and adapt to market needs without wasting resources. This approach has become the preferred method for startups aiming to enter competitive markets faster."
    },
    {
      id: "understanding-the-mvp-concept",
      title: "Understanding the MVP Concept",
      content: "The MVP concept revolves around building a basic version of your product that solves a core problem for your target audience. Instead of waiting until every feature is complete, you release early to measure user reactions. The goal is learning, not perfection. Through actual usage data and customer feedback, you understand what works and what needs improvement. This process helps entrepreneurs reduce risk and increase the chances of building something customers truly want."
    },
    {
      id: "defining-your-core-value-proposition",
      title: "Defining Your Core Value Proposition",
      content: "Before creating an MVP, identify the single most important value your product will deliver. Your value proposition should be clear, specific, and directly connected to a customer pain point. It is essential to avoid adding too many features at this stage. Every element should support the main purpose of your product. This clarity keeps development focused and ensures your MVP is aligned with market needs."
    },
    {
      id: "mvp-development-strategy",
      title: "MVP Development Strategy",
      content: "A strong strategy begins with research into your target audience and their challenges. Outline the core functionality your product needs to be usable and valuable from day one. Choose simple and cost-effective tools to build your MVP. Avoid overcomplicating the process by chasing advanced features too soon. Involve potential users early in the development process to ensure relevance."
    },
    {
      id: "validation-and-metrics",
      title: "Validation and Metrics",
      content: "Once your MVP is live, measure how real users are interacting with it. Track sign-ups, active usage, and engagement time to gauge interest. Customer feedback is your most valuable resource for improvement. Use surveys, interviews, and behavioral data to identify strengths and weaknesses. If results align with expectations, you can proceed to expand features with confidence."
    },
    {
      id: "common-mvp-mistakes-to-avoid",
      title: "Common MVP Mistakes to Avoid",
      content: "Adding too many features in the first version dilutes your core value. Ignoring user feedback or delaying adjustments can lead to wasted resources. Overestimating demand without validation often results in poor adoption. Avoid building in isolation without engaging your audience. The MVP is meant to evolve, so flexibility is key."
    },
    {
      id: "iteration-and-growth",
      title: "Iteration and Growth",
      content: "Iteration is the process of improving your MVP based on what you learn from real usage. Each cycle should bring the product closer to what your audience truly needs. Growth comes when your MVP gains traction and positive word-of-mouth. At this stage, adding features and scaling operations can be done with greater confidence."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode embraces the MVP approach to deliver innovative solutions faster. The team conducts market research to pinpoint the most impactful features. They build lean prototypes and release them to select user groups for testing. User insights are collected, analyzed, and applied to refine the product. This method ensures each product meets real needs before a full-scale launch."
    },
    {
      id: "conclusion",
      title: "Conclusion",
      content: "Building a successful MVP is about clarity, focus, and adaptability. It allows entrepreneurs to test ideas with minimal risk and maximum learning. By understanding the market and iterating based on real feedback, you create products that resonate. Those who master the MVP process position themselves for sustainable growth. The journey from concept to a thriving business begins with taking that first lean step."
    }
  ]
};

export default function BlogArticlePage() {
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const sections = articleContent.sections;
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {articleContent.category}
            </span>
            {articleContent.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {articleContent.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{articleContent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{articleContent.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{articleContent.author}</span>
            </div>
          </div>

          <img
            src={articleContent.image}
            alt={articleContent.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {articleContent.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-green-50 text-green-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400">{index + 1}.</span>
                      {section.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              {articleContent.sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-8 scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {section.content}
                    </p>
                  </div>
                </section>
              ))}

              {/* Author Section */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Startup Strategy Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a seasoned startup strategist with extensive experience helping entrepreneurs build successful MVPs and scale their businesses. With a deep understanding of lean methodologies and market validation, they guide startups through the critical early stages of product development.
                </p>
              </div>

              {/* Related Articles */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Future of AI in Product Development</h4>
                    <p className="text-sm text-gray-600 mb-3">Artificial Intelligence is no longer a distant concept...</p>
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Digital Transformation Strategies for Modern Businesses</h4>
                    <p className="text-sm text-gray-600 mb-3">Digital transformation is no longer an optional choice...</p>
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
