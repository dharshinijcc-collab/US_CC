'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Digital Transformation Strategies for Modern Businesses",
  category: "Development",
  date: "March 5, 2025",
  readTime: "3 min read",
  author: "Karthik Raja",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768",
  tags: ["#Digital Transformation", "#Business Strategy"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to remain competitive and relevant in an increasingly connected world. Through the use of advanced technologies, organizations can streamline operations, improve customer experiences, and unlock new growth opportunities. This shift impacts not only tools and processes but also company culture and decision-making approaches. Businesses that embrace digital transformation early position themselves for greater resilience in changing markets."
    },
    {
      id: "understanding-digital-transformation",
      title: "Understanding Digital Transformation",
      content: "Digital transformation is the process of integrating digital technologies into all areas of a business. It changes how companies operate, deliver value, and interact with customers. It is not just about adopting new tools but also rethinking workflows, structures, and goals. This transformation often requires leadership commitment and a clear vision of desired outcomes. When done well, it can lead to higher efficiency, stronger market presence, and increased customer loyalty."
    },
    {
      id: "key-pillars-of-digital-transformation",
      title: "Key Pillars of Digital Transformation",
      content: "The first pillar is customer experience, ensuring every interaction is personalized and seamless. The second pillar is operational agility, which allows businesses to respond quickly to change. The third pillar is culture and leadership, promoting a mindset that embraces innovation. The fourth pillar is technology integration, connecting systems for better data flow and decision-making. All these pillars must work together to create lasting transformation and sustainable growth."
    },
    {
      id: "strategic-approaches-to-implementation",
      title: "Strategic Approaches to Implementation",
      content: "Successful transformation begins with a clear assessment of current capabilities and gaps. Businesses should define measurable objectives and create a phased roadmap. Employee involvement is critical, as change must be understood and embraced at all levels. Testing solutions in small-scale environments allows for adjustments before wider adoption. Partnerships with technology providers and consultants can also accelerate implementation."
    },
    {
      id: "technology-enablers",
      title: "Technology Enablers",
      content: "Cloud computing enables flexible access to data and applications from anywhere. Artificial intelligence provides predictive insights and automation for better decision-making. Data analytics allows companies to identify trends and optimize strategies. Internet of Things devices improve monitoring, efficiency, and asset management. Cybersecurity solutions protect digital assets and maintain customer trust in an online environment."
    },
    {
      id: "measuring-success",
      title: "Measuring Success",
      content: "The success of digital transformation can be tracked through performance indicators. Metrics such as revenue growth, customer satisfaction, and operational efficiency provide insights. Employee engagement levels and innovation adoption rates are equally important. Regular reviews ensure strategies remain aligned with market demands. Continuous improvement keeps the transformation relevant and impactful over time."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode has embraced digital transformation to enhance product delivery and customer engagement. The company integrates AI-powered tools to analyze trends and make data-driven decisions. Cloud-based systems ensure team collaboration across different locations. Automated workflows improve productivity while reducing manual errors. By investing in cutting-edge technologies, Crestcode remains adaptable to industry shifts and customer expectations."
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
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        ? 'bg-purple-50 text-purple-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Digital Transformation Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a digital transformation specialist with extensive experience helping businesses leverage technology to drive growth and innovation. With expertise in cloud computing, AI integration, and process automation, they guide organizations through their digital evolution journey.
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
                    <h4 className="font-bold text-gray-900 mb-2">User Experience Design: Creating Products People Love</h4>
                    <p className="text-sm text-gray-600 mb-3">User Experience design, often called UX design, focuses on creating products...</p>
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
