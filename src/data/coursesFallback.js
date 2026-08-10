const coursesFallback = [
  {
    _id: 'fallback-1',
    title: 'Graphic Design Masterclass',
    description: 'Learn the foundations of design, branding, and visual storytelling.',
    image: 'https://unsplash.com',
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
    image: 'https://unsplash.com',
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
    price: 29,
    category: 'Video Production',
    instructorName: 'Creators Hub Academy',
    instructor: [{ displayName: 'Creators Hub Academy' }],
    rating: 4.7,
    totalEnrollments: 84,
    modules: []
  }
];

export default coursesFallback;
