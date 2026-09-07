import type { Project } from '@/types';

// PLACEHOLDER: replace with your actual portfolio projects.
export const PROJECTS: Project[] = [
  {
    slug: 'neural-code-reviewer',
    title: 'NeuralReview: AI-Powered Automated Code Reviewer',
    shortDescription:
      'Autonomous static analysis and LLM-assisted code review engine delivering AST-aware security and performance optimizations.',
    problem:
      'Code reviews are time-consuming and human reviewers often miss subtle security vulnerabilities, edge-case memory leaks, or non-idiomatic anti-patterns during rapid pull request turnarounds.',
    solution:
      'Engineered an event-driven bot integrated into GitHub Webhooks that parses diffs into Abstract Syntax Trees, runs semantic vector retrieval against historical vulnerability patterns, and delivers contextual inline comments.',
    architecture:
      'Built on Next.js, FastAPI, LangChain, and PostgreSQL with pgvector. GitHub webhooks trigger Celery async tasks that stream AST analysis to OpenAI/Claude APIs with token budgeting and fallback caches in Redis.',
    features: [
      'Automated AST parsing and syntax diff extraction across TypeScript, Python, and Go.',
      'Contextual vector search matching PR changes against past CVEs and company style guides.',
      'One-click GitHub suggestion patches directly committable from PR comments.',
      'Real-time execution dashboard monitoring review latency and token expenditure.',
    ],
    impact:
      'Reduced pull request turnaround latency by 45% in test repositories and caught 18 critical security anomalies before merging to staging.',
    technologies: ['FastAPI', 'Python', 'Next.js', 'PostgreSQL', 'Redis', 'LangChain', 'Docker'],
    githubUrl: '', // PLACEHOLDER: add real URLs
    liveDemoUrl: '', // PLACEHOLDER: add real URLs
    imageUrls: [], // PLACEHOLDER: add real URLs
    videoUrl: '', // PLACEHOLDER: add real demo video URL
    status: 'Active',
    date: '2024-03-15',
    category: 'AI & Developer Tools',
    featured: true,
    order: 1,
  },
  {
    slug: 'canvas-sync-engine',
    title: 'CanvasSync: Real-Time CRDT Document Engine',
    shortDescription:
      'Distributed collaborative whiteboard and markdown editor powered by Conflict-free Replicated Data Types (CRDTs) and WebSockets.',
    problem:
      'Concurrent real-time editing across high-latency clients frequently causes race conditions, text desynchronization, or excessive lock contention in traditional centralized databases.',
    solution:
      'Implemented a decentralized synchronization engine utilizing Yjs CRDTs over WebSockets with optimistic local rendering, snapshot pruning, and offline reconciliation.',
    architecture:
      'Node.js and TypeScript WebSocket cluster behind an NGINX load balancer, paired with Redis pub/sub for cross-server message propagation and S3-compatible storage for periodic state snapshots.',
    features: [
      'Sub-50ms peer-to-peer visual cursor tracking and multi-cursor selection states.',
      'Conflict-free offline-first document persistence with automatic reconciliation upon reconnecting.',
      'Granular operational transformation undo/redo history tracking per active user.',
      'End-to-end encrypted room sessions with Ephemeral WebRTC media channels.',
    ],
    impact:
      'Benchmarked 99.98% state consistency across 1,000 simulated concurrent edits with zero data loss under simulated 300ms packet latency.',
    technologies: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'Redis', 'Tailwind CSS'],
    githubUrl: '', // PLACEHOLDER: add real URLs
    liveDemoUrl: '', // PLACEHOLDER: add real URLs
    imageUrls: [], // PLACEHOLDER: add real URLs
    videoUrl: '', // PLACEHOLDER: add real demo video URL
    status: 'Completed',
    date: '2024-01-20',
    category: 'Distributed Systems',
    featured: true,
    order: 2,
  },
  {
    slug: 'streamline-ml-ops',
    title: 'StreamLine MLOps: Automated Edge Model Deployment',
    shortDescription:
      'Continuous deployment pipeline converting PyTorch and ONNX models into quantized microservices deployed on Kubernetes.',
    problem:
      'Deploying deep learning models into production requires tedious manual quantization, containerization, and GPU memory profiling, delaying time-to-market.',
    solution:
      'Built a declarative CI/CD pipeline that takes raw PyTorch weights, automatically benchmarks latency across FP16/INT8 quantizations, generates optimized TensorRT engines, and builds hardened Docker containers.',
    architecture:
      'Python-based CLI and runner interacting with GitHub Actions, Triton Inference Server, Kubernetes (K8s), and Prometheus for real-time inference telemetry.',
    features: [
      'Automated post-training static and dynamic quantization targeting INT8 precision.',
      'Automated regression testing ensuring <1% accuracy degradation post-quantization.',
      'Helm chart generation with custom Horizontal Pod Autoscaler (HPA) triggers on GPU duty cycle.',
      'Built-in model performance heatmaps tracking P95/P99 latency under synthetic load.',
    ],
    impact:
      'Sped up model deployment lifecycle from 3 days to under 25 minutes while cutting edge inference memory consumption by 62%.',
    technologies: ['Python', 'PyTorch', 'Docker', 'Kubernetes', 'Triton', 'GitHub Actions'],
    githubUrl: '', // PLACEHOLDER: add real URLs
    liveDemoUrl: '', // PLACEHOLDER: add real URLs
    imageUrls: [], // PLACEHOLDER: add real URLs
    videoUrl: '', // PLACEHOLDER: add real demo video URL
    status: 'InProgress',
    date: '2023-11-10',
    category: 'Machine Learning Infrastructure',
    featured: false,
    order: 3,
  },
  {
    slug: 'portfolio-backend-system',
    title: 'Corefolio: Production-Grade Portfolio Data Layer',
    shortDescription:
      'Robust headless content and integration backend featuring GitHub GraphQL sync, MDX parsing, and strict type safety.',
    problem:
      'Developer portfolios often tightly couple presentation with data, lack caching, fail silently on third-party API rate limits, and suffer from untyped content mutations.',
    solution:
      'Designed an enterprise-ready headless data layer for personal portfolios with unified APIResponse contracts, rate-limited email dispatch, and resilient fallback handling.',
    architecture:
      'Next.js 14 App Router backend with Next.js route handlers, Zod schema validation, Resend transactional mailer, gray-matter MDX engine, and GitHub GraphQL integration.',
    features: [
      'Unified APIResponse<T> with detailed emptyState metadata and HTTP error codes.',
      'Hybrid GitHub sync fetching REST repository metrics and GraphQL contribution graphs.',
      'Self-pruning sliding window rate limiter with Upstash Redis and in-memory fallbacks.',
      'Strict Zod-validated contact form with honeypot bot trap and HTML templating.',
    ],
    impact:
      'Provides 100% type-safe headless endpoints with resilient offline fallbacks and 0 UI coupling.',
    technologies: ['Next.js', 'TypeScript', 'Zod', 'Resend', 'GitHub API', 'MDX'],
    githubUrl: '', // PLACEHOLDER: add real URLs
    liveDemoUrl: '', // PLACEHOLDER: add real URLs
    imageUrls: [], // PLACEHOLDER: add real URLs
    videoUrl: '', // PLACEHOLDER: add real demo video URL
    status: 'Active',
    date: '2023-09-01',
    category: 'Backend & Infrastructure',
    featured: false,
    order: 4,
  },
];
