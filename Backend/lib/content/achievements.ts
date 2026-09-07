import type { Achievement } from '@/types';

// PLACEHOLDER: replace with your actual achievements, awards, and certifications.
// All values below are explicitly placeholder examples.
export const ACHIEVEMENTS: Achievement[] = [
  {
    // PLACEHOLDER: Hackathon win
    title: '1st Place Winner — Regional Collegiate Hackathon',
    organization: 'Placeholder Hackathon Organization',
    year: 2024,
    month: 3,
    type: 'Hackathon',
    description:
      'Engineered an autonomous edge computer vision system for low-power robotics within 36 hours, awarded 1st place among 80+ competing university teams.',
    url: '', // PLACEHOLDER: add link to hackathon project or announcement
    featured: true,
  },
  {
    // PLACEHOLDER: Academic award
    title: 'Dean’s Honor List & Engineering Excellence Award',
    organization: 'Placeholder University School of Engineering',
    year: 2023,
    month: 12,
    type: 'Award',
    description:
      'Recognized for sustained academic excellence in Computer Engineering coursework, maintaining a top 5% GPA standing in the cohort.',
    url: '', // PLACEHOLDER: add verification link if available
    featured: true,
  },
  {
    // PLACEHOLDER: Professional certification
    title: 'AWS Certified Solutions Architect – Associate',
    organization: 'Amazon Web Services',
    year: 2023,
    month: 8,
    type: 'Certification',
    description:
      'Demonstrated comprehensive knowledge in architecting secure, resilient, high-performing, and cost-optimized cloud applications on AWS.',
    url: '', // PLACEHOLDER: add certificate credential URL
    featured: false,
  },
  {
    // PLACEHOLDER: Industry or community recognition
    title: 'Open Source Community Fellow / Contributor Recognition',
    organization: 'Placeholder Open Source Foundation',
    year: 2024,
    month: 6,
    type: 'Recognition',
    description:
      'Recognized for significant upstream contributions to developer tools and documentation supporting thousands of global developers.',
    url: '', // PLACEHOLDER: add link to recognition
    featured: false,
  },
  {
    // PLACEHOLDER: Publication / Other
    title: 'Undergraduate Research Symposium Best Poster Presentation',
    organization: 'Placeholder Research Symposium',
    year: 2024,
    month: 5,
    type: 'Other',
    description:
      'Co-authored and presented exploratory research on hardware-accelerated transformer quantization for resource-constrained edge computing devices.',
    url: '', // PLACEHOLDER: add link to paper or abstract
    featured: true,
  },
];
