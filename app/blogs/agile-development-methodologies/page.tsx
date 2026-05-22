'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Clock, Calendar, User, ArrowRight } from 'lucide-react';

const articleContent = {
  title: "Agile Development Methodologies for Tech Teams",
  category: "Startups",
  date: "February 25, 2025",
  readTime: "3 min read",
  author: "Vinitha",
  image: "https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768",
  tags: ["#Agile", "#Software Development"],
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: "Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability, collaboration, and continuous improvement over rigid planning. In a rapidly changing market, Agile allows teams to respond quickly to shifting requirements. This approach has become a preferred method for software companies and product teams worldwide."
    },
    {
      id: "understanding-agile-principles",
      title: "Understanding Agile Principles",
      content: "Agile is based on values outlined in the Agile Manifesto, which prioritize individuals and interactions over processes and tools. It encourages working solutions over extensive documentation. Customer collaboration is valued more than strict contract negotiations. Responding to change is seen as an advantage rather than a disruption. These principles guide teams toward flexibility, efficiency, and customer satisfaction."
    },
    {
      id: "popular-agile-frameworks",
      title: "Popular Agile Frameworks",
      content: "Scrum is one of the most widely adopted Agile frameworks, using short sprints to deliver incremental improvements. Kanban focuses on visualizing work and limiting tasks in progress to maintain flow. Extreme Programming emphasizes technical excellence and frequent releases. Lean encourages eliminating waste and maximizing value delivery. Choosing the right framework depends on the team's size, goals, and workflow."
    },
    {
      id: "implementing-agile-successfully",
      title: "Implementing Agile Successfully",
      content: "Successful Agile adoption begins with leadership support and clear communication. Teams should be trained on Agile practices and principles before starting. Short, iterative cycles help maintain focus and deliver value quickly. Regular feedback sessions ensure the process remains aligned with business needs. A culture of trust and openness is critical for Agile to thrive."
    },
    {
      id: "common-agile-challenges",
      title: "Common Agile Challenges",
      content: "Resistance to change is one of the biggest barriers to Agile adoption. Teams may struggle with unclear roles and responsibilities. Overemphasis on speed can sometimes compromise quality. Poor communication between stakeholders and developers reduces effectiveness. Addressing these challenges early ensures smoother Agile transitions."
    },
    {
      id: "agile-tools-and-technologies",
      title: "Agile Tools and Technologies",
      content: "Project management platforms like Jira and Trello help track progress and prioritize tasks. Collaboration tools such as Slack and Microsoft Teams improve team communication. Automated testing frameworks support continuous integration and delivery. Cloud-based repositories like GitHub and GitLab enable seamless code sharing. The right tools enhance productivity and transparency across Agile teams."
    },
    {
      id: "measuring-agile-success",
      title: "Measuring Agile Success",
      content: "Velocity and throughput measure how much work is completed in a given period. Customer satisfaction surveys provide insights into the value delivered. Cycle time helps evaluate efficiency in completing tasks. Regular retrospectives identify areas for process improvement. Measuring both outcomes and processes ensures Agile remains effective."
    },
    {
      id: "scaling-agile",
      title: "Scaling Agile",
      content: "Scaling Agile involves applying its principles across multiple teams and departments. Frameworks like SAFe and LeSS help coordinate work in larger organizations. Consistent communication and shared goals are essential to avoid misalignment. Scaling should be gradual to maintain agility and quality. This approach ensures Agile benefits are preserved as the organization grows."
    },
    {
      id: "the-future-of-agile",
      title: "The Future of Agile",
      content: "Agile is evolving with advances in automation, AI, and remote collaboration. Hybrid models are emerging, combining Agile with other methodologies. Continuous learning will remain central to Agile's success. Greater emphasis will be placed on delivering personalized customer experiences. The future promises even more adaptive and responsive Agile practices."
    },
    {
      id: "how-is-crestcode-adopting-these-technologies-in-the-market",
      title: "How is Crestcode Adopting These Technologies in the Market?",
      content: "Crestcode incorporates Agile principles across its product development cycles. The team uses Scrum sprints to deliver updates quickly and effectively. Collaboration tools ensure smooth communication between remote and in-office teams. Customer feedback is collected regularly to guide product enhancements. By embracing Agile, Crestcode maintains flexibility while delivering high-quality solutions."
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
      <div className="bg-gradient-to-br from-red-50 to-pink-100 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blogs</span>
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        ? 'bg-red-50 text-red-600 font-medium'
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
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
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
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {articleContent.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{articleContent.author}</h4>
                    <p className="text-gray-600">Agile Development Expert</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {articleContent.author} is an Agile methodologies specialist with extensive experience helping tech teams implement and scale Agile practices. With expertise in Scrum, Kanban, and Lean methodologies, they guide organizations in achieving higher productivity, better quality, and faster delivery cycles.
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
                    <h4 className="font-bold text-gray-900 mb-2">Cloud Computing: Transforming Business Infrastructure</h4>
                    <p className="text-sm text-gray-600 mb-3">Cloud computing has revolutionized the way businesses manage...</p>
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
