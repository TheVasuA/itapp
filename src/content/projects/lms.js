// Project: Learning Management System (LMS).
//
// Courses, lessons, progress tracking, and quizzes.
// Stack: Next.js / Python (Django) / PostgreSQL + Redis / AWS.
// Key design: content CDN, progress tracking store, video streaming integration.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'lms',
  title: 'Learning Management System',
  icon: 'GraduationCap',
  summary:
    'Courses, lessons, progress tracking, and quizzes.',
  difficulty: 'Intermediate',
  tags: ['education', 'video', 'progress'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SSR course pages with video player and progress UI.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Python (Django)',
          icon: 'Server',
          reason: 'Mature web framework with ORM and admin panel.',
          languageKey: 'python',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Courses, enrollments, progress, and quiz results.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Session cache and real-time progress tracking.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'AWS (S3 + CloudFront)',
          icon: 'Cloud',
          reason: 'Video and content CDN for global learner access.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'learner', label: 'Learner UI', layer: 'client', icon: 'GraduationCap' },
      { id: 'admin', label: 'Admin Panel', layer: 'client', icon: 'Settings' },
      { id: 'api', label: 'Course API', layer: 'service', icon: 'Server' },
      { id: 'progress', label: 'Progress Tracker', layer: 'service', icon: 'BarChart' },
      { id: 'video', label: 'Video Worker', layer: 'worker', icon: 'Film' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
      { id: 'cdn', label: 'Content CDN', layer: 'data', icon: 'Cloud' },
    ],
    edges: [
      { from: 'learner', to: 'api', label: 'HTTPS' },
      { from: 'admin', to: 'api', label: 'manage' },
      { from: 'api', to: 'pg', label: 'query' },
      { from: 'api', to: 'progress', label: 'track' },
      { from: 'progress', to: 'pg', label: 'persist' },
      { from: 'video', to: 'cdn', label: 'deliver' },
      { from: 'learner', to: 'cdn', label: 'stream' },
    ],
  },
};

export default project;
