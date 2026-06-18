import connectDB from './db'
import { AdminUser, Profile, SiteSettings, Skill, Project } from '../models'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected.')

    // 1. Seed Admin User
    const adminEmail = 'admin@portfolio.com'
    const existingAdmin = await AdminUser.findOne({ email: adminEmail })

    if (!existingAdmin) {
      console.log('Creating admin user...')
      const hashedPassword = await bcrypt.hash('AdminSecure123!', 10)
      await AdminUser.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Jane Doe',
        role: 'super_admin',
        avatar: '/placeholders/placeholder-cert.png',
      })
      console.log('Admin user created successfully.')
    } else {
      console.log('Admin user already exists.')
    }

    // 2. Seed Site Settings
    const existingSettings = await SiteSettings.findOne()
    if (!existingSettings) {
      console.log('Creating default site settings...')
      await SiteSettings.create({
        siteName: 'Jane Doe | AI Research Engineer',
        siteDescription: 'Futuristic AI engineer workspace and portfolio platform.',
        siteKeywords: ['AI', 'Machine Learning', 'Next.js', 'React', 'MongoDB'],
        ogImage: '/placeholders/placeholder-project.png',
        maintenanceMode: false,
        contactEmail: 'admin@portfolio.com',
        copyrightText: '© 2026 Jane Doe. All rights reserved.',
        accentColor: '#00E5FF',
        secondaryColor: '#FF4FD8',
      })
      console.log('Site settings created.')
    } else {
      console.log('Site settings already exist.')
    }

    // 3. Seed Profile
    const existingProfile = await Profile.findOne()
    if (!existingProfile) {
      console.log('Creating default profile...')
      await Profile.create({
        name: 'Jane Doe',
        title: 'AI & Full-Stack Research Engineer',
        tagline: 'Architecting intelligent workflows, one model and application at a time.',
        bio: 'I am a computer science student specializing in machine learning pipelines, full-stack Next.js web applications, and autonomous agents. Passionate about AI safety, neural rendering, and high-performance computing.',
        email: 'admin@portfolio.com',
        location: 'San Francisco, CA',
        profileImage: '/placeholders/placeholder-cert.png',
        heroVideo: '',
        introAudio: '',
        resumeUrl: '',
        isAvailableForWork: true,
        yearsOfExperience: 2,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          website: 'https://portfolio.com',
        },
        education: [
          {
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science (AI Track)',
            startYear: 2022,
            endYear: 2026,
            current: true,
            gpa: '4.0',
            description: 'Specialization in neural network architectures and distributed systems.',
          },
        ],
        careerGoals: 'To bridge the gap between large models and practical, intuitive, edge-deployed software applications.',
        learningJourney: 'Started building web applications in high school, transition to deep learning after researching transformers in 2023.',
      })
      console.log('Profile created.')
    } else {
      console.log('Profile already exists.')
    }

    // 4. Seed Default Skill to prevent blank screens
    const existingSkill = await Skill.findOne()
    if (!existingSkill) {
      console.log('Creating default skills...')
      await Skill.create([
        { name: 'TypeScript', category: 'languages', level: 90, yearsOfExperience: 3, featured: true, order: 1 },
        { name: 'Python', category: 'languages', level: 95, yearsOfExperience: 4, featured: true, order: 2 },
        { name: 'Next.js', category: 'frontend', level: 85, yearsOfExperience: 2, featured: true, order: 3 },
        { name: 'PyTorch', category: 'ai_ml', level: 80, yearsOfExperience: 2, featured: true, order: 4 },
        { name: 'MongoDB', category: 'database', level: 75, yearsOfExperience: 2, featured: false, order: 5 },
      ])
      console.log('Default skills created.')
    }

    // 5. Seed Default Project to prevent blank screens
    const existingProject = await Project.findOne()
    if (!existingProject) {
      console.log('Creating default projects...')
      await Project.create([
        {
          slug: 'neural-editor',
          title: 'Neural Workspace Editor',
          description: 'A collaborative code editor enriched with fine-tuned LLM agents.',
          longDescription: 'An interactive browser IDE supporting real-time multi-user editing, visual code graphs, and offline-first autonomous agent code-completions using lightweight client-side transformers.',
          coverImage: '/placeholders/placeholder-project.png',
          technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'Tailwind CSS', 'ONNX Runtime'],
          category: 'AI Tooling',
          tags: ['AI', 'Web Dev', 'Editor'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://github.com',
          featured: true,
          status: 'completed',
          startDate: '2025-01',
          endDate: '2025-05',
          challenges: ['Optimizing client-side model latency', 'Sync conflict resolution'],
          lessons: ['Learned custom Web Worker routing', 'Mastered operational transformation algorithms'],
          features: ['Real-time sync', 'Auto-agent completion', 'Canvas graph visualizations'],
          order: 1,
        },
      ])
      console.log('Default projects created.')
    }

    console.log('Seeding complete successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()
