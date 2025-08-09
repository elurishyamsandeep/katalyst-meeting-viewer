const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up OAuth credentials...');

const credentialsPath = path.join(process.cwd(), 'gcp-oauth.keys.json');

if (fs.existsSync(credentialsPath)) {
  // Use existing file (works for both local and Render)
  process.env.GOOGLE_OAUTH_CREDENTIALS = credentialsPath;
  console.log('✅ Using existing gcp-oauth.keys.json file');
  console.log('📍 File location:', credentialsPath);
  
  // Verify the file is readable
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    if (credentials.installed) {
      console.log('✅ Desktop app credentials detected (correct for MCP)');
    }
  } catch (error) {
    console.error('❌ Error reading credentials file:', error.message);
    process.exit(1);
  }
} else {
  console.error('❌ gcp-oauth.keys.json file not found');
  console.log('💡 Please ensure gcp-oauth.keys.json exists in the project root');
  process.exit(1);
}
