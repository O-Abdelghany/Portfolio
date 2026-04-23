import axios from 'axios';

const GITHUB_USER = 'O-Abdelghany';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let repoCache = null;
let cacheTimestamp = 0;

function authHeaders() {
  return process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {};
}

async function fetchRepos() {
  const { data } = await axios.get(
    `https://api.github.com/users/${GITHUB_USER}/repos`,
    { headers: authHeaders() }
  );
  return data;
}

async function getRepos() {
  const now = Date.now();
  if (repoCache && now - cacheTimestamp < CACHE_TTL_MS) return repoCache;

  try {
    repoCache = await fetchRepos();
    cacheTimestamp = now;
  } catch (err) {
    console.error('GitHub fetch error:', err.message);
    if (!repoCache) return [];
  }

  return repoCache;
}

/**
 * Search cached repos for relevance to a skill keyword and return a summary string.
 * @param {string} skill
 * @returns {Promise<string>}
 */
export async function getRepoSummary(skill) {
  const repos = await getRepos();
  const keyword = skill.toLowerCase();

  const matched = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(keyword) ||
      (r.description && r.description.toLowerCase().includes(keyword))
  );

  if (matched.length === 0) return '';

  const lines = matched.map(
    (r) => `- ${r.name}: ${r.description || 'No description'} (${r.html_url})`
  );

  return `Relevant GitHub repositories:\n${lines.join('\n')}`;
}
