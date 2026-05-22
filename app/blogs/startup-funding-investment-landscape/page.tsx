'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Startup Funding: Navigating the Investment Landscape",
  category: "Technology",
  date: "February 28, 2025",
  readTime: "3 min read",
  author: "Swathi",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768",
  tags: ["#Startup Funding", "#Investment"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Securing funding is one of the most critical steps for any startup aiming to grow and succeed. It provides the resources needed to develop products, hire talent, and enter the market effectively. Navigating the investment landscape requires an understanding of funding options and strategic planning. Entrepreneurs must be ready to present their vision in a compelling and credible way. With the right approach, funding can become the launchpad for long-term success."
    },
    {
      id: "understanding-funding-stages",
      title: "Understanding Funding Stages",
      content: "Funding typically begins with the pre-seed stage, where personal savings and support from friends or family are common. The seed stage follows, allowing startups to validate their product and attract early investors. Series A, B, and C rounds enable scaling, expanding operations, and entering new markets. Later stages often prepare a business for acquisition or public listing. Understanding each stage helps founders choose the right time to seek capital."
    },
    {
      id: "types-of-funding-sources",
      title: "Types of Funding Sources",
      content: "Venture capital firms provide significant capital in exchange for equity and growth potential. Angel investors are individuals who offer funding along with mentorship. Crowdfunding platforms allow startups to raise money from a broad audience. Bank loans and grants can also provide financial support without equity dilution. Selecting the right source depends on the business model, growth plans, and control preferences."
    },
    {
      id: "preparing-for-investment",
      title: "Preparing for Investment",
      content: "A strong business plan is essential to communicate vision, goals, and strategies. Financial projections should be realistic and backed by research. A compelling pitch deck highlights the problem, solution, market size, and competitive advantage. Founders should also ensure their legal and operational structures are investment-ready. Preparation builds confidence for both the entrepreneur and potential investors."
    },
    {
      id: "the-fundraising-process",
      title: "The Fundraising Process",
      content: "The process begins with identifying and approaching suitable investors. Initial meetings aim to generate interest and build trust. Due diligence follows, where investors evaluate business potential and risks. Negotiations finalize terms before funding is released. Ongoing communication keeps investors engaged after the deal closes."
    },
    {
      id: "common-fundraising-mistakes",
      title: "Common Fundraising Mistakes",
      content: "Overestimating valuations can deter potential backers. Failing to research investor preferences often results in mismatched expectations. Neglecting to track key performance metrics reduces credibility. Rushing the process without proper preparation can lead to poor terms. Avoiding these mistakes increases the likelihood of securing favorable deals."
    },
    {
      id: "alternative-funding-strategies",
      title: "Alternative Funding Strategies",
      content: "Bootstrapping allows founders to maintain full control by using personal resources. Revenue-based financing ties repayments to a percentage of monthly income. Partnerships and strategic alliances can bring in both capital and expertise. Government programs and innovation grants provide non-dilutive funding. These alternatives can complement traditional fundraising or replace it entirely."
    },
    {
      id: "building-investor-relationships",
      title: "Building Investor Relationships",
      content: "Strong relationships go beyond a single funding round. Consistent updates keep investors informed and confident in the business. Engaging investors for advice builds trust and creates long-term allies. Networking within investor communities can open future opportunities. Treating investors as partners encourages ongoing support and advocacy."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode actively explores innovative funding models to support its projects. The company uses detailed market analysis to align with the right investors. It leverages technology to prepare data-rich presentations for transparency. Investor relations are maintained through regular performance reports and strategy sessions. This approach ensures sustainable growth while preserving strong investor confidence."
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
      <div className="bg-gradient-to-br from-teal-50 to-cyan-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
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
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                        ? 'bg-teal-50 text-teal-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Funding Strategy Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a seasoned funding strategist with deep expertise in helping startups navigate the complex investment landscape. With experience across multiple funding rounds and investment types, they guide entrepreneurs in securing the right capital at the right time for sustainable growth.
                </p>
              </div>

              {/* Related Articles */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Building Successful MVP: A Complete Guide for Entrepreneurs</h4>
                    <p className="text-sm text-gray-600 mb-3">Every successful product begins with a strong foundation...</p>
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Agile Development Methodologies for Tech Teams</h4>
                    <p className="text-sm text-gray-600 mb-3">Agile development has transformed the way tech teams plan...</p>
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
