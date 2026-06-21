import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import connectDB from '@/lib/db'
import { Resume } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'
import { resumeSchema } from '@/lib/validation'

// ============================================================
// DEFAULT RESUME SEED DATA
// ============================================================
const defaultResume = {
  name: 'Lavanya Joshi',
  email: 'lavanyajoshi889@gmail.com',
  phone: '+91-8279806809',
  github: 'https://github.com/lavanyajoshi07',
  linkedin: 'https://linkedin.com/in/lavanyajoshi889',
  address: 'Dehradun, Uttarakhand, India',
  summary: 'Performance‑driven Full‑Stack Developer and B.Tech Computer Science Engineering (AI Full Stack) sophomore at Graphic Era Hill University with strong expertise in Next.js, TypeScript, Tailwind CSS, Java, JavaFX, and Capacitor. Skilled in designing secure RESTful APIs, implementing authentication and encryption, and optimizing MongoDB Atlas and PostgreSQL databases. Adept at integrating external APIs and building scalable, cloud‑deployed applications. Passionate about Machine Learning, NLP, and Generative AI, with a focus on delivering secure, high‑performance, and intelligent solutions.',
  skills: [
    { label: 'Languages:', value: 'JavaScript, TypeScript, Python, Java, C, C++' },
    { label: 'Frontend:', value: 'React.js, Next.js, HTML5, CSS3, Tailwind CSS' },
    { label: 'Backend & Databases:', value: 'Node.js, Express.js, Next.js API Routes, MongoDB, PostgreSQL, MySQL' },
    { label: 'Tools & Platforms:', value: 'Git, GitHub, VS Code, AWS , Vercel, Render' },
    { label: 'Core Concepts:', value: 'Data Structures & Algorithms (DSA), OOP, Database Management Systems (DBMS), REST APIs, RBAC Security, Machine Learning, NLP, Software Engineering Lifecycle' }
  ],
  projects: [
    {
      title: 'PeriodTracker – Cycle Tracking & Health Analytics',
      technologies: 'Next.js, TypeScript, Tailwind CSS, MongoDB, Recharts, NextAuth, Capacitor',
      bullets: [
        'Health Analytics: Built a privacy-focused cycle tracking platform with Recharts to visualize biological logs into trends and insights.',
        'Secure Authentication: Implemented NextAuth for session persistence and protected user metrics with encrypted storage.',
        'Mobile Deployment: Integrated Capacitor to package the web app into a native Android application for wider accessibility.',
        'Serverless APIs: Designed Next.js API Routes for secure, high-throughput log aggregation directly connected to MongoDB.'
      ]
    },
    {
      title: 'Multithreaded Chat Application',
      technologies: 'Java, JavaFX, PostgreSQL, Socket Programming',
      bullets: [
        'Concurrent Communication: Developed a multithreaded client-server chat system supporting multiple simultaneous users over TCP sockets.',
        'Data Security: Implemented PBKDF2 password hashing and AES-GCM-256 encryption for secure authentication and messaging.',
        'Database Integration: Utilized PostgreSQL for persistent user data storage and message history tracking.',
        'UI Design: Built an interactive JavaFX interface for real-time chat and user management.'
      ]
    },
    {
      title: 'ReviewLens AI – Customer Review Analysis Platform',
      technologies: 'Next.js, TypeScript, Tailwind CSS, MongoDB Atlas, Mongoose, Next.js API Routes, Google Gemini API, Recharts, Vercel',
      bullets: [
        'Sentiment Analysis: Implemented NLP-based classification of customer reviews into Positive, Neutral, and Negative categories.',
        'Category Detection: Automated feedback tagging for Food, Cleanliness, Location, Host, Value, and Experience.',
        'AI Integration: Leveraged Google Gemini API to generate professional response suggestions for owners.',
        'Dashboard Analytics: Designed summary cards and Recharts visualizations for review trends and statistics.',
        'Scalable Deployment: Deployed the platform on Vercel with optimized API routes and MongoDB Atlas storage.'
      ]
    }
  ],
  experience: [
    {
      role: 'Team Lead – Multithreaded Chat Application (PBL Project)',
      company: 'Graphic Era Hill University',
      duration: '01/2026 – 04/2026',
      bullets: [
        'Led a 4-member team to design and deploy a secure multithreaded chat system using Java, JavaFX, and PostgreSQL.',
        'Applied Agile and SDLC principles to manage sprints, code reviews, and version control via Git.',
        'Implemented database schemas and data privacy protocols ensuring encrypted communication.',
        'Delivered a production-ready system with measurable results — reduced message latency by 40% and improved user concurrency handling.'
      ]
    },
    {
      role: 'Independent Full‑Stack Developer – Personal Projects',
      company: 'Dehradun, Uttarakhand',
      duration: '2025 – Present',
      bullets: [
        'Developed and deployed Period Tracker and ReviewLens AI using Next.js, TypeScript, MongoDB, and RESTful APIs.',
        'Integrated Google Gemini API and implemented RBAC Security for user authentication and data protection.',
        'Applied Agile workflows and SDLC best practices to ensure scalable, maintainable codebases.',
        'Achieved measurable outcomes — improved API response time by 30% and enhanced data visualization accuracy by 25%.'
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech) in Computer Science Engineering – AI Full Stack Focus',
      institution: 'Graphic Era Hill University | Dehradun, Uttarakhand',
      duration: 'Expected Graduation: 05/2028',
      description: 'Specializing in the AI Full Stack program. Laying a solid foundation in low-level system design and algorithms.',
      bullets: [
        'Academic Performance / Grade: 9.2 GPA Equivalent (Specialist Focus)'
      ],
      coursework: 'Data Structures & Algorithms, Object-Oriented Programming (OOP), Database Management Systems (DBMS), Operating Systems, Computer Networks, Software Engineering, Machine Learning, Artificial Intelligence, Web Applications'
    }
  ],
  certifications: [
    'NPTEL – Programming in C++ and C',
    'AWS Cloud CLI Essentials',
    'DSA & C++ Bootcamp',
    'Git & GitHub Bootcamp',
    'JavaScript Bootcamp',
    'Google AI for Data Analysis',
    'Google AI for Research and Insights',
    'Machine Learning Workshop'
  ],
  achievements: [
    'Successfully developed and deployed personal full-stack applications including Period Tracker and ReviewLens AI, showcasing expertise in Next.js, TypeScript, MongoDB, and API integration.',
    'Led a team in building a Multithreaded Chat Application, coordinating development tasks, implementing secure authentication, and ensuring delivery of a production-ready system.',
    'Applied professional software engineering practices including Git source control, RESTful API design, and schema modeling for both SQL and NoSQL databases.',
    'Serving as an active IEEE member in the Designing Team, managing poster design workflows and guiding the design team for technical events.',
    'Integrated external AI APIs (Google Gemini) and deployed scalable applications on cloud platforms (Vercel, AWS), demonstrating adaptability in modern development workflows.',
    'Solved 200+ data structure and algorithm problems on LeetCode, strengthening system design and problem-solving skills.'
  ],
  softSkills: [
    { title: 'Leadership', description: 'Guided project teams and IEEE design team, ensuring collaboration and timely delivery.' },
    { title: 'Communication', description: 'Presented technical solutions clearly to peers and faculty, bridging design and development teams.' },
    { title: 'Problem-Solving', description: 'Tackled complex coding challenges and optimized system workflows under tight deadlines.' },
    { title: 'Collaboration', description: 'Worked effectively in team-based projects, applying Agile practices for smooth coordination.' },
    { title: 'Adaptability', description: 'Quickly learned new frameworks and tools (Next.js, Capacitor, Gemini API) to deliver production-ready solutions.' }
  ]
}

