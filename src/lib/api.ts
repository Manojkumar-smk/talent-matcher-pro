const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-proxy`;

export interface Candidate {
  id: number | string;
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
  description?: string;
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
  profile?: GitHubProfile;
  repos?: GitHubRepo[];
  username?: string;
  originality_check?: {
    score: number;
    status: string;
    details: string;
  };
  commit_pattern_authenticity?: {
    score: number;
    status: string;
    details: string;
  };
  code_quality?: {
    score: number;
    rating: string;
    details: string;
  };
  tech_stack_verification?: {
    match_score: number;
    verified_skills: string[];
    claimed_vs_actual: string;
  };
  project_depth?: {
    score: number;
    level: string;
    details: string;
  };
  ai_generated_code_check?: {
    ai_probability: number;
    status: string;
    details: string;
  };
  activity_timeline_consistency?: {
    consistency_score: number;
    details: string;
  };
  repo_health_score?: {
    score: number;
    details: string;
  };
  skill_validation?: {
    derived_skills: string[];
    proficiency: string;
  };
  overall_risk_score?: number;
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

async function proxyFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${PROXY_URL}?path=${encodeURIComponent(path)}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

// Candidates API
export async function getCandidates(): Promise<Candidate[]> {
  const response = await proxyFetch('/api/candidates/');
  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }
  return response.json();
}

export async function createCandidate(formData: FormData): Promise<{ message: string; data: Candidate }> {
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });
  
  const response = await proxyFetch('/api/candidates/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create candidate');
  }
  return response.json();
}

// Jobs API
export async function getJobs(): Promise<Job[]> {
  const response = await proxyFetch('/api/jobs/');
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
}

export async function createJob(job: Omit<Job, 'id'>): Promise<{ message: string; data: Job }> {
  const response = await proxyFetch('/api/jobs/', {
    method: 'POST',
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  return response.json();
}

// Analysis API
export async function evaluateCandidate(candidateId: number | string, jobId?: string): Promise<EvaluationResult> {
  const response = await proxyFetch(`/api/analysis/evaluate/${candidateId}`, {
    method: 'POST',
    body: JSON.stringify({ job_id: jobId }),
  });
  if (!response.ok) {
    throw new Error('Failed to evaluate candidate');
  }
  return response.json();
}

export async function compareCandidates(candidateIds: string[]): Promise<{ candidate_id: string; name: string; overall_score: number }[]> {
  const response = await proxyFetch('/api/analysis/compare', {
    method: 'POST',
    body: JSON.stringify({ candidate_ids: candidateIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to compare candidates');
  }
  return response.json();
}

// GitHub Deep Check
export async function githubDeepCheck(githubUrl: string): Promise<GitHubAnalysis> {
  const response = await proxyFetch('/api/analysis/github-deep-check', {
    method: 'POST',
    body: JSON.stringify({ github_url: githubUrl }),
  });
  if (!response.ok) {
    throw new Error('Failed to analyze GitHub profile');
  }
  return response.json();
}
