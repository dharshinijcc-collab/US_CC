import { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../services/supabase';
import { verifyAdmin } from '../middleware/auth';
import crypto from 'crypto';

// Fallback hardcoded posts (matching components/blogs.tsx defaults)
const DEFAULT_POSTS = [
  { 
    id: "1",
    slug: "future-of-ai-in-product-development", 
    title: "Future of AI in Product Development: Transforming Ideas into Reality", 
    excerpt: "Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development...", 
    content: "Artificial Intelligence is no longer a distant concept; it is becoming an integral part of modern product development. By leveraging advanced machine learning models and automated design tools, product managers and software engineers are now able to prototype, validate, and launch products at a fraction of the historical cost.\n\n## The Shift in Product Prototyping\nTraditional prototyping involved weeks of design sprints and manual code scaffolding. With generative AI, teams can now convert wireframes or text prompts into interactive prototypes within minutes. This rapid iteration cycle allows creators to test ideas with actual users almost instantaneously.\n\n## Enhancing Code Generation and Architecture\nAI coding assistants are significantly improving developer velocity. By automating repetitive boilerplate code and suggesting optimal software architectures, engineers can focus on core business logic and user experiences. This shifts the engineering focus from syntax writing to high-level system design.\n\n## Data-Driven Feature Prioritization\nAnalyzing user feedback at scale is another major benefit of AI. Natural language processing models can parse thousands of app store reviews, customer support tickets, and chat logs to extract key feature requests and paint points. This gives product teams empirical, data-driven backings for their development roadmap.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866", 
    category: "Design", 
    author: "Ahmed Faraz", 
    read_time: "4 min read", 
    published_at: "2025-03-12T00:00:00Z"
  },
  { 
    id: "2",
    slug: "building-successful-mvp-guide", 
    title: "Building Successful MVP: A Complete Guide for Entrepreneurs", 
    excerpt: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product...", 
    content: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product (MVP). An MVP allows startup teams to validate their assumptions with real users in the shortest possible timeframe.\n\n## Define Your Core Value Proposition\nThe biggest mistake founders make is trying to build too many features in their first release. Instead, isolate the single most critical problem your target customers face. Your MVP should solve this one problem exceptionally well, without any extra distractions or secondary features.\n\n## Prioritize and Scope Ruthlessly\nList all the features you envision for your product, and then categorize them into 'Must Have,' 'Should Have,' and 'Nice to Have.' Eliminate everything except the 'Must Have' features. This keeps your build timeline short and minimizes upfront engineering costs.\n\n## Gather and Implement Actionable Feedback\nOnce your MVP is live, actively monitor user interactions. Reach out to early adopters for qualitative feedback and track product usage data. Use these insights to iterate rapidly, fixing usability issues and refining the product based on actual customer behavior.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768", 
    category: "Startups", 
    author: "Moin Khan", 
    read_time: "3 min read", 
    published_at: "2025-03-10T00:00:00Z"
  },
  { 
    id: "3",
    slug: "digital-transformation-strategies", 
    title: "Digital Transformation Strategies for Modern Businesses", 
    excerpt: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to...", 
    content: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to remain competitive in today's fast-paced digital ecosystem. Successful transformation requires alignment across leadership, culture, and technology.\n\n## Re-evaluating Legacy Workflows\nTrue digital transformation is not just about moving spreadsheets to the cloud. It requires a complete rethink of how your organization operates. Legacy processes must be audited and streamlined to eliminate redundant steps and manual handoffs before they are digitized.\n\n## Empowering Teams with Modern Tools\nAdopting modern software solutions and collaboration platforms helps break down organizational silos. By equipping teams with self-service analytics and intuitive project management tools, companies foster a more agile, data-driven work culture.\n\n## Ensuring Long-Term Security and Compliance\nAs operations move online, data security becomes paramount. Modern businesses must establish robust access control mechanisms, implement continuous vulnerability monitoring, and train employees on security best practices to protect customer data.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768", 
    category: "Development", 
    author: "Karthik Raja", 
    read_time: "3 min read", 
    published_at: "2025-03-05T00:00:00Z"
  },
  { 
    id: "4",
    slug: "user-experience-design-products", 
    title: "User Experience Design: Creating Products People Love", 
    excerpt: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable...", 
    content: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable for customers. Excellent UX starts by understanding your users' goals, behaviors, and pain points.\n\n## The Power of User Research\nBefore laying down a single pixel, designers must conduct thorough user research. Creating user personas and mapping customer journeys helps designers empathize with users, ensuring the final product solves real-world usability challenges.\n\n## Designing for Clarity and Simplicity\nA clean, minimal interface reduces cognitive load. Users should be able to complete their desired actions with minimal clicks and without needing to read complex instructions. Leverage standard UI patterns and clear visual hierarchies to guide users naturally.\n\n## Continuous Testing and Iteration\nUX design is never truly finished. Regularly conduct usability tests with actual users to observe where they get confused or run into friction. Use heatmaps and click tracking to identify areas of the interface that need simplification or rearrangement.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768", 
    category: "Business", 
    author: "Tulasi Divya", 
    read_time: "3 min read", 
    published_at: "2025-03-03T00:00:00Z"
  },
  { 
    id: "5",
    slug: "startup-funding-investment-landscape", 
    title: "Startup Funding: Navigating the Investment Landscape", 
    excerpt: "Essential security measures every development team should implement when building cloud-native applications.", 
    content: "Navigating the startup investment landscape can be a daunting process for founders. From bootstrapping and angel investors to venture capital and growth equity, understanding your options is critical.\n\n## Bootstrapping vs. External Capital\nBootstrapping gives founders complete control and ownership over their company. However, if your market is highly competitive and speed-to-market is critical, seeking external funding from angel investors or venture capitalists can provide the fuel needed to scale quickly.\n\n## Preparing a Compelling Pitch Deck\nInvestors review hundreds of decks every week. Your pitch deck must be clear, concise, and focused on key traction metrics. Clearly state the problem you are solving, your unique solution, market size, business model, and the team's execution capabilities.\n\n## Finding the Right Investment Partner\nDo not just accept money from anyone. Look for 'smart money' — investors who bring industry expertise, valuable networks, and strategic mentorship to help your startup navigate scaling challenges and future funding rounds.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768", 
    category: "Technology", 
    author: "Swathi", 
    read_time: "3 min read", 
    published_at: "2025-02-28T00:00:00Z"
  },
  { 
    id: "6",
    slug: "agile-development-methodologies", 
    title: "Agile Development Methodologies for Tech Teams", 
    excerpt: "Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability", 
    content: "Agile development has transformed the way modern engineering teams plan, build, and deliver products. By focusing on iterative releases, continuous collaboration, and feedback loops, teams can pivot quickly based on user feedback.\n\n## Scrum vs. Kanban Frameworks\nScrum organizes development into fixed-length cycles called sprints (usually 2 weeks), ending with a working product increment. Kanban focuses on continuous flow, using visual boards to manage work-in-progress limits and identify bottlenecks. Choose the framework that best fits your team's operational style.\n\n## The Role of Daily Standups\nShort daily standups align team members on daily priorities and expose blockers early. Each member shares what they accomplished yesterday, what they plan to do today, and any obstacles standing in their way, promoting transparency and quick resolution of issues.\n\n## Conducting Insightful Retrospectives\nAt the end of each sprint, the team reviews their processes during a retrospective. Discuss what went well, what could be improved, and agree on concrete action items to implement in the next sprint, fostering continuous operational improvements.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768", 
    category: "Startups", 
    author: "Vinitha", 
    read_time: "3 min read", 
    published_at: "2025-02-25T00:00:00Z"
  },
  { 
    id: "7",
    slug: "cloud-computing-business-infrastructure", 
    title: "Cloud Computing: Transforming Business Infrastructure", 
    excerpt: "Cloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible and cost...", 
    content: "Cloud computing has revolutionized the way businesses manage and scale their operations. By offloading infrastructure to platforms like AWS, Google Cloud, or Microsoft Azure, companies can deploy global applications in seconds.\n\n## Scaling Resources Dynamically\nTraditional on-premise servers required significant upfront hardware investments and manual scaling. With cloud infrastructure, companies can scale computing resources up or down automatically based on real-time traffic demand, optimizing costs.\n\n## Emphasizing Microservices and Containerization\nBreaking monolithic applications into containerized microservices (using tools like Docker and Kubernetes) improves system reliability. If one microservice fails, the rest of the application remains online, and development teams can deploy updates independently.\n\n## Optimizing Cloud Expenditure\nWithout proper management, cloud costs can quickly spiral out of control. Implement automatic resource provisioning limits, shut down unused staging environments, and leverage serverless architectures to pay only for the exact computing time consumed.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720", 
    category: "Technology", 
    author: "Satheesh", 
    read_time: "3 min read", 
    published_at: "2025-03-01T00:00:00Z"
  },
  { 
    id: "8",
    slug: "data-driven-decision-making", 
    title: "Data-Driven Decision Making in Modern Business", 
    excerpt: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations", 
    content: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations that leverage analytics are far more likely to capture new customers and retain existing ones.\n\n## Establishing Core Metrics (KPIs)\nTo make data-driven decisions, you must first define what success looks like. Establish key performance indicators (KPIs) that directly align with your business goals, such as Customer Acquisition Cost (CAC), Lifetime Value (LTV), and churn rate.\n\n## Building a Robust Data Pipeline\nEnsure your data is clean, centralized, and accessible. Use modern data warehousing solutions to aggregate user behavior, sales transactions, and marketing performance data into a single source of truth for your business analysts.\n\n## Fostering a Culture of Experimentation\nEncourage teams to run A/B tests and validate hypotheses rather than relying solely on intuition. By basing decisions on statistically significant test results, organizations can minimize risks and optimize conversion funnels effectively.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768", 
    category: "Business", 
    author: "Mythrehe", 
    read_time: "3 min read", 
    published_at: "2025-02-28T00:00:00Z"
  }
];

async function deleteBlogCoverImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/blogs/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const { error } = await supabaseAdmin.storage.from('blogs').remove([filename]);
      if (error) console.error('Failed to remove storage file:', error.message);
    }
  } catch (err) {
    console.error('Failed to clean up blog image:', err);
  }
}

