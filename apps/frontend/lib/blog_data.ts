export interface BlogPost {
  image: string;
  image_url?: string;
  category: string;
  date: string;
  published_at?: string;
  readTime: string;
  read_time?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  slug: string;
  author_details?: {
    name: string;
    role: string;
    bio: string;
    avatar_url: string;
  };
}

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866",
    category: "Design",
    date: "March 12, 2025",
    readTime: "4 min read",
    title: "Future of AI in Product Development: Transforming Ideas into Reality",
    excerpt: "Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development...",
    content: "## The Evolution of AI in Product Design\n\nArtificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development. Design teams are now using predictive models and generative systems to accelerate creation loops.\n\n## Collaborative AI Assistants\n\nBy leveraging automated suggestions, teams can prototype responsive layouts, discover unique color palettes, and validate accessibility standards instantly. This compressed workflow lets developers focus on core customer value.",
    author: "Ahmed Faraz",
    slug: "future-of-ai-in-product-development",
    author_details: {
      name: "Ahmed Faraz",
      role: "Lead Design Strategist",
      bio: "Ahmed specializes in human-centered AI interfaces and has over 8 years of venture design experience.",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768",
    category: "Startups",
    date: "March 10, 2025",
    readTime: "3 min read",
    title: "Building Successful MVP: A Complete Guide for Entrepreneurs",
    excerpt: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product...",
    content: "## What defines a solid MVP?\n\nEvery successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product. An MVP is not a half-finished layout; it is a laser-focused release solving one key customer problem.\n\n## Validating via MVPs\n\nBuild fast, collect feedback, iterate, and build again. Successful venture studios use MVPs to gather real-world usage data before committing capital to production infrastructure.",
    author: "Moin Khan",
    slug: "building-successful-mvp-guide",
    author_details: {
      name: "Moin Khan",
      role: "Partner, Venture Studio",
      bio: "Moin guides tech founders through structural growth and fundraising strategies.",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768",
    category: "Development",
    date: "March 5, 2025",
    readTime: "3 min read",
    title: "Digital Transformation Strategies for Modern Businesses",
    excerpt: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to...",
    content: "## Adapting to the Era of Digital Efficiency\n\nDigital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to stay competitive in rapid market shifts.\n\n## Modern Engineering Workflows\n\nIntegrating cloud services, automating backend checks, and hosting standard SPAs are base requirements for scaling business operations.",
    author: "Karthik Raja",
    slug: "digital-transformation-strategies",
    author_details: {
      name: "Karthik Raja",
      role: "VP of Engineering",
      bio: "Karthik specializes in distributed microservices and enterprise digital infrastructure.",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768",
    category: "Business",
    date: "March 3, 2025",
    readTime: "3 min read",
    title: "User Experience Design: Creating Products People Love",
    excerpt: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable...",
    content: "## The Value of Premium Design\n\nUser Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable to the consumer.\n\n## Interactive Micro-Animations\n\nAdding animations, dynamic scrolling states, and responsive styling elements improves user retention and sets applications apart from basic layouts.",
    author: "Tulasi Divya",
    slug: "user-experience-design-products",
    author_details: {
      name: "Tulasi Divya",
      role: "Lead UX Researcher",
      bio: "Tulasi conducts product validation surveys and maps intuitive user journeys.",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768",
    category: "Technology",
    date: "February 28, 2025",
    readTime: "3 min read",
    title: "Startup Funding: Navigating the Investment Landscape",
    excerpt: "Navigating startup funding requires understanding different investment vehicles, finding alignment with partners, and knowing when to pitch.",
    content: "## Navigating Startup Funding\n\nSecuring investment is one of the most critical milestones for any startup. However, the path to funding is rarely straightforward. Founders must choose between venture capital, angel syndicates, non-dilutive debt, or venture studio partnerships.\n\n## Finding Strategic Alignment\n\nCapital is a commodity. The best investors bring distribution, industry expertise, and operational support. When evaluating investment offers, founders should look beyond valuation and focus on key partner alignment.",
    author: "Swathi",
    slug: "startup-funding-investment-landscape",
    author_details: {
      name: "Swathi",
      role: "Investment Principal",
      bio: "Swathi evaluates venture opportunities and structures strategic investments.",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768",
    category: "Startups",
    date: "February 25, 2025",
    readTime: "3 min read",
    title: "Agile Development Methodologies for Tech Teams",
    excerpt: "Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability.",
    content: "## The Agile Mindset\n\nAgile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability, early collaboration, and iterative feedback loops over rigid upfront plans.\n\n## Sprints & Demos\n\nBy building in short, bi-weekly sprints, team members can test micro-hypotheses, deliver functional milestones, and align with stakeholders continuously. This reduces delivery risk and keeps developers aligned with real user needs.",
    author: "Vinitha",
    slug: "agile-development-methodologies",
    author_details: {
      name: "Vinitha",
      role: "Agile Coach & PM",
      bio: "Vinitha runs agile sprint execution and coaches teams on product delivery best practices.",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720",
    category: "Technology",
    date: "March 1, 2025",
    readTime: "3 min read",
    title: "Cloud Computing: Transforming Business Infrastructure",
    excerpt: "Cloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible and cost...",
    content: "## Infrastructure in the Cloud\n\nCloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible, elastic, and cost-effective approach to computing resources.\n\n## Elastic Scaling & Security\n\nInstead of managing physical servers, businesses can provision computing power, database clusters, and media storage on-demand. This allows applications to scale seamlessly under sudden spikes in user traffic while keeping data secure and compliant.",
    author: "Satheesh",
    slug: "cloud-computing-business-infrastructure",
    author_details: {
      name: "Satheesh",
      role: "Cloud Architect",
      bio: "Satheesh designs secure, scalable, and high-performance cloud architectures.",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
    }
  },
  {
    image: "https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768",
    category: "Business",
    date: "February 28, 2025",
    readTime: "3 min read",
    title: "Data-Driven Decision Making in Modern Business",
    excerpt: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations",
    content: "## Deciding with Data\n\nData-driven decision making has become an essential approach in today's competitive business world. Organizations that leverage data outperform competitors by spotting trends and inefficiencies early.\n\n## Implementing Metrics Dashboards\n\nBy tracking core user activation, conversion funnels, and customer lifetime value, leadership teams can make informed strategic adjustments. Deciding based on telemetry rather than gut feeling leads to predictable and repeatable growth.",
    author: "Mythrehe",
    slug: "data-driven-decision-making",
    author_details: {
      name: "Mythrehe",
      role: "Data Scientist",
      bio: "Mythrehe translates complex analytical models into clear, actionable business strategies.",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    }
  }
];
