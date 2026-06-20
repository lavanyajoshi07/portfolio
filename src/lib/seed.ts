import connectDB from './db'
import { 
  AdminUser, 
  Profile, 
  SiteSettings, 
  TechStackSettings, 
  TechnologyCategory, 
  Technology, 
  TechStats, 
  Project, 
  Certification,
  Achievement,
  AchievementCategory,
  AchievementSettings,
  ActivityLog,
  FutureGoal,
  Faq,
  CommunityItem,
  SeoSettings
} from '../models'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected.')

    // Optional: Clear out standard collections for a clean fresher profile seed
    console.log('Cleaning collections for clean fresher seed...')
    await Promise.all([
      AdminUser.deleteMany({}),
      ActivityLog.deleteMany({}),
      FutureGoal.deleteMany({}),
      Faq.deleteMany({}),
      CommunityItem.deleteMany({}),
      SeoSettings.deleteMany({}),
      Profile.deleteMany({}),
      SiteSettings.deleteMany({}),
      Project.deleteMany({}),
      Certification.deleteMany({}),
      TechStackSettings.deleteMany({}),
      TechnologyCategory.deleteMany({}),
      Technology.deleteMany({}),
      TechStats.deleteMany({}),
      Achievement.deleteMany({}),
      AchievementCategory.deleteMany({}),
      AchievementSettings.deleteMany({})
    ])

    // 1. Seed Admin User
    const adminEmail = 'lavanyajoshi889@gmail.com'
    const hashedPassword = await bcrypt.hash('portfolio055', 10)
    await AdminUser.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'Lavanya Joshi',
      role: 'super_admin',
      avatar: '/placeholders/placeholder-cert.png',
    })
    console.log('Admin user seeded.')

    // 2. Seed SEO Settings
    await SeoSettings.create({
      metaTitle: 'Lavanya Joshi | Entry-Level AI & Cloud Engineer',
      metaDescription: 'AI Engineer portfolio displaying machine learning projects, AWS certifications, hackathons, and technical skills.',
      keywords: ['AI Engineer', 'LangChain', 'AWS Certified', 'Machine Learning', 'Next.js', 'Generative AI'],
      ogImage: '/placeholders/placeholder-project.png',
      twitterImage: '/placeholders/placeholder-project.png',
      canonicalUrl: 'https://lavanyajoshi.dev'
    })
    console.log('SEO Settings seeded.')

    // 3. Seed Site Settings with full sectionOrdering and visible/recruiterVisible toggles
    await SiteSettings.create({
      siteName: 'Lavanya Joshi | AI Workspace',
      siteDescription: 'Futuristic AI engineer workspace and portfolio platform.',
      siteKeywords: ['AI', 'Machine Learning', 'Next.js', 'React', 'MongoDB'],
      ogImage: '/placeholders/placeholder-project.png',
      maintenanceMode: false,
      contactEmail: 'lavanyajoshi889@gmail.com',
      copyrightText: '© 2026 Lavanya Joshi. All rights reserved.',
      accentColor: '#00E5FF',
      secondaryColor: '#FF4FD8',
      recruiterModeEnabled: false,
      sectionSettings: [
        { sectionId: 'hero', visible: true, recruiterVisible: true, order: 1 },
        { sectionId: 'about', visible: true, recruiterVisible: true, order: 2 },
        { sectionId: 'projects', visible: true, recruiterVisible: true, order: 3 },
        { sectionId: 'skills', visible: true, recruiterVisible: true, order: 4 },
        { sectionId: 'certifications', visible: true, recruiterVisible: true, order: 5 },
        { sectionId: 'coding', visible: true, recruiterVisible: false, order: 6 },
        { sectionId: 'achievements', visible: true, recruiterVisible: false, order: 7 },
        { sectionId: 'learning-journey', visible: true, recruiterVisible: false, order: 8 },
        { sectionId: 'contact', visible: true, recruiterVisible: true, order: 9 }
      ]
    })
    console.log('Site settings seeded.')

    // 4. Seed Profile (Fresher Focus)
    await Profile.create({
      name: 'Lavanya Joshi',
      title: 'AI & Cloud Engineer',
      tagline: 'Building autonomous agents and intelligent workflows, one node at a time.',
      email: 'lavanyajoshi889@gmail.com',
      location: 'San Francisco, CA',
      profileImage: '',
      heroVideo: '',
      introAudio: '',
      resumeUrl: '/resume.html',
      isAvailableForWork: true,
      yearsOfExperience: 0, // Fresher
      highlights: [
        'AI Engineer',
        'AWS Certified',
        'Smart India Hackathon Participant',
        'B.Tech Student'
      ],
      socialLinks: {
        github: 'https://github.com/lavanyajoshi07',
        linkedin: 'https://linkedin.com/in/lavanyajoshi',
        twitter: 'https://twitter.com/lavanyajoshi',
        website: 'https://lavanyajoshi.dev',
        phone: '+1 (555) 019-2834',
        leetcode: 'https://leetcode.com/u/lavanyajoshi07/',
        devto: 'https://dev.to/lavanyajoshi07',
        medium: 'https://medium.com/@lavanyajoshi07',
      },
      currentFocus: [
        'AI Agents',
        'Generative AI',
        'Cloud Computing',
        'Backend Systems',
        'System Design'
      ]
    })
    console.log('Profile seeded.')


    // 6. Seed Tech Stack Settings
    await TechStackSettings.create({
      badgeText: 'Tech Stack',
      title: 'Technologies & Tools',
      subtitle: 'My technical ecosystem for building intelligent, scalable systems.',
      quote: 'The right tool is important, but the mindset to build and solve problems is everything.',
      categoriesEnabled: true,
      statsEnabled: true,
      quoteEnabled: true,
      animationsEnabled: true,
    })
    console.log('Tech Stack Settings seeded.')

    // 6b. Seed Technology Categories
    const aiCat = await TechnologyCategory.create({ name: 'AI & Machine Learning', slug: 'ai-ml', order: 1, active: true })
    const langCat = await TechnologyCategory.create({ name: 'Languages', slug: 'languages', order: 2, active: true })
    const frontCat = await TechnologyCategory.create({ name: 'Frontend', slug: 'frontend', order: 3, active: true })
    const backCat = await TechnologyCategory.create({ name: 'Backend & APIs', slug: 'backend', order: 4, active: true })
    const cloudCat = await TechnologyCategory.create({ name: 'DevOps & Cloud', slug: 'devops-cloud', order: 5, active: true })
    const dbCat = await TechnologyCategory.create({ name: 'Database', slug: 'database', order: 6, active: true })
    console.log('Technology Categories seeded.')

    // 6c. Seed Technologies
    await Technology.create([
      { name: 'Python', iconType: 'library', icon: 'python', categoryId: langCat._id, proficiency: 90, experience: '3+ Years', description: 'Primary language for ML, scripting, and backend workflows.', color: '#3776AB', displayOrder: 1, active: true, featured: true },
      { name: 'TypeScript', iconType: 'library', icon: 'typescript', categoryId: langCat._id, proficiency: 85, experience: '2 Years', description: 'Typing safety for robust frontend and Node backend development.', color: '#3178C6', displayOrder: 2, active: true, featured: true },
      { name: 'Next.js', iconType: 'library', icon: 'nextjs', categoryId: frontCat._id, proficiency: 80, experience: '2 Years', description: 'Full-stack framework for rendering premium React web applications.', color: '#000000', displayOrder: 3, active: true, featured: true },
      { name: 'LangChain', iconType: 'library', icon: 'langchain', categoryId: aiCat._id, proficiency: 85, experience: '1 Year', description: 'Orchestrating LLM chains, agentic state loops, and retrievals.', color: '#F25F22', displayOrder: 4, active: true, featured: true },
      { name: 'FastAPI', iconType: 'library', icon: 'fastapi', categoryId: backCat._id, proficiency: 85, experience: '2 Years', description: 'High-performance web API framework using Python type hints.', color: '#009688', displayOrder: 5, active: true, featured: true },
      { name: 'AWS', iconType: 'library', icon: 'aws', categoryId: cloudCat._id, proficiency: 75, experience: '1 Year', description: 'Deploying secure infrastructure using S3, Lambda, IAM, and EC2.', color: '#FF9900', displayOrder: 6, active: true, featured: true },
      { name: 'MongoDB', iconType: 'library', icon: 'mongodb', categoryId: dbCat._id, proficiency: 80, experience: '2 Years', description: 'Document database for flexible web and caching layers.', color: '#47A248', displayOrder: 7, active: true, featured: true }
    ])
    console.log('Technologies seeded.')

    // 6d. Seed Tech Stats
    await TechStats.create([
      { iconType: 'library', icon: 'code', value: '20+', label: 'Technologies', order: 1, active: true },
      { iconType: 'library', icon: 'terminal', value: '4+', label: 'Production Projects', order: 2, active: true },
      { iconType: 'library', icon: 'activity', value: '95%', label: 'Retrieval Accuracy', order: 3, active: true },
      { iconType: 'library', icon: 'database', value: '10K+', label: 'Documents Indexed', order: 4, active: true },
      { iconType: 'library', icon: 'cpu', value: 'Multi-Agent', label: 'Systems Developed', order: 5, active: true }
    ])
    console.log('Tech Stats seeded.')

    // 7. Seed Projects with case-study fields, metrics, and highlights
    await Project.create([
      {
        title: 'Agentic Support System',
        slug: 'agentic-support-workspace',
        shortDescription: 'Multi-agent customer support portal using LangGraph and FastAPI.',
        fullDescription: 'An automated ticket triage system that routes requests, writes replies, and verifies code fixes using autonomous LangGraph agents.',
        thumbnail: {
          image: '/placeholders/placeholder-project.png',
          alt: 'Agentic Support System Dashboard Thumbnail'
        },
        gallery: [
          { image: '/placeholders/placeholder-project.png', alt: 'Agentic Support System Triaging view' },
          { image: '/placeholders/placeholder-project.png', alt: 'Agentic Support System Logs view' }
        ],
        architectureDiagram: '/placeholders/placeholder-project.png',
        category: 'AI & Automation',
        status: 'completed',
        featured: true,
        featuredOrder: 1,
        isPublished: true,
        publishStatus: 'published',
        sortOrder: 1,
        duration: '3 Months',
        teamSize: 'Solo',
        techStack: ['FastAPI', 'LangGraph', 'OpenAI API', 'MongoDB', 'React'],
        tags: ['AI Agents', 'Automation', 'FastAPI'],
        searchKeywords: ['agent', 'support', 'langgraph', 'triage'],
        keyMetrics: [
          { value: '65%', label: 'Automated Triage' },
          { value: '4x', label: 'Faster Draft Generation' },
          { value: 'AI', label: 'Workflow Engine' }
        ],
        highlights: [
          'LangGraph orchestration for complex state loops',
          'Stateful agent memory for persistent conversation context',
          'FastAPI backend with background workers'
        ],
        problemStatement: 'Technical support teams spend 40% of their day routing tickets and responding to repetitive coding questions.',
        solution: 'Developed an autonomous multi-agent pipeline that reads, triages, executes code validations, and drafts replies.',
        challenges: 'Managing agent state loops and preventing agent hallucination when reading corrupted database inputs.',
        outcomes: 'Automated 65% of incoming ticket routing and reduced draft writing times by 4x.',
        githubUrl: 'https://github.com',
        demoUrl: 'https://google.com',
        documentationUrl: '',
        videoDemoUrl: '',
        showGithub: true,
        showDemo: true,
        showDocumentation: false,
        showVideoDemo: false,
        seoTitle: 'Agentic Support System | Lavanya Joshi',
        seoDescription: 'Autonomous customer support agent portal built with LangGraph and FastAPI.',
        seoKeywords: ['AI Agents', 'LangGraph', 'FastAPI', 'Customer Support Triage']
      },
      {
        title: 'RAG Knowledge Assistant',
        slug: 'rag-document-chat',
        shortDescription: 'Enterprise PDF query platform built with ChromaDB and Next.js.',
        fullDescription: 'High-performance retrieval-augmented generation engine supporting PDF parsing, text chunking, semantic search, and metadata source highlighting.',
        thumbnail: {
          image: '/placeholders/placeholder-project.png',
          alt: 'RAG Knowledge Assistant Chat Interface'
        },
        gallery: [
          { image: '/placeholders/placeholder-project.png', alt: 'RAG Knowledge Assistant Document Upload' }
        ],
        architectureDiagram: '/placeholders/placeholder-project.png',
        category: 'AI & Full Stack',
        status: 'completed',
        featured: true,
        featuredOrder: 2,
        isPublished: true,
        publishStatus: 'published',
        sortOrder: 2,
        duration: '2 Months',
        teamSize: 'Solo',
        techStack: ['Next.js', 'Python', 'ChromaDB', 'OpenAI Embeddings', 'LangChain'],
        tags: ['RAG', 'Vector Search', 'Next.js'],
        searchKeywords: ['rag', 'vector', 'chromadb', 'pdf'],
        keyMetrics: [
          { value: '95%', label: 'Retrieval Accuracy' },
          { value: '10K+', label: 'Pages Indexed' },
          { value: 'Zero', label: 'Hallucinations' }
        ],
        highlights: [
          'ChromaDB vector search for context alignment',
          'Semantic retrieval with parent-child chunk mapping',
          'Enterprise PDF querying with OCR parsing'
        ],
        problemStatement: 'Reading and query correlation across hundreds of pages of technical specifications is manual and slow.',
        solution: 'Built a custom RAG interface with vector storage and chunk-overlap configurations.',
        challenges: 'Resolving prompt loss in the middle of long contexts and handling complex tables inside scanned documents.',
        outcomes: 'Achieved 95% retrieval accuracy with direct line citation highlights.',
        githubUrl: 'https://github.com',
        demoUrl: 'https://google.com',
        documentationUrl: '',
        videoDemoUrl: '',
        showGithub: true,
        showDemo: true,
        showDocumentation: false,
        showVideoDemo: false,
        seoTitle: 'RAG Knowledge Assistant | Lavanya Joshi',
        seoDescription: 'Enterprise RAG solution for PDF questioning using ChromaDB and LangChain.',
        seoKeywords: ['RAG', 'ChromaDB', 'LangChain', 'Semantic Search', 'Vector Database']
      }
    ])
    console.log('Projects seeded.')

    // 8. Seed Certifications (Featuring highlighted AWS certification)
    await Certification.create([
      {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services (AWS)',
        logoMode: 'auto',
        tags: ['Cloud Computing', 'IAM Security', 'AWS Infrastructure', 'S3/EC2/Lambda'],
        credentialUrl: 'https://aws.amazon.com',
        certificateUrl: 'https://aws.amazon.com',
        featured: true,
        sortOrder: 1,
        isPublished: true
      },
      {
        title: 'Deep Learning Specialization',
        issuer: 'Coursera (DeepLearning.AI)',
        logoMode: 'auto',
        tags: ['Neural Networks', 'Computer Vision', 'NLP', 'Transformers'],
        credentialUrl: 'https://coursera.org',
        certificateUrl: 'https://coursera.org',
        featured: true,
        sortOrder: 2,
        isPublished: true
      }
    ])
    console.log('Certifications seeded.')

    // 9. Seed Achievements & Categories & Settings
    const catHackathons = await AchievementCategory.create({ name: 'Hackathons', slug: 'hackathons', icon: '🏆', color: '#00E5FF', description: 'Collaborative programming events and hack sprints', displayOrder: 1, coverImage: '/placeholders/placeholder-project.png' })
    const catCompetitions = await AchievementCategory.create({ name: 'Competitions', slug: 'competitions', icon: '🥇', color: '#FF4FD8', description: 'Competitive coding rounds and technical events', displayOrder: 2, coverImage: '/placeholders/placeholder-project.png' })
    const catDSA = await AchievementCategory.create({ name: 'DSA & Coding', slug: 'dsa-coding', icon: '💻', color: '#7C3AED', description: 'Data structures, algorithms and online judge milestones', displayOrder: 3, coverImage: '/placeholders/placeholder-project.png' })
    const catMemberships = await AchievementCategory.create({ name: 'Memberships', slug: 'memberships', icon: '👑', color: '#E11D48', description: 'Professional bodies and student chapters', displayOrder: 4, coverImage: '/placeholders/placeholder-project.png' })
    const catResearch = await AchievementCategory.create({ name: 'Research', slug: 'research', icon: '📚', color: '#10B981', description: 'Academic papers and publication standouts', displayOrder: 5, coverImage: '/placeholders/placeholder-project.png' })
    const catLeadership = await AchievementCategory.create({ name: 'Leadership', slug: 'leadership', icon: '🎓', color: '#F59E0B', description: 'Student lead, clubs management and speaker logs', displayOrder: 6, coverImage: '/placeholders/placeholder-project.png' })

    await AchievementSettings.create({
      title: 'ACHIEVEMENTS & AWARDS',
      subtitle: 'Recognitions, competitions, memberships, hackathons, and engineering milestones.',
      showCategoryGrid: true,
      animationsEnabled: true,
    })

    await Achievement.create([
      {
        title: 'Smart India Hackathon Finalist',
        organization: 'Ministry of Education',
        description: 'Selected in top 5 teams out of 100+ submissions for building an automated disaster relief routing assistant.',
        date: 'Dec 2024',
        year: '2024',
        category: catHackathons._id,
        icon: '🏆',
        badgeColor: '#00E5FF',
        showInCategory: true,
        displayOrder: 1,
        achievementImage: '/placeholders/placeholder-project.png',
        achievementUrl: 'https://google.com',
        tags: ['Hackathon', 'Disaster Relief', 'React'],
        metricValue: 'Top 5',
        metricLabel: 'Finalist'
      },
      {
        title: 'University Hackathon Winner',
        organization: 'Computer Science Society',
        description: 'Won 1st place for designing a local-first conversational voice assistant for elder care.',
        date: 'Apr 2024',
        year: '2024',
        category: catHackathons._id,
        icon: '🏆',
        badgeColor: '#00E5FF',
        showInCategory: true,
        displayOrder: 2,
        achievementImage: '/placeholders/placeholder-project.png',
        achievementUrl: 'https://google.com',
        tags: ['Elder Care', 'Voice Assistant', 'AI'],
        metricValue: '1st Place',
        metricLabel: 'Winner'
      },
      {
        title: '300+ Problems Solved',
        organization: 'LeetCode & CodeChef',
        description: 'Mastered core algorithmic paradigms, solving over 300 problems across online judge indices.',
        date: 'May 2024',
        year: '2024',
        category: catDSA._id,
        icon: '💻',
        badgeColor: '#7C3AED',
        showInCategory: true,
        displayOrder: 3,
        tags: ['DSA', 'LeetCode', 'Algorithms'],
        metricValue: '300+',
        metricLabel: 'Problems Solved'
      }
    ])
    console.log('Achievements seeded.')


    // 12. Seed FAQs
    await Faq.create([
      {
        question: 'Are you open to immediate internship opportunities?',
        answer: 'Yes! I am actively looking for Fall 2026 or Winter 2026/27 AI Engineer internships. I am fully authorized to work in the US and open to relocation or remote positions.',
        order: 1,
        enabled: true
      },
      {
        question: 'What is your response turnaround time for recruiters?',
        answer: 'I typically respond to emails or LinkedIn inquiries within 2 to 6 hours during weekdays.',
        order: 2,
        enabled: true
      },
      {
        question: 'Do you have hands-on experience building multi-agent systems?',
        answer: 'Yes! My LangGraph Customer Support portal (see Projects section) uses dynamic agent supervisors, RAG vector lookups, and state loops, fully built by me.',
        order: 3,
        enabled: true
      }
    ])
    console.log('FAQs seeded.')

    // 13. Seed Activity Logs
    await ActivityLog.create([
      { text: 'Portfolio redesigned for recruiter review', date: '2026-06', icon: 'Layout', order: 1 },
      { text: 'Completed multi-agent Customer Support portal prototype', date: '2026-05', icon: 'Terminal', order: 2 },
      { text: 'Earned AWS Certified Cloud Practitioner credential', date: '2025-02', icon: 'Award', order: 3 }
    ])
    console.log('Activity logs seeded.')

    // 14. Seed Future Goals
    await FutureGoal.create([
      { text: 'AWS Solutions Architect Associate Certification', category: 'Cloud', completed: false, order: 1 },
      { text: 'Contribute core agents to LangChain open-source packages', category: 'AI', completed: false, order: 2 },
      { text: 'Develop and launch a SaaS document-parsing service', category: 'Product', completed: false, order: 3 }
    ])
    console.log('Future goals seeded.')

    // 15. Seed Community Items
    await CommunityItem.create([
      {
        title: 'Open Source Contributor - LangChain Agent Modules',
        description: 'Created prompt examples and helper RAG tools inside LangChain templates.',
        category: 'open_source',
        date: '2025-03',
        link: 'https://github.com',
        enabled: true,
        order: 1
      },
      {
        title: 'Conducted GenAI Student Workshop',
        description: 'Taught 40+ college students how to set up their first semantic RAG server in Python.',
        category: 'workshop',
        date: '2025-01',
        link: '',
        enabled: true,
        order: 2
      }
    ])
    console.log('Community items seeded.')

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()
