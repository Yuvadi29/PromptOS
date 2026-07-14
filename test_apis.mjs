const BASE = 'http://localhost:3000/api/v1';
const EMAIL = 'letstalkaditya@gmail.com';

const endpoints = [
  { method: 'GET', url: '/metrics' },
  { method: 'GET', url: '/status' },
  { method: 'GET', url: '/public/activities' },
  { method: 'GET', url: `/dashboard-stats?testUserEmail=${EMAIL}` },
  { method: 'GET', url: `/user/profile-stats?testUserEmail=${EMAIL}` },
  { method: 'GET', url: `/user/activities?testUserEmail=${EMAIL}` },
  { method: 'GET', url: `/user/bio?testUserEmail=${EMAIL}` },
  { method: 'PUT', url: `/user/bio`, body: { testUserEmail: EMAIL, bio: 'Test bio' } },
  { method: 'POST', url: `/user/profile`, body: { testUserEmail: EMAIL, bio: 'Test bio 2' } },
  { method: 'POST', url: `/prompt`, body: { input: 'Write a poem about APIs' } },
  { method: 'POST', url: `/prompt/classify`, body: { input: 'How do I center a div?' } },
  { method: 'POST', url: `/prompt/vote`, body: { promptId: 1, type: 'likes' } },
  { method: 'POST', url: `/save-prompt`, body: { testUserEmail: EMAIL, prompt: 'Test prompt', originalPrompt: 'Test original' } },
  { method: 'POST', url: `/save-prompt-score`, body: { testUserEmail: EMAIL, prompt: 'Test', clarity: 5, specificity: 5, model_fit: 5, relevance: 5, structure: 5, conciseness: 5 } },
  { method: 'POST', url: `/score-prompt`, body: { testUserEmail: EMAIL, prompt: 'How do I center a div?' } },
  { method: 'POST', url: `/recommend`, body: { queryText: 'React components' } },
  { method: 'GET', url: `/test-queue` },
  { method: 'POST', url: `/prompt/123/embed`, expect: 404 }, // Fake ID should 404
  { method: 'GET', url: `/prompt/123/versions` },
  { method: 'POST', url: `/prompt/123/versions`, body: { content: 'test content' } },
  { method: 'POST', url: `/prompt/123/versions/456/revert`, expect: 404 }, // Fake version should 404
];

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  console.log('Running API tests against ' + BASE + '\n');

  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method, headers: {} };
      if (ep.body) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(ep.body);
      }
      
      const start = Date.now();
      const res = await fetch(`${BASE}${ep.url}`, opts);
      let data = {};
      try {
        data = await res.json();
      } catch (e) {}
      
      const time = Date.now() - start;
      const isSuccess = ep.expect ? res.status === ep.expect : res.ok;

      if (isSuccess) {
        console.log(`✅ [${ep.method}] ${ep.url} - ${res.status} (${time}ms)`);
        passed++;
      } else {
        console.log(`❌ [${ep.method}] ${ep.url} - ${res.status} (${time}ms)`);
        console.log(`   Response: ${JSON.stringify(data)}`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ [${ep.method}] ${ep.url} - FAILED`);
      console.log(`   Error: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nTests complete. Passed: ${passed}, Failed: ${failed}`);
}

runTests();
