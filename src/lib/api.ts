const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  resume_text?: string;
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

// Candidates API
export async function getCandidates(): Promise<Candidate[]> {
  const response = await fetch(`${API_BASE_URL}/candidates/`);
  if (!response.ok) throw new Error('Failed to fetch candidates');
  return response.json();
}

export async function createCandidate(formData: FormData): Promise<{ message: string; data: Candidate }> {
  const response = await fetch(`${API_BASE_URL}/candidates/`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create candidate');
  return response.json();
}

// Jobs API
export async function getJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE_URL}/jobs/`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
}

export async function createJob(job: Omit<Job, 'id'>): Promise<{ message: string; data: Job }> {
  const response = await fetch(`${API_BASE_URL}/jobs/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!response.ok) throw new Error('Failed to create job');
  return response.json();
}

// Analysis API
export async function evaluateCandidate(candidateId: number, jobId: string): Promise<EvaluationResult> {
  const response = await fetch(`${API_BASE_URL}/analysis/evaluate/${candidateId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId }),
  });
  if (!response.ok) throw new Error('Failed to evaluate candidate');
  return response.json();
}

export async function compareCandidates(candidateIds: string[]): Promise<{ candidate_id: string; name: string; overall_score: number }[]> {
  const response = await fetch(`${API_BASE_URL}/analysis/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate_ids: candidateIds }),
  });
  if (!response.ok) throw new Error('Failed to compare candidates');
  return response.json();
}

// GitHub Deep Validation API
export async function githubDeepCheck(githubUrl: string): Promise<GitHubAnalysis> {
  const response = await fetch(`${API_BASE_URL}/analysis/github-deep-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ github_url: githubUrl }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze GitHub profile');
  }
  return response.json();
}