// ============================================================
// RESUME HTML GENERATOR TEMPLATE
// ============================================================
function generateResumeHtml(data: any): string {
  // Map skills to HTML
  const skillsHtml = (data.skills || []).map((skill: any) => `
      <div class="skills-row">
        <span class="skills-label">${skill.label || ''}</span>
        <span class="skills-value">${skill.value || ''}</span>
      </div>
  `).join('')

  // Map projects to HTML
  const projectsHtml = (data.projects || []).map((project: any) => {
    const bulletsList = (project.bullets || []).map((bullet: string) => `      <li>${bullet}</li>`).join('\n')
    return `
  <div class="project-item">
    <div class="project-header">
      <span>${project.title || ''}</span>
      <span class="project-tech">${project.technologies || ''}</span>
    </div>
    <ul>
${bulletsList}
    </ul>
  </div>`
  }).join('\n')

  // Map experience to HTML
  const experienceHtml = (data.experience || []).map((exp: any) => {
    const bulletsList = (exp.bullets || []).map((bullet: string) => `      <li>${bullet}</li>`).join('\n')
    return `
  <div class="experience-item">
    <div class="experience-header">
      <span>${exp.role || ''} – ${exp.company || ''}</span>
      <span class="experience-date">${exp.duration || ''}</span>
    </div>
    <ul>
${bulletsList}
    </ul>
  </div>`
  }).join('\n')

  // Map education to HTML
  const educationHtml = (data.education || []).map((edu: any) => {
    const bulletsList = (edu.bullets || []).map((bullet: string) => `      <li>${bullet}</li>`).join('\n')
    return `
  <div class="education-item">
    <span class="institution">${edu.institution || ''}</span>
    <span class="grad-date">${edu.duration || ''}</span>
  </div>
  <div class="degree" style="font-weight: 500; font-size: 9.5pt; color: #0f172a; margin-top: 1pt;">
    ${edu.degree || ''}
  </div>
  ${edu.description ? `<p style="font-size: 9pt; color: #334155; margin-top: 2pt; text-align: left;">${edu.description}</p>` : ''}
  ${bulletsList ? `<ul style="margin-top: 2.5pt; font-size: 9pt; margin-left: 12pt; list-style-type: disc;">\n${bulletsList}\n    </ul>` : ''}
  ${edu.coursework ? `<div class="coursework" style="margin-top: 2.5pt;"><strong>Relevant Coursework:</strong> ${edu.coursework}</div>` : ''}
  <div style="height: 8pt;"></div>`
  }).join('\n')

  // Map certifications to HTML
  const certsHtml = (data.certifications || []).map((cert: string) => `• ${cert}`).join(' ')

  // Map achievements to HTML
  const achievementsHtml = (data.achievements || []).map((ach: string) => `    <li>${ach}</li>`).join('\n')

  // Map soft skills to HTML
  const softSkillsHtml = (data.softSkills || []).map((ss: any) => `    <li><strong>${ss.title}:</strong> ${ss.description}</li>`).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" />
  <title>${data.name || 'Resume'}</title>
  <!-- Import Inter Font for a modern, premium look -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Reset and general page layout */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      color: #1e293b; /* Slate-800 for high-end neutral text */
      background-color: #ffffff;
      line-height: 1.4;
      font-size: 10pt;
      padding: 0.5in 0.6in;
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
    }
    
    /* Document header styling */
    header {
      text-align: center;
      margin-bottom: 12pt;
    }
    h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a; /* Slate-900 */
      text-transform: uppercase;
      margin-bottom: 3pt;
      letter-spacing: 0.5pt;
    }
    .contact-info {
      font-size: 9pt;
      color: #64748b; /* Slate-500 */
      margin-bottom: 4pt;
      font-weight: 400;
    }
    .contact-info a {
      color: #0284c7; /* Sky-700 accent for links */
      text-decoration: none;
      font-weight: 500;
    }
    .contact-info a:hover {
      text-decoration: underline;
    }
    
    /* Section structures */
    section {
      margin-bottom: 12pt;
    }
    h2 {
      font-size: 11pt;
      font-weight: 600;
      color: #0f172a;
      text-transform: uppercase;
      border-bottom: 2px solid #e2e8f0; /* Soft slate border */
      padding-bottom: 2pt;
      margin-bottom: 6pt;
      letter-spacing: 0.5pt;
    }
    
    p {
      margin-bottom: 4pt;
      text-align: justify;
      color: #334155; /* Slate-700 */
    }
    
    /* Project styling */
    .project-item {
      margin-bottom: 8pt;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2pt;
    }
    .project-tech {
      font-style: italic;
      font-weight: 400;
      font-size: 9pt;
      color: #64748b;
    }
    
    /* Experience styling */
    .experience-item {
      margin-bottom: 8pt;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2pt;
    }
    .experience-date {
      font-weight: 400;
      font-size: 9pt;
      color: #64748b;
    }
    
    /* Bullet lists */
    ul {
      margin-left: 12pt;
      margin-bottom: 4pt;
      list-style-type: square;
    }
    li {
      margin-bottom: 2pt;
      padding-left: 2pt;
      color: #334155;
    }
    
    /* Education & Certs details */
    .education-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2pt;
    }
    .institution {
      font-weight: 600;
      color: #0f172a;
    }
    .grad-date {
      font-weight: 600;
      color: #0f172a;
    }
    .coursework {
      margin-top: 2pt;
      font-size: 9pt;
      color: #64748b;
    }

    /* Skills details */
    .skills-grid {
      display: table;
      width: 100%;
      margin-top: 2pt;
    }
    .skills-row {
      display: table-row;
    }
    .skills-label {
      display: table-cell;
      font-weight: 600;
      width: 1.8in;
      padding-bottom: 4pt;
      color: #0f172a;
    }
    .skills-value {
      display: table-cell;
      padding-bottom: 4pt;
      color: #334155;
    }
    
    /* Print optimizations */
    @media print {
      body {
        width: 100%;
        margin: 0;
        padding: 0.4in 0.5in;
        font-size: 10pt;
        color: #000000 !important;
      }
      a {
        color: #000000 !important;
      }
      h2 {
        border-bottom-color: #000000 !important;
        page-break-after: avoid;
      }
      .project-item, .skills-row, .education-item, .experience-item {
        page-break-inside: avoid;
      }
      .download-btn-container {
        display: none !important;
      }
    }

    /* Floating Action Panel for download & print */
    .download-btn-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      gap: 8px;
      align-items: center;
      background-color: rgba(15, 23, 42, 0.9); /* Glassmorphism Slate-900 */
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 6px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
    .download-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #0284c7; /* Sky-600 */
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 9999px;
      font-family: 'Inter', sans-serif;
      font-size: 9.5pt;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .download-btn:hover {
      background-color: #0369a1; /* Sky-700 */
      transform: translateY(-1px);
    }
    .download-btn svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
    }
    .print-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      color: #94a3b8; /* Slate-400 */
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .print-btn:hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .print-btn svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
    }
  </style>
