const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  resume_text?: string;
  resume_url?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
}

export interface EvaluationResult {
  authenticity_score: number;
  skill_match_score: number;
  overall_score: number;
  summary: string;
  strengths: string[];
  red_flags: string[];
  detailed_report: Record<string, unknown>;
  github_analysis?: GitHubAnalysis;
}

export interface GitHubAnalysis {
  username: string;
  originality_check: {
    score: number;
    status: string;
    details: string;
  };
  commit_pattern_authenticity: {
    score: number;
    status: string;
    details: string;
  };
  code_quality: {
    score: number;
    rating: string;
    details: string;
  };
  tech_stack_verification: {
    match_score: number;
    verified_skills: string[];
    claimed_vs_actual: string;
  };
  project_depth: {
    score: number;
    level: string;
    details: string;
  };
  ai_generated_code_check: {
    ai_probability: number;
    status: string;
    details: string;
  };
  activity_timeline_consistency: {
    consistency_score: number;
    details: string;
  };
  repo_health_score: {
    score: number;
    details: string;
  };
  skill_validation: {
    derived_skills: string[];
    proficiency: string;
  };
  overall_risk_score: number;
}

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    linkedin_url: "https://linkedin.com/in/rahulsharma",
    github_url: "https://github.com/rahulsharma",
    resume_text: "Senior Full Stack Developer with 5+ years experience in React, Node.js, and Python.",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    linkedin_url: "https://linkedin.com/in/priyapatel",
    github_url: "https://github.com/priyapatel",
    resume_text: "Data Scientist with expertise in Machine Learning, Python, and TensorFlow.",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    linkedin_url: "https://linkedin.com/in/amitkumar",
    github_url: "https://github.com/amitkumar",
    resume_text: "DevOps Engineer specializing in AWS, Docker, and Kubernetes.",
  },
];

// Mock data for jobs
const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Developer",
    description: "We are looking for a Senior Full Stack Developer to join our engineering team.",
    requirements: "5+ years experience, React, Node.js, TypeScript, PostgreSQL",
  },
  {
    id: "job-2",
    title: "Data Scientist",
    description: "Join our data team to build ML models and data pipelines.",
    requirements: "3+ years experience, Python, TensorFlow, SQL, Statistics",
  },
  {
    id: "job-3",
    title: "DevOps Engineer",
    description: "Help us scale our infrastructure and improve deployment processes.",
    requirements: "4+ years experience, AWS, Docker, Kubernetes, CI/CD",
  },
];

// Mock GitHub analysis data
const generateMockGitHubAnalysis = (username: string): GitHubAnalysis => ({
  username,
  originality_check: {
    score: 85,
    status: "pass",
    details: "Original code patterns detected. Low similarity to public repositories.",
  },
  commit_pattern_authenticity: {
    score: 78,
    status: "pass",
    details: "Consistent commit patterns over time. Regular contributions detected.",
  },
  code_quality: {
    score: 72,
    rating: "B+",
    details: "Good code quality with proper documentation and structure.",
  },
  tech_stack_verification: {
    match_score: 88,
    verified_skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
    claimed_vs_actual: "Skills match resume claims with strong evidence in repositories.",
  },
  project_depth: {
    score: 75,
    level: "Intermediate",
    details: "Shows depth in multiple projects with meaningful contributions.",
  },
  ai_generated_code_check: {
    ai_probability: 15,
    status: "pass",
    details: "Low probability of AI-generated code. Authentic coding patterns detected.",
  },
  activity_timeline_consistency: {
    consistency_score: 82,
    details: "Consistent activity over the past 2 years with steady growth.",
  },
  repo_health_score: {
    score: 70,
    details: "Repositories show good maintenance with recent updates.",
  },
  skill_validation: {
    derived_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    proficiency: "Advanced",
  },
  overall_risk_score: 22,
});

// Mock evaluation result
const generateMockEvaluation = (candidate: Candidate, job: Job): EvaluationResult => ({
  authenticity_score: 85,
  skill_match_score: 78,
  overall_score: 82,
  summary: `${candidate.name} demonstrates strong alignment with the ${job.title} role. Their technical background and project experience suggest they would be a valuable addition to the team.`,
  strengths: [
    "Strong technical foundation",
    "Consistent GitHub contributions",
    "Relevant project experience",
    "Good communication skills",
  ],
  red_flags: [
    "Some gaps in employment history",
  ],
  detailed_report: {},
  github_analysis: generateMockGitHubAnalysis(candidate.github_url?.split('/').pop() || "unknown"),
});

// Candidates API - Returns mock data
export async function getCandidates(): Promise<Candidate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCandidates;
}

export async function createCandidate(formData: FormData): Promise<{ message: string; data: Candidate }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newCandidate: Candidate = {
    id: mockCandidates.length + 1,
    name: formData.get('name') as string || 'New Candidate',
    email: formData.get('email') as string || 'new@email.com',
    linkedin_url: formData.get('linkedin_url') as string,
    github_url: formData.get('github_url') as string,
    resume_text: formData.get('resume_text') as string,
  };
  mockCandidates.push(newCandidate);
  return { message: 'Candidate created successfully', data: newCandidate };
}

// Jobs API - Returns mock data
export async function getJobs(): Promise<Job[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockJobs;
}

export async function createJob(job: Omit<Job, 'id'>): Promise<{ message: string; data: Job }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newJob: Job = {
    ...job,
    id: `job-${mockJobs.length + 1}`,
  };
  mockJobs.push(newJob);
  return { message: 'Job created successfully', data: newJob };
}

// Analysis API - Returns mock evaluation
export async function evaluateCandidate(candidateId: number, jobId: string): Promise<EvaluationResult> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
  
  const candidate = mockCandidates.find(c => c.id === candidateId);
  const job = mockJobs.find(j => j.id === jobId);
  
  if (!candidate) throw new Error('Candidate not found');
  if (!job) throw new Error('Job not found');
  
  return generateMockEvaluation(candidate, job);
}

export async function compareCandidates(candidateIds: string[]): Promise<{ candidate_id: string; name: string; overall_score: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return candidateIds.map(id => {
    const candidate = mockCandidates.find(c => c.id.toString() === id);
    return {
      candidate_id: id,
      name: candidate?.name || 'Unknown',
      overall_score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
    };
  });
}

// GitHub Deep Validation API - Returns mock analysis
export async function githubDeepCheck(githubUrl: string): Promise<GitHubAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis time
  
  const username = githubUrl.split('/').filter(Boolean).pop() || 'unknown';
  return generateMockGitHubAnalysis(username);
}
