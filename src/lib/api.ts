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

export async function compareCandidates(candidateIds: number[]): Promise<EvaluationResult[]> {
  const response = await fetch(`${API_BASE_URL}/analysis/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate_ids: candidateIds }),
  });
  if (!response.ok) throw new Error('Failed to compare candidates');
  return response.json();
}