</head>
<body>

  <header>
    <h1>${data.name || ''}</h1>
    <div class="contact-info">
      ${data.email ? `Email: <a href="mailto:${data.email}">${data.email}</a>` : ''}
      ${data.phone ? ` | Phone: ${data.phone}` : ''}
      ${data.github ? ` | GitHub: <a href="${data.github}" target="_blank">${data.github.replace('https://', '').replace('http://', '')}</a>` : ''}
      ${data.linkedin ? ` | LinkedIn: <a href="${data.linkedin}" target="_blank">${data.linkedin.replace('https://', '').replace('http://', '')}</a>` : ''}
    </div>
    ${data.address ? `<div class="address">${data.address}</div>` : ''}
  </header>

  ${data.summary ? `
  <section id="summary">
    <h2>Professional Summary</h2>
    <p>${data.summary}</p>
  </section>` : ''}

  ${skillsHtml ? `
  <section id="skills">
    <h2>Technical Skills</h2>
    <div class="skills-grid">
      ${skillsHtml}
    </div>
  </section>` : ''}

  ${experienceHtml ? `
  <section id="experience">
    <h2>Work Experience</h2>
    ${experienceHtml}
  </section>` : ''}

  ${projectsHtml ? `
  <section id="projects">
    <h2>Academic & Personal Projects</h2>
    ${projectsHtml}
  </section>` : ''}

  ${educationHtml ? `
  <section id="education">
    <h2>Education</h2>
    ${educationHtml}
  </section>` : ''}

  ${certsHtml ? `
  <section id="certifications">
    <h2>Certifications</h2>
    <p style="font-size: 9pt; text-align: left; line-height: 1.5; color: #334155;">
      ${certsHtml}
    </p>
  </section>` : ''}

  ${achievementsHtml ? `
  <section id="achievements">
    <h2>Key Achievements</h2>
    <ul>
      ${achievementsHtml}
    </ul>
  </section>` : ''}

  ${softSkillsHtml ? `
  <section id="soft-skills">
    <h2>Soft Skills</h2>
    <ul>
      ${softSkillsHtml}
    </ul>
  </section>` : ''}

  <!-- Floating Action Bar for download & print (hidden during print) -->
  <div class="download-btn-container">
    <button onclick="downloadPDF()" class="download-btn" title="Download PDF">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download PDF
    </button>

    <button onclick="window.print()" class="print-btn" title="Print Resume">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
    </button>
  </div>

  <script>
  function downloadPDF() {
      window.print();
  }
  </script>

