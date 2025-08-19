// Production deployment script for MANYA E-Commerce Client
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with styling
const log = {
  info: (msg) => console.log(`${colors.bright}${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.bright}${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.bright}${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.bright}${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.bright}${colors.magenta}[STEP]${colors.reset} ${msg}`),
};

// Execute shell commands
function execute(command) {
  try {
    log.info(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    return false;
  }
}

// Check if .env file exists
function checkEnvFile() {
  log.step('Checking environment configuration...');
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log.error('.env file not found. Creating a template .env file...');
    
    const envTemplate = `REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

# Cloudinary configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=
REACT_APP_CLOUDINARY_API_KEY=
REACT_APP_CLOUDINARY_UPLOAD_PRESET=`;
    
    fs.writeFileSync(envPath, envTemplate);
    log.warning('Please fill in the .env file with your configuration values and run this script again.');
    return false;
  }
  
  log.success('.env file found');
  return true;
}

// Clean build directory
function cleanBuild() {
  log.step('Cleaning previous build...');
  
  const buildPath = path.join(__dirname, 'build');
  if (fs.existsSync(buildPath)) {
    try {
      fs.rmSync(buildPath, { recursive: true, force: true });
      log.success('Previous build directory removed');
    } catch (error) {
      log.error(`Failed to remove build directory: ${error.message}`);
      return false;
    }
  } else {
    log.info('No previous build directory found');
  }
  
  return true;
}

// Install dependencies
function installDependencies() {
  log.step('Installing dependencies...');
  return execute('npm install');
}

// Build the application
function buildApp() {
  log.step('Building application for production...');
  return execute('npm run build');
}

// Run tests
function runTests() {
  log.step('Running tests...');
  return execute('npm test -- --watchAll=false');
}

// Deploy to hosting (if configured)
function deploy() {
  log.step('Deploying to hosting...');
  
  // Check if netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
    
    // Ask for confirmation
    log.warning('Ready to deploy to Netlify. This will deploy the site to production.');
    log.info('To proceed with deployment, run: netlify deploy --prod');
    
    return true;
  } catch (error) {
    log.warning('Netlify CLI not found. To deploy to Netlify:');
    log.info('1. Install Netlify CLI: npm install -g netlify-cli');
    log.info('2. Login to Netlify: netlify login');
    log.info('3. Deploy the site: netlify deploy --prod');
    
    return false;
  }
}

// Main function
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}=== MANYA E-COMMERCE CLIENT DEPLOYMENT ===${colors.reset}\n`);
  
  // Run deployment steps
  if (!checkEnvFile()) return;
  if (!cleanBuild()) return;
  if (!installDependencies()) return;
  if (!runTests()) {
    log.warning('Tests failed but continuing with build...');
  }
  if (!buildApp()) return;
  
  log.success('Build completed successfully!');
  
  // Deployment step
  deploy();
  
  console.log(`\n${colors.bright}${colors.green}=== BUILD COMPLETED SUCCESSFULLY ===${colors.reset}`);
  log.info('The production build is ready in the "build" directory');
  log.info('You can now deploy this build to your hosting provider');
}

// Run the script
main().catch(error => {
  log.error('Deployment failed:');
  log.error(error.message);
  process.exit(1);
});