export default async function blogsRoutes(app: FastifyInstance) {
  // GET /blogs
  app.get('/blogs', async (request, reply) => {
    try {
      const { slug } = request.query as { slug?: string };

      if (slug) {
        const post = DEFAULT_POSTS.find(p => p.slug === slug);
        if (!post) {
          return reply.status(404).send({ status: 'error', message: 'Blog not found' });
        }
        return reply.send({ status: 'success', payload: post });
      }

      return reply.send({ status: 'success', payload: DEFAULT_POSTS });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // POST /blogs
  app.post('/blogs', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;

      if (!body.slug || !body.title || !body.excerpt || !body.content) {
        return reply.status(400).send({ status: 'error', message: 'slug, title, excerpt, and content are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .insert({
          slug: body.slug,
          title: body.title,
          excerpt: body.excerpt,
          content: body.content,
          image_url: body.image_url || null,
          category: body.category || 'Technology',
          author: body.author || 'CrestCode Team',
          author_id: body.author_id || null,
          read_time: body.read_time || null,
          published_at: body.published_at || new Date().toISOString()
        })
        .select('*, author_details:blog_authors(*)')
        .single();

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.status(201).send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // PUT /blogs
  app.put('/blogs', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const body = request.body as any;

      const { data: existing } = await supabaseAdmin
        .from('blogs')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.image_url && existing.image_url !== body.image_url) {
        await deleteBlogCoverImage(existing.image_url);
      }

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .update({
          slug: body.slug,
          title: body.title,
          excerpt: body.excerpt,
          content: body.content,
          image_url: body.image_url,
          category: body.category,
          author: body.author,
          author_id: body.author_id,
          read_time: body.read_time,
          published_at: body.published_at
        })
        .eq('id', id)
        .select('*, author_details:blog_authors(*)')
        .single();

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // DELETE /blogs
  app.delete('/blogs', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { data: existing } = await supabaseAdmin
        .from('blogs')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();

      if (existing && existing.image_url) {
        await deleteBlogCoverImage(existing.image_url);
      }

      const { error } = await supabaseAdmin
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.send({ status: 'success', message: 'Blog deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // POST /blogs/upload
  app.post('/blogs/upload', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ error: 'Database not configured' });
      }

      const fileData = await request.file();
      if (!fileData) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      const buffer = await fileData.toBuffer();

      // Check file size (max 8MB for blog covers)
      if (buffer.length > 8 * 1024 * 1024) {
        return reply.status(400).send({ error: 'File size exceeds 8MB limit' });
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(fileData.mimetype)) {
        return reply.status(400).send({ error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.' });
      }

      const ext = fileData.filename.split('.').pop() || 'png';
      const uniqueName = `blog-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('blogs')
        .upload(uniqueName, buffer, {
          contentType: fileData.mimetype,
          upsert: true
        });

      if (uploadError) {
        request.log.error(uploadError, 'Supabase Storage upload error');
        return reply.status(500).send({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('blogs')
        .getPublicUrl(uniqueName);

      const publicUrl = publicUrlData?.publicUrl || '';
      
      return reply.send({ status: 'success', url: publicUrl, filename: uniqueName });
    } catch (err: any) {
      request.log.error(err, 'API upload error');
      return reply.status(500).send({ error: err.message });
    }
  });

  // GET /blog-authors
  app.get('/blog-authors', async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { all } = request.query as { all?: string };
      const showAll = all === 'true';

      let query = supabaseAdmin.from('blog_authors').select('*').order('name', { ascending: true });
      
      if (!showAll) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.send({ status: 'success', payload: data || [] });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // POST /blog-authors
  app.post('/blog-authors', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const body = request.body as any;
      if (!body.name || !body.role) {
        return reply.status(400).send({ status: 'error', message: 'Name and Role are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('blog_authors')
        .insert({
          name: body.name,
          role: body.role,
          avatar_url: body.avatar_url || null,
          bio: body.bio || null,
          is_active: body.is_active ?? true
        })
        .select()
        .single();

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.status(201).send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // PUT /blog-authors
  app.put('/blog-authors', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const body = request.body as any;
      const { data, error } = await supabaseAdmin
        .from('blog_authors')
        .update({
          name: body.name,
          role: body.role,
          avatar_url: body.avatar_url,
          bio: body.bio,
          is_active: body.is_active
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.send({ status: 'success', payload: data });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });

  // DELETE /blog-authors
  app.delete('/blog-authors', { preHandler: [verifyAdmin] }, async (request, reply) => {
    try {
      if (!supabaseAdmin) {
        return reply.status(503).send({ status: 'error', message: 'Database not configured' });
      }

      const { id } = request.query as { id?: string };
      if (!id) {
        return reply.status(400).send({ status: 'error', message: 'id is required' });
      }

      const { error } = await supabaseAdmin
        .from('blog_authors')
        .delete()
        .eq('id', id);

      if (error) return reply.status(500).send({ status: 'error', message: error.message });
      return reply.send({ status: 'success', message: 'Author deleted successfully' });
    } catch (err: any) {
      return reply.status(500).send({ status: 'error', message: err.message });
    }
  });
}
