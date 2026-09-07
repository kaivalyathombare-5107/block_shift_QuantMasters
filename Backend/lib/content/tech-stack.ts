import type { TechStackItem } from '@/types';

// PLACEHOLDER: adjust to reflect your actual skills, experience, and proficiencies.
export const TECH_STACK: TechStackItem[] = [
  // Languages
  {
    name: 'Python',
    category: 'Languages',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.5,
    iconSlug: 'python',
    tags: ['backend', 'ai', 'data-science', 'scripting'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'TypeScript',
    category: 'Languages',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.0,
    iconSlug: 'typescript',
    tags: ['frontend', 'backend', 'type-system', 'node'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'JavaScript',
    category: 'Languages',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.5,
    iconSlug: 'javascript',
    tags: ['web', 'frontend', 'es6', 'runtimes'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'C++',
    category: 'Languages',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'cplusplus',
    tags: ['systems', 'algorithms', 'embedded', 'performance'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Java',
    category: 'Languages',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'java',
    tags: ['oop', 'enterprise', 'backend'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'SQL',
    category: 'Languages',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.5,
    iconSlug: 'postgresql',
    tags: ['database', 'queries', 'relational', 'analytics'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Bash',
    category: 'Languages',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'gnubash',
    tags: ['cli', 'automation', 'linux', 'devops'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Frameworks
  {
    name: 'React',
    category: 'Frameworks',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.0,
    iconSlug: 'react',
    tags: ['frontend', 'ui', 'hooks', 'spa'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Next.js',
    category: 'Frameworks',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 2.5,
    iconSlug: 'next-dot-js',
    tags: ['fullstack', 'ssr', 'app-router', 'react'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'FastAPI',
    category: 'Frameworks',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'fastapi',
    tags: ['backend', 'python', 'rest-api', 'async'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Express',
    category: 'Frameworks',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.5,
    iconSlug: 'express',
    tags: ['backend', 'node', 'microservices', 'apis'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'PyTorch',
    category: 'Frameworks',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'pytorch',
    tags: ['machine-learning', 'deep-learning', 'tensors', 'gpu'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Libraries
  {
    name: 'NumPy',
    category: 'Libraries',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.0,
    iconSlug: 'numpy',
    tags: ['math', 'arrays', 'data-analysis'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Pandas',
    category: 'Libraries',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.0,
    iconSlug: 'pandas',
    tags: ['dataframes', 'data-cleaning', 'etl'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'scikit-learn',
    category: 'Libraries',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'scikit-learn',
    tags: ['ml', 'classification', 'regression', 'clustering'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Tailwind CSS',
    category: 'Libraries',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 2.5,
    iconSlug: 'tailwindcss',
    tags: ['styling', 'css', 'responsive-design'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Framer Motion',
    category: 'Libraries',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 1.5,
    iconSlug: 'framer',
    tags: ['animations', 'gestures', 'react'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // AI & ML
  {
    name: 'TensorFlow',
    category: 'AI_ML',
    proficiencyLevel: 'Familiar',
    yearsOfExperience: 1.5,
    iconSlug: 'tensorflow',
    tags: ['neural-networks', 'deep-learning'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Hugging Face',
    category: 'AI_ML',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'huggingface',
    tags: ['transformers', 'nlp', 'llm', 'models'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'LangChain',
    category: 'AI_ML',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 1.5,
    iconSlug: 'langchain',
    tags: ['rag', 'agents', 'llm-orchestration'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'OpenCV',
    category: 'AI_ML',
    proficiencyLevel: 'Familiar',
    yearsOfExperience: 1.0,
    iconSlug: 'opencv',
    tags: ['computer-vision', 'image-processing'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Cloud
  {
    name: 'AWS',
    category: 'Cloud',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'amazonwebservices',
    tags: ['cloud', 's3', 'lambda', 'ec2'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Google Cloud',
    category: 'Cloud',
    proficiencyLevel: 'Familiar',
    yearsOfExperience: 1.5,
    iconSlug: 'googlecloud',
    tags: ['gcp', 'cloud-run', 'bigquery'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Vercel',
    category: 'Cloud',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 2.5,
    iconSlug: 'vercel',
    tags: ['edge', 'serverless', 'deployments'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Docker',
    category: 'Cloud',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'docker',
    tags: ['containers', 'virtualization', 'ci-cd'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Databases
  {
    name: 'PostgreSQL',
    category: 'Databases',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 2.5,
    iconSlug: 'postgresql',
    tags: ['relational', 'acid', 'indexing', 'jsonb'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'MongoDB',
    category: 'Databases',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'mongodb',
    tags: ['nosql', 'document-store', 'aggregation'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Redis',
    category: 'Databases',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'redis',
    tags: ['cache', 'in-memory', 'pub-sub', 'rate-limiting'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Pinecone',
    category: 'Databases',
    proficiencyLevel: 'Familiar',
    yearsOfExperience: 1.0,
    iconSlug: 'pinecone',
    tags: ['vector-db', 'similarity-search', 'embeddings'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Tools
  {
    name: 'Git',
    category: 'Tools',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 3.5,
    iconSlug: 'git',
    tags: ['version-control', 'collaboration', 'cli'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'GitHub Actions',
    category: 'Tools',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 2.0,
    iconSlug: 'githubactions',
    tags: ['ci-cd', 'automation', 'testing'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Linux',
    category: 'Tools',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 3.0,
    iconSlug: 'linux',
    tags: ['os', 'sysadmin', 'bash', 'posix'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'VS Code',
    category: 'Tools',
    proficiencyLevel: 'Expert',
    yearsOfExperience: 4.0,
    iconSlug: 'visualstudiocode',
    tags: ['ide', 'extensions', 'debugging'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
  {
    name: 'Figma',
    category: 'Tools',
    proficiencyLevel: 'Familiar',
    yearsOfExperience: 1.5,
    iconSlug: 'figma',
    tags: ['design', 'ui-ux', 'wireframing'],
  }, // PLACEHOLDER: adjust to reflect your actual skills

  // Other
  {
    name: 'GraphQL',
    category: 'Other',
    proficiencyLevel: 'Proficient',
    yearsOfExperience: 1.5,
    iconSlug: 'graphql',
    tags: ['api', 'query-language', 'schema'],
  }, // PLACEHOLDER: adjust to reflect your actual skills
];
