import type { GitHubRepo } from '../types';

const isGitHubRepo = (item: any): item is GitHubRepo => {
  return typeof item === 'object' && item !== null && 'name' in item && 'html_url' in item;
};

export const fetchGitHubProjects = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=20`);
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }
    const data = await response.json();
    
    const projects: GitHubRepo[] = data
      .filter((repo: any) => !repo.fork && isGitHubRepo(repo))
      .map(({ name, description, html_url, stargazers_count, language }: any) => ({
        name,
        description,
        html_url,
        stargazers_count,
        language,
      }));

    return projects;
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    throw error;
  }
};
