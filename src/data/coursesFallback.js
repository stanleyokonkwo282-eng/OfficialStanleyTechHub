const coursesFallback = [
  {
    _id: 'fallback-1',
    title: 'Graphic Design Masterclass',
    description: 'Learn the foundations of design, branding, and visual storytelling.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    price: 0,
    category: 'Design',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 5,
    totalEnrollments: 128,
    modules: [
      {
        moduleId: "gd-mod-1",
        moduleTitle: "Introduction to Visual Communication",
        lessons: [
          { lessonId: "gd-1", title: "Understanding Design Principles & Layouts", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-2", title: "The Power of Visual Hierarchy", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-3", title: "Color Theory for Modern Creators", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-4", title: "Mastering Typography & Font Pairing", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-5", title: "Setting Up Your Canvas & Workspace", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-6", title: "Working with Vector Shapes & Grids", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-7", title: "Introduction to Composition Techniques", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-8", title: "Analyzing Famous Brand Design Assets", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      },
      {
        moduleId: "gd-mod-2",
        moduleTitle: "Digital Assets & Layout Systems",
        lessons: [
          { lessonId: "gd-9", title: "Designing Social Media Carousels", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-10", title: "Thumbnails That Drive High CTR", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-11", title: "Creating Pitch Decks and Presentation Slides", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-12", title: "UI Components for Landing Pages", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-13", title: "Building Consistency with Style Guides", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-14", title: "Using Masking and Layer Blend Modes", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-15", title: "Vector Pen Tool Techniques Explained", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-16", title: "Adding Realism via Drop Shadows & Textures", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      },
      {
        moduleId: "gd-mod-3",
        moduleTitle: "Advanced Typography & Brand Identity",
        lessons: [
          { lessonId: "gd-17", title: "Custom Typographic Treatments", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-18", title: "Logo Concept Generation Workflows", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-19", title: "Designing Scaleable Vector Icons", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-20", title: "Preparing Print vs Digital Artboards", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-21", title: "Applying Global Swatches for Fluid Rebrands", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-22", title: "Exporting High-Fidelity Design Assets", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-23", title: "Designing Interactive Digital Magazines", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-24", title: "Advanced Moodboards & Creative Direction", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      },
      {
        moduleId: "gd-mod-4",
        moduleTitle: "Commercial Projects & Portfolios",
        lessons: [
          { lessonId: "gd-25", title: "Packaging Design Systems Fundamentals", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-26", title: "Mocking Up Products Realistically", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-27", title: "Freelance Client Brief Walkthroughs", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-28", title: "Organizing Your Behance Portfolio", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-29", title: "Pricing Creative Graphic Assets", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-30", title: "Handling Critical Feedback Revisions", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-31", title: "Design Ethics & Copyright Infringement", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "gd-32", title: "Graphic Design Final Exam Prep", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      }
    ]
  },
  {
    _id: 'fallback-2',
    title: 'AI Productivity Toolkit',
    description: 'Use AI tools to automate content creation, research, and marketing tasks.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    price: 49,
    category: 'Artificial Intelligence',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 96,
    modules: [
      {
        moduleId: "ai-mod-1",
        moduleTitle: "Prompt Engineering Essentials",
        lessons: [
          { lessonId: "ai-1", title: "Core Foundations of LLM Models", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-2", title: "Structuring System Prompts Efficiently", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-3", title: "Few-Shot Prompting and Context Windows", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-4", title: "Preventing Hallucinations in Output Data", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-5", title: "Chain of Thought Framework Mechanics", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-6", title: "Automating Multi-Step Code Scripts", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-7", title: "Extracting Structured JSON Tables", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-8", title: "Prompt Libraries for Content Creators", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      },
      {
        moduleId: "ai-mod-2",
        moduleTitle: "Workflow Automation Engines",
        lessons: [
          { lessonId: "ai-9", title: "Configuring Automated Zapier Tasks", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-10", title: "Connecting Notion Databases via Webhooks", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-11", title: "AI Calendar Scheduling Optimizations", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-12", title: "Automated Transcripts & Summaries", videoUrl: "https://youtube.com", pdfUrl: "" },
          { lessonId: "ai-13", title: "Scraping Data with Intelligent Parsing", videoUrl: "https://youtube.com", pdfUrl: "" }
        ]
      }
    ]
  },
  {
    _id: 'fallback-3',
    title: 'Video Editing for Creators',
    description: 'Master editing workflows for short-form videos and social media content.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    price: 0,
    category: 'Video Production',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 84,
    modules: []
  },
  {
    _id: 'fallback-4',
    title: 'Data Science & Analytics with Python',
    description: 'Learn Python, Pandas, SQL, and data visualization to analyze data and build real-world projects. High-income skill for 2026.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    price: 0,
    category: 'Data Science',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.9,
    totalEnrollments: 210,
    modules: []
  },
  {
    _id: 'fallback-5',
    title: 'Cybersecurity Fundamentals',
    description: 'Understand network security, ethical hacking basics, SOC operations, and certification roadmaps. High global demand skill.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    price: 0,
    category: 'Cybersecurity',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 175,
    modules: []
  },
  {
    _id: 'fallback-6',
    title: 'Mobile App Development (Flutter + React Native)',
    description: 'Build cross-platform iOS and Android apps with Flutter and React Native. Learn deployment and monetization strategies.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    price: 0,
    category: 'Mobile Development',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 142,
    modules: []
  },
  {
    _id: 'fallback-7',
    title: 'E-commerce & Dropshipping Mastery',
    description: 'Start a profitable Shopify store, find suppliers, run Facebook/Instagram ads, and manage logistics for the Nigerian market.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    price: 0,
    category: 'Business',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 310,
    modules: []
  },
  {
    _id: 'fallback-8',
    title: 'Social Media Marketing Agency',
    description: 'Learn content strategy, paid ads, client acquisition, and agency scaling. Start earning immediately as a social media manager.',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    price: 0,
    category: 'Marketing',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.9,
    totalEnrollments: 285,
    modules: []
  },
  {
    _id: 'fallback-9',
    title: 'Copywriting & Sales Psychology',
    description: 'Master direct response copy, email funnels, landing pages, and freelance pricing. The highest income-per-hour skill for creators.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    price: 0,
    category: 'Writing',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 198,
    modules: []
  },
  {
    _id: 'fallback-10',
    title: 'SEO & Organic Traffic Mastery',
    description: 'Master keyword research, technical SEO, link building, and AI-assisted content to dominate search rankings.',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
    price: 0,
    category: 'Marketing',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 165,
    modules: []
  },
  {
    _id: 'fallback-11',
    title: 'YouTube Channel Growth & Monetization',
    description: 'Build a personal brand with niche selection, virality techniques, AdSense, sponsorships, and professional editing.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    price: 0,
    category: 'Social Media',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 230,
    modules: []
  },
  {
    _id: 'fallback-12',
    title: 'Freelancing Blueprint: From Zero to $5K/Month',
    description: 'Learn how to get clients on Upwork, Fiverr, and LinkedIn. Master profile optimization, proposals, pricing, and long-term relationships.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    price: 0,
    category: 'Business',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.9,
    totalEnrollments: 340,
    modules: []
  },
  {
    _id: 'fallback-13',
    title: 'Financial Literacy & Online Trading',
    description: 'Learn forex, crypto, and stock market basics for Africans. Master risk management, platforms, and psychological discipline.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    price: 0,
    category: 'Finance',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.6,
    totalEnrollments: 155,
    modules: []
  },
  {
    _id: 'fallback-14',
    title: 'Personal Branding & CV Mastery',
    description: 'Build a powerful personal brand, optimize your LinkedIn, write a winning CV, and ace interviews. Essential for every youth in 2026.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    price: 0,
    category: 'Professional Development',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 275,
    modules: []
  },
  {
    _id: 'fallback-15',
    title: 'AI Automation for Beginners',
    description: 'Automate repetitive tasks using AI tools. Learn no-code automation, chatbots, and workflow optimization to save time and increase productivity.',
    image: 'https://images.unsplash.com/photo-1485827404663-3b37c1f3d5d4?w=800&q=80',
    price: 0,
    category: 'Artificial Intelligence',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.9,
    totalEnrollments: 195,
    modules: []
  },
  {
    _id: 'fallback-16',
    title: 'Content Creation & Influencer Marketing',
    description: 'Master short-form video, storytelling, and monetization pathways. Build an audience and turn your content into a sustainable income.',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    price: 0,
    category: 'Content Creation',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 260,
    modules: []
  },
  {
    _id: 'fallback-17',
    title: 'Public Speaking & Communication',
    description: 'Build confidence and master the art of public speaking. Essential for presentations, pitches, and leadership roles.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    price: 0,
    category: 'Communication',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.6,
    totalEnrollments: 145,
    modules: []
  },
  {
    _id: 'fallback-18',
    title: 'Entrepreneurship & Startup Basics',
    description: 'Learn how to validate ideas, pitch, and launch with minimal capital. Turn your side hustle into a real business.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    price: 0,
    category: 'Business',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 220,
    modules: []
  },
  {
    _id: 'fallback-19',
    title: 'Critical Thinking & Problem Solving',
    description: 'Develop the meta-skill that improves every other skill. Learn frameworks for analysis, decision-making, and creative problem-solving.',
    image: 'https://images.unsplash.com/photo-1456406644174-8f92979f9f3b?w=800&q=80',
    price: 0,
    category: 'Personal Development',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 180,
    modules: []
  },
  {
    _id: 'fallback-20',
    title: 'Digital Literacy & Internet Safety',
    description: 'Essential skills for safe online participation and earning. Learn privacy, security, digital citizenship, and responsible technology use.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80',
    price: 0,
    category: 'Digital Skills',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.5,
    totalEnrollments: 130,
    modules: []
  },
  {
    _id: 'fallback-21',
    title: 'Blockchain & Web3 Fundamentals',
    description: 'Understand blockchain, wallets, DeFi basics, and the future of the internet. High youth adoption and emerging career opportunities.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7c938da0?w=800&q=80',
    price: 0,
    category: 'Blockchain',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.6,
    totalEnrollments: 160,
    modules: []
  },
  {
    _id: 'fallback-22',
    title: 'Mental Health & Productivity Systems',
    description: 'Prevent burnout, master time management, and build focus systems for creators. Mental health is the foundation of sustainable success.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    price: 0,
    category: 'Wellness',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.8,
    totalEnrollments: 190,
    modules: []
  },
  {
    _id: 'fallback-23',
    title: 'Theology & Christian Living',
    description: 'A complete theology class covering biblical studies, Christian doctrine, spiritual growth, and practical application for daily life.',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    price: 0,
    category: 'Theology',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.9,
    totalEnrollments: 120,
    modules: []
  }
];

export default coursesFallback;
