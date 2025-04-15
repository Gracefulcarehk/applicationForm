#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Function to handle errors
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd client
npm run build || handle_error "Frontend build failed"
cd ..

# Deploy backend
echo -e "${YELLOW}Deploying backend to Cloudflare Workers...${NC}"
cd server

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}Installing Wrangler CLI...${NC}"
    npm install -g wrangler || handle_error "Failed to install Wrangler"
fi

# Login to Cloudflare if not already logged in
wrangler whoami || wrangler login

# Deploy worker
echo -e "${YELLOW}Deploying worker...${NC}"
wrangler deploy || handle_error "Worker deployment failed"

cd ..

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Go to Cloudflare Pages and deploy your frontend"
echo "2. Update your domain DNS settings in Cloudflare"
echo "3. Test your deployed application" 