'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "User Experience Design: Creating Products People Love",
  category: "Business",
  date: "March 3, 2025",
  readTime: "3 min read",
  author: "Tulasi Divya",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768",
  tags: ["#UX Design", "#User Experience"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable to users. In a competitive market, functionality alone is not enough. Products must connect emotionally with users. A great UX makes technology feel effortless and natural. It ensures that every interaction is clear and meaningful. By understanding how people think and behave, designers can craft experiences that inspire trust and loyalty."
    },
    {
      id: "the-foundation-of-great-ux",
      title: "The Foundation of Great UX",
      content: "Great UX begins with a deep understanding of the user's needs and expectations. Research is the foundation, involving surveys, interviews, and observation. Empathy plays a key role, allowing designers to step into the shoes of the end user. This understanding guides design choices that make products easy and satisfying to use. When the foundation is strong, the product naturally aligns with user goals."
    },
    {
      id: "core-ux-design-principles",
      title: "Core UX Design Principles",
      content: "Clarity ensures that users always know what to do and where to go within a product. Consistency builds familiarity, making interactions predictable and comfortable. Feedback keeps users informed about the results of their actions. Simplicity avoids overwhelming the user with unnecessary options or steps. Accessibility ensures that products can be used by people of all abilities."
    },
    {
      id: "the-ux-design-process",
      title: "The UX Design Process",
      content: "The process begins with research and discovery to define the problem. Next comes ideation, where possible solutions are explored through brainstorming and sketching. Prototypes are created to test ideas before full development. Usability testing follows, revealing where improvements are needed. Finally, the product is launched and monitored for ongoing enhancements."
    },
    {
      id: "common-ux-mistakes-to-avoid",
      title: "Common UX Mistakes to Avoid",
      content: "Designing without understanding the user's needs often leads to failure. Adding too many features can create confusion instead of value. Neglecting accessibility excludes a significant portion of potential users. Poor navigation frustrates users and drives them away. Skipping testing is another common mistake that results in costly redesigns later."
    },
    {
      id: "measuring-ux-success",
      title: "Measuring UX Success",
      content: "UX success can be measured using metrics such as task completion rates and time on task. User satisfaction surveys provide direct insights into the experience. Engagement rates and customer retention figures also indicate UX effectiveness. Continuous monitoring helps ensure that the design remains relevant over time."
    },
    {
      id: "the-business-impact-of-great-ux",
      title: "The Business Impact of Great UX",
      content: "A well-designed user experience increases customer loyalty and trust. It reduces support costs, as users encounter fewer difficulties. Positive experiences encourage word-of-mouth recommendations. Ultimately, great UX can lead to higher conversion rates and stronger revenue growth."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode prioritizes UX in every stage of product development. The company invests in research to deeply understand user needs. Prototypes are tested with real users to gather actionable feedback. Designs are refined to ensure clarity, accessibility, and engagement. By integrating UX principles into its strategy, Crestcode delivers products that customers truly enjoy."
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
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        ? 'bg-orange-50 text-orange-600 font-medium'
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
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">UX Design Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is a passionate UX designer with a deep understanding of user-centered design principles. With years of experience creating intuitive digital experiences, they specialize in transforming complex problems into simple, elegant solutions that delight users and drive business success.
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