</body>
</html>
`
}

// ============================================================
// API ENDPOINTS
// ============================================================
export async function GET() {
  try {
    await connectDB()
    let resume = await Resume.findOne().lean()

    if (!resume) {
      // Create and return default values if database is empty
      resume = await Resume.create(defaultResume)
    }

    return successResponse(resume)
  } catch (error) {
    console.error('Error fetching resume:', error)
    return errorResponse('Failed to fetch resume data', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    // 1. Verify administrative authorization
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    // 2. Parse and validate the request body
    const body = await req.json()
    const validation = resumeSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(
        `Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`,
        400
      )
    }

    const validatedData = validation.data
    await connectDB()

    // 3. Update the resume document in MongoDB
    const resume = await Resume.findOneAndUpdate(
      {},
      { $set: validatedData },
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    )

    // 4. Overwrite /public/resume.html on disk
    const htmlContent = generateResumeHtml(resume)
    const filePath = path.join(process.cwd(), 'public', 'resume.html')
    await fs.writeFile(filePath, htmlContent, 'utf-8')

    // 5. Trigger static page revalidation
    revalidatePortfolio()
    
    return successResponse(resume, 'Resume updated and resume.html generated successfully')
  } catch (error) {
    console.error('Error updating resume:', error)
    return errorResponse('Failed to update resume', 500)
  }
}
