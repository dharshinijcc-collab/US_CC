'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Data-Driven Decision Making in Modern Business",
  category: "Business",
  date: "February 28, 2025",
  readTime: "3 min read",
  author: "Mythrehe",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768",
  tags: ["#Data Analytics", "#Business Intelligence"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations now rely on factual insights instead of assumptions to guide their strategies. This shift is helping companies improve efficiency, reduce risks, and enhance customer experiences. Businesses can analyze patterns, predict trends, and make more informed choices. By integrating data into every aspect of operations, companies can remain agile and adaptive. This approach also strengthens long-term growth potential and boosts overall profitability."
    },
    {
      id: "the-foundation-of-data-driven-culture",
      title: "The Foundation of Data-Driven Culture",
      content: "A data-driven culture starts with leadership commitment and organization-wide adoption. Leaders must encourage the use of analytics to guide actions and decisions. Teams need access to reliable, timely, and relevant data for this to work. Training employees to interpret and use data effectively is equally important. It fosters trust in analytics and reduces resistance to change. Transparency in sharing results and findings further supports a strong data culture."
    },
    {
      id: "types-of-business-analytics",
      title: "Types of Business Analytics",
      content: "Business analytics can be classified into descriptive, diagnostic, predictive, and prescriptive categories. Descriptive analytics summarizes past data to understand what happened. Diagnostic analytics digs deeper to find reasons behind certain outcomes. Predictive analytics forecasts future scenarios based on historical patterns. Prescriptive analytics recommends actions to achieve desired results. Each type plays a unique role in supporting better decision making."
    },
    {
      id: "key-performance-indicators-kpis",
      title: "Key Performance Indicators (KPIs)",
      content: "KPIs are measurable values that indicate progress toward business objectives. They help track performance in areas like sales, customer satisfaction, and operational efficiency. The right KPIs should align with strategic goals and be easy to interpret. Regular monitoring of KPIs allows quick adjustments to strategies and processes. A focus on actionable KPIs ensures teams remain on the right track."
    },
    {
      id: "data-collection-and-management",
      title: "Data Collection and Management",
      content: "Effective decision making requires accurate and well-organized data. Businesses must gather information from multiple sources, including customer interactions, market research, and internal processes. Data should be cleaned, validated, and stored in secure systems. Implementing data governance policies ensures quality and compliance. Strong management practices make analytics more reliable and useful."
    },
    {
      id: "analytics-tools-and-technologies",
      title: "Analytics Tools and Technologies",
      content: "Modern analytics tools range from basic reporting software to advanced AI-powered platforms. Popular options include business intelligence dashboards, data visualization tools, and cloud-based analytics services. These tools make it easier to process large datasets and uncover valuable insights. Automation features can save time and reduce human error. Choosing the right technology depends on business needs and data complexity."
    },
    {
      id: "common-data-analytics-challenges",
      title: "Common Data Analytics Challenges",
      content: "Companies often face issues like poor data quality, lack of skilled analysts, and resistance to change. Integrating data from different systems can also be complex and time-consuming. Addressing these challenges requires investment in technology, training, and process improvement. A clear strategy can minimize disruptions and maximize benefits."
    },
    {
      id: "building-analytical-capabilities",
      title: "Building Analytical Capabilities",
      content: "Organizations can strengthen their analytical capabilities by hiring skilled professionals and providing regular training. Cross-functional collaboration helps bring diverse perspectives to data interpretation. Establishing clear roles and responsibilities in analytics projects ensures accountability. Encouraging experimentation allows teams to test ideas and innovate."
    },
    {
      id: "measuring-analytics-roi",
      title: "Measuring Analytics ROI",
      content: "The return on investment for analytics can be measured through cost savings, revenue growth, and efficiency improvements. Metrics like reduced decision-making time and increased customer retention also indicate value. Regular assessment of analytics performance helps justify continued investment. Linking analytics results directly to business outcomes demonstrates its strategic importance."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode integrates advanced analytics into its product development and market strategies. The company uses predictive models to forecast demand, optimize resources, and improve customer engagement. Cloud-based analytics tools enable real-time performance tracking and faster decision making. Crestcode also invests in upskilling its teams to enhance analytical capabilities. This ensures the company remains competitive and data-driven in a fast-changing market."
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
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Data Analytics Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a data analytics specialist with extensive experience helping organizations leverage data to drive business decisions. With expertise in business intelligence, predictive analytics, and data strategy, they guide companies in building robust data-driven cultures and achieving measurable results.
                </p>
              </div>

              {/* Related Articles */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Cloud Computing: Transforming Business Infrastructure</h4>
                    <p className="text-sm text-gray-600 mb-3">Cloud computing has revolutionized the way businesses manage...</p>
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
