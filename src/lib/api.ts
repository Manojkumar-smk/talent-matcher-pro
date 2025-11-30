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

export interface GitHubProfile {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
}

export interface GitHubAnalysis {
  profile: GitHubProfile;
  repos: GitHubRepo[];
}

export interface EvaluationResult {
  authenticity_score: number;
  skill_match_score: number;
  overall_score: number;
  summary: string;
  strengths: string[];
  red_flags: string[];
  github_analysis?: GitHubAnalysis;
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

// Mock GitHub analysis generator
const generateMockGitHubAnalysis = (username: string): GitHubAnalysis => ({
  profile: {
    login: username,
    name: username.charAt(0).toUpperCase() + username.slice(1).replace(/([A-Z])/g, ' $1'),
    public_repos: Math.floor(Math.random() * 30) + 10,
    followers: Math.floor(Math.random() * 500) + 50,
  },
  repos: [
    {
      name: "react-dashboard",
      description: "A modern admin dashboard built with React and TypeScript",
      stargazers_count: 45,
      language: "TypeScript",
    },
    {
      name: "node-api-starter",
      description: "Production-ready Node.js API boilerplate with Express",
      stargazers_count: 32,
      language: "JavaScript",
    },
    {
      name: "python-ml-toolkit",
      description: "Machine learning utilities and helper functions",
      stargazers_count: 28,
      language: "Python",
    },
    {
      name: "docker-compose-templates",
      description: "Collection of Docker Compose templates for various stacks",
      stargazers_count: 19,
      language: "Dockerfile",
    },
  ],
});

// Mock evaluation generator
const generateMockEvaluation = (candidate: Candidate, job: Job): EvaluationResult => ({
  authenticity_score: 85,
  skill_match_score: 78,
  overall_score: 82,
  summary: `${candidate.name} demonstrates strong alignment with the ${job.title} role. Their technical background and project experience suggest they would be a valuable addition to the team.`,
  strengths: [
    "Consistent commit history",
    "Strong technical foundation",
    "Relevant project experience",
    "Good documentation practices",
  ],
  red_flags: [],
  github_analysis: generateMockGitHubAnalysis(candidate.github_url?.split('/').pop() || "unknown"),
});

// Candidates API - Returns mock data
export async function getCandidates(): Promise<Candidate[]> {
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
export async function evaluateCandidate(candidateId: number, jobId?: string): Promise<EvaluationResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const candidate = mockCandidates.find(c => c.id === candidateId);
  const job = mockJobs.find(j => j.id === jobId) || mockJobs[0];
  
  if (!candidate) throw new Error('Candidate not found');
  
  return generateMockEvaluation(candidate, job);
}

export async function compareCandidates(candidateIds: string[]): Promise<{ candidate_id: string; name: string; overall_score: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return candidateIds.map(id => {
    const candidate = mockCandidates.find(c => c.id.toString() === id);
    return {
      candidate_id: id,
      name: candidate?.name || 'Unknown',
      overall_score: Math.floor(Math.random() * 30) + 70,
    };
  });
}

// GitHub Deep Check - Returns mock analysis
export async function githubDeepCheck(githubUrl: string): Promise<GitHubAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const username = githubUrl.split('/').filter(Boolean).pop() || 'unknown';
  return generateMockGitHubAnalysis(username);
}
