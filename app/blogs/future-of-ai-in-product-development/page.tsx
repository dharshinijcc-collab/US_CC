'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

// --- DATA SOURCE (JSON) ---
const articleContent = {
  title: "Future of AI in Product Development: Transforming Ideas into Reality",
  category: "Design",
  date: "March 12, 2025",
  readTime: "4 min read",
  author: "Ahmed Faraz",
  authorRole: "Product Development Expert",
  authorBio: "Ahmed Faraz is a seasoned expert in AI-driven product development with over a decade of experience in helping businesses leverage cutting-edge technologies to create innovative products that delight customers and drive growth.",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866",
  tags: ["#AI", "#Product Development"],
  uiLabels: {
    backBtn: "Back to Blogs",
    tocTitle: "Table of Contents",
    relatedTitle: "Related Articles",
    readMore: "Read More"
  },
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development. From conceptualization to launch, AI is changing how businesses approach innovation. It enables teams to move faster, make informed decisions, and predict outcomes with greater accuracy. This transformation is not just about speed, it is also about precision and personalization. AI empowers businesses to design products that are tailored to customer needs at an unprecedented scale. AI is setting new standards for quality, performance, and customer satisfaction. The future will belong to those who can harness this technology with vision and responsibility."
    },
    {
      id: "the-ai-revolution-in-product-development",
      title: "The AI Revolution in Product Development",
      content: "The AI revolution is driving change in every stage of product creation. By analyzing massive datasets, AI identifies patterns that humans may overlook. This helps in making design decisions that are both innovative and practical. It reduces repetitive tasks, allowing teams to focus on solving complex challenges. Market predictions become more reliable when powered by intelligent algorithms. Prototyping can now be done with greater speed and accuracy than traditional methods. Quality assurance is more efficient, as AI can detect flaws early in the process. This revolution is enabling faster product launches without compromising standards. It is not just improving processes, it is redefining the art of product creation."
    },
    {
      id: "key-areas-of-ai-impact",
      title: "Key Areas of AI Impact",
      content: "AI is transforming market research by providing deep insights from large datasets. Predictive analytics helps forecast demand and customer preferences with high precision. Design and prototyping benefit from AI-assisted creativity and rapid iterations. Automation ensures repetitive tasks are done faster and with fewer errors. Personalization engines create tailored product recommendations for users. Quality assurance systems identify defects early, reducing the cost of rework. Supply chain management becomes more efficient with AI-led optimization. AI tools also aid in sustainability by reducing waste and optimizing resources. Across industries, these impacts are raising the bar for innovation."
    },
    {
      id: "real-world-applications",
      title: "Real-World Applications",
      content: "In healthcare, AI supports diagnostics, treatment planning, and drug discovery. Manufacturing uses AI to predict maintenance needs and streamline production. Retail benefits from AI-driven inventory control and personalized promotions. Finance relies on AI for fraud detection, credit scoring, and portfolio management. Transportation is advancing with autonomous navigation and route optimization. Marketing is enhanced by data-driven targeting and campaign adjustments. Education uses AI for adaptive learning paths and student performance tracking. Energy companies improve efficiency with AI-based demand forecasting. Construction employs AI for project scheduling and risk prediction. Across sectors, these applications show AI's ability to solve complex challenges."
    },
    {
      id: "challenges-and-considerations",
      title: "Challenges and Considerations",
      content: "Data quality is essential for AI to deliver accurate results. Bias in algorithms can lead to unintended consequences if not addressed. Integrating AI into existing systems often requires major adjustments. Privacy regulations demand strong data protection measures. The shortage of skilled professionals limits AI's growth potential. Budget constraints make adoption harder for smaller organizations. The pace of AI evolution requires continuous learning and adaptation. Balancing innovation with responsibility will determine long-term success."
    },
    {
      id: "the-future-landscape",
      title: "The Future Landscape",
      content: "The next decade will see AI becoming more intuitive and context-aware. AI will assist in designing sustainable products with minimal waste. Collaboration between AI and human creativity will become seamless. Product testing will be almost entirely automated with real-time feedback. Decision-making will be faster and supported by accurate simulations. AI-powered platforms will unify design, development, and customer engagement. Augmented reality and AI will merge to create immersive product experiences. Global competition will accelerate as AI lowers entry barriers."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode is actively integrating AI into multiple phases of product development. It uses AI tools to conduct rapid market analysis and identify opportunities. The company leverages predictive analytics to guide product strategy. Prototyping is accelerated through AI-assisted design platforms. Quality assurance is enhanced with automated defect detection systems. Customer engagement is personalized through AI-driven insights. Supply chain processes are optimized to improve delivery timelines. Crestcode invests in training its team to adapt to AI advancements. The company also ensures ethical use of AI through strict guidelines. By embracing AI, Crestcode stays competitive and delivers superior products."
    },
    {
      id: "conclusion",
      title: "Conclusion",
      content: "AI is not just an emerging tool, it is a catalyst for a new era of product development. Its ability to merge creativity with precision is changing how products are conceived and delivered. Businesses that leverage AI effectively will gain significant competitive advantages. As AI continues to evolve, its role in innovation will only grow stronger. Organizations must invest in skills, systems, and strategies to fully harness AI. The future of product development is faster, smarter, and more customer-centric. AI is the bridge between bold ideas and successful market realities."
    }
  ],
  relatedArticles: [
    {
      title: "Building Successful MVP: A Complete Guide for Entrepreneurs",
      excerpt: "Every successful product begins with a strong foundation...",
      link: "/blogs/building-successful-mvp-guide"
    },
    {
      title: "Digital Transformation Strategies for Modern Businesses",
      excerpt: "Digital transformation is no longer an optional choice...",
      link: "/blogs/digital-transformation-strategies"
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>{articleContent.uiLabels.backBtn}</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
                {articleContent.uiLabels.tocTitle}
              </h3>
              <nav className="space-y-2">
                {articleContent.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">{articleContent.authorRole}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.authorBio}
                </p>
              </div>

              {/* Related Articles */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{articleContent.uiLabels.relatedTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articleContent.relatedArticles.map((article, index) => (
                    <div 
                      key={index}
                      onClick={() => router.push(article.link)}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <span className="text-sm font-medium">{articleContent.uiLabels.readMore}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}