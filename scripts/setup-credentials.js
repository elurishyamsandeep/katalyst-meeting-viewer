const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up OAuth credentials...');

const existingFile = path.join(process.cwd(), 'gcp-oauth.keys.json');

if (fs.existsSync(existingFile)) {
  // Use existing file (for local development)
  process.env.GOOGLE_OAUTH_CREDENTIALS = existingFile;
  console.log('✅ Using existing gcp-oauth.keys.json file');
  console.log('📍 File location:', existingFile);
} else if (process.env.GOOGLE_OAUTH_CREDENTIALS_JSON) {
  // Create from environment variable (for Render deployment)
  try {
    const credentials = JSON.parse(process.env.GOOGLE_OAUTH_CREDENTIALS_JSON);
    fs.writeFileSync(existingFile, JSON.stringify(credentials, null, 2));
    process.env.GOOGLE_OAUTH_CREDENTIALS = existingFile;
    console.log('✅ OAuth credentials file created from environment');
    console.log('📍 File location:', existingFile);
  } catch (error) {
    console.error('❌ Error creating credentials file:', error.message);
    console.error('💡 Check your GOOGLE_OAUTH_CREDENTIALS_JSON format');
    process.exit(1);
  }
} else {
  console.error('❌ No OAuth credentials found');
  console.log('💡 Please ensure gcp-oauth.keys.json exists in the project root or set GOOGLE_OAUTH_CREDENTIALS_JSON');
  console.log('💡 For local development: place gcp-oauth.keys.json in project root');
  console.log('💡 For Render deployment: set GOOGLE_OAUTH_CREDENTIALS_JSON environment variable');
  process.exit(1);
}
