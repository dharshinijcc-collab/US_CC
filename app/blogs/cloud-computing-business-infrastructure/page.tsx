'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Cloud Computing: Transforming Business Infrastructure",
  category: "Technology",
  date: "March 1, 2025",
  readTime: "3 min read",
  author: "Satheesh",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720",
  tags: ["#Cloud Computing", "#infrastructure"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Cloud computing has revolutionised the way businesses manage and scale their operations. It offers a flexible and cost-effective alternative to traditional on-premise infrastructure. Organisations can now access computing resources on demand, allowing them to respond quickly to market changes. The shift to cloud has opened opportunities for innovation across industries. From startups to enterprises, businesses are leveraging the cloud to enhance efficiency and customer experiences. This transformation is not only technological but also strategic."
    },
    {
      id: "understanding-cloud-computing-models",
      title: "Understanding Cloud Computing Models",
      content: "Cloud computing is typically delivered through three main models, namely Infrastructure as a Service, Platform as a Service, and Software as a Service. Each model offers different levels of control and management for businesses. Infrastructure as a Service provides virtualised hardware resources. Platform as a Service offers a ready-to-use platform for application development. Software as a Service delivers complete applications over the internet. Choosing the right model depends on business needs and scalability goals."
    },
    {
      id: "key-benefits-of-cloud-adoption",
      title: "Key Benefits of Cloud Adoption",
      content: "One of the most significant benefits of cloud computing is scalability. Businesses can adjust their resource usage in real time, ensuring efficiency and cost savings. Cloud also enhances collaboration by enabling remote access to tools and data. Additionally, the cloud reduces the need for heavy upfront investments in hardware, making it an attractive choice for growing businesses."
    },
    {
      id: "cloud-migration-strategies",
      title: "Cloud Migration Strategies",
      content: "Successful migration to the cloud requires careful planning. Businesses often start with a thorough assessment of existing infrastructure and workloads. This helps identify which applications are best suited for migration. Migration can be done in stages, using methods such as rehosting, replatforming, or refactoring. A phased approach reduces risks and allows teams to adapt gradually to the new environment."
    },
    {
      id: "cloud-security-considerations",
      title: "Cloud Security Considerations",
      content: "Security remains a top concern for cloud adoption. Businesses must ensure data protection through encryption, access control, and continuous monitoring. Choosing a reputable cloud provider with robust compliance standards can mitigate risks. Regular audits and security updates further strengthen the safety of cloud environments."
    },
    {
      id: "multi-cloud-and-hybrid-strategies",
      title: "Multi-Cloud and Hybrid Strategies",
      content: "Many organisations are adopting multi-cloud or hybrid strategies. This involves using services from multiple providers or combining private and public clouds. Such strategies offer flexibility, better disaster recovery options, and reduced dependency on a single vendor. They also allow businesses to choose the best services from different providers."
    },
    {
      id: "cloud-cost-management",
      title: "Cloud Cost Management",
      content: "While the cloud can be cost-effective, expenses can escalate without proper oversight. Businesses should implement cost monitoring tools to track resource usage. Rightsizing resources and removing unused services help optimize spending. Establishing a governance framework ensures cost efficiency over time."
    },
    {
      id: "the-future-of-cloud-computing",
      title: "The Future of Cloud Computing",
      content: "Cloud computing is evolving with advancements like edge computing and serverless architectures. These innovations aim to reduce latency and improve scalability. Integration with artificial intelligence and machine learning will further enhance cloud capabilities. Businesses that stay ahead of these trends will maintain a competitive edge."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode is actively leveraging cloud computing to enhance product development and operational efficiency. The company uses a hybrid approach, combining private and public cloud services for flexibility and security. By adopting scalable infrastructure, Crestcode can quickly deploy solutions tailored to client needs. The integration of cloud-based tools enables seamless collaboration, faster development cycles, and improved customer experiences."
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
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Cloud Infrastructure Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a cloud computing specialist with extensive experience in designing and implementing scalable cloud solutions. With expertise in multi-cloud strategies, migration planning, and cloud security, they help businesses leverage cloud technologies to drive innovation and operational excellence.
                </p>
              </div>

              {/* Related Articles */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Agile Development Methodologies for Tech Teams</h4>
                    <p className="text-sm text-gray-600 mb-3">Agile development has transformed the way tech teams plan...</p>
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-2">Data-Driven Decision Making in Modern Business</h4>
                    <p className="text-sm text-gray-600 mb-3">Data-driven decision making has become an essential approach...</p>
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
