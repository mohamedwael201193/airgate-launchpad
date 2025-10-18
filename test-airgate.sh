#!/bin/bash

# AirGate OS Test Script
# Simple validation script for AIR Kit integration

echo "🚀 AirGate OS Integration Test"
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Environment file
echo ""
info "Testing environment configuration..."
if [ -f ".env" ]; then
    success "Environment file exists"
    
    # Check required variables
    required_vars=("VITE_AIR_PARTNER_ID" "VITE_MOCA_CHAIN_ID" "VITE_ISSUER_DID" "VITE_ISSUER_PROGRAM_IDS")
    for var in "${required_vars[@]}"; do
        if grep -q "$var" .env; then
            success "$var configured"
        else
            error "$var missing from .env"
        fi
    done
    
    # Check Moca Devnet settings
    if grep -q "5151" .env; then
        success "Moca Devnet chain ID configured"
    else
        warning "Chain ID should be 5151 for Moca Devnet"
    fi
else
    error "Environment file not found. Copy from .env.example"
fi

# Test 2: Dependencies
echo ""
info "Testing dependencies..."
if [ -f "package.json" ]; then
    if grep -q "@mocanetwork/airkit" package.json; then
        success "AIR Kit SDK dependency found"
    else
        error "AIR Kit SDK dependency missing"
    fi
    
    if grep -q "wagmi" package.json; then
        success "Wagmi dependency found"
    else
        error "Wagmi dependency missing"
    fi
    
    if grep -q "date-fns" package.json; then
        success "Date-fns dependency found"
    else
        error "Date-fns dependency missing"
    fi
else
    error "package.json not found"
fi

# Test 3: AIR Kit service files
echo ""
info "Testing AIR Kit service files..."

files=("src/air/airkit.ts" "src/air/useAirGate.tsx" "src/air/types.ts" "src/air/env.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        success "$file exists"
        
        # Check for real AIR Kit imports
        if [ "$file" == "src/air/airkit.ts" ]; then
            if grep -q "@mocanetwork/airkit" "$file"; then
                success "Real AIR Kit SDK imported"
            else
                error "AIR Kit SDK not imported in $file"
            fi
            
            # Check for mock services (should not exist)
            if grep -q "enhancedAirService" "$file"; then
                warning "Found mock service reference - ensure cleanup"
            fi
        fi
    else
        error "$file not found"
    fi
done

# Test 4: UI Components
echo ""
info "Testing UI components..."

components=("src/components/airgate/VerifyModal.tsx" "src/components/airgate/ProofViewer.tsx" "src/pages/Profile.tsx")
for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        success "$component exists"
    else
        error "$component not found"
    fi
done

# Test 5: Wallet configuration
echo ""
info "Testing wallet configuration..."
if [ -f "src/lib/wagmi.ts" ]; then
    success "Wagmi config exists"
    
    if grep -q "5151" src/lib/wagmi.ts; then
        success "Moca Devnet configured in wagmi"
    else
        error "Moca Devnet not configured in wagmi"
    fi
    
    if grep -q "window.location.origin" src/lib/wagmi.ts; then
        success "Dynamic WalletConnect metadata configured"
    else
        warning "WalletConnect metadata should use dynamic URL"
    fi
else
    error "Wagmi config not found"
fi

# Test 6: TypeScript compilation
echo ""
info "Testing TypeScript compilation..."
if command -v npx &> /dev/null; then
    if npx tsc --noEmit 2>/dev/null; then
        success "TypeScript compilation successful"
    else
        error "TypeScript compilation failed"
    fi
else
    warning "npx not found - skipping TypeScript test"
fi

# Test 7: Build process
echo ""
info "Testing build process..."
if command -v npm &> /dev/null; then
    if npm run build > /dev/null 2>&1; then
        success "Build process successful"
    else
        error "Build process failed"
    fi
else
    warning "npm not found - skipping build test"
fi

# Test 8: Network connectivity (basic)
echo ""
info "Testing network connectivity..."

urls=("https://devnet-rpc.mocachain.org" "https://devnet-explorer.mocachain.org")
for url in "${urls[@]}"; do
    if command -v curl &> /dev/null; then
        if curl -s --head "$url" | head -n 1 | grep -q "200\|405\|403"; then
            success "$url is reachable"
        else
            warning "$url may not be reachable"
        fi
    else
        warning "curl not found - skipping network test for $url"
    fi
done

# Summary
echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED${NC}"
fi
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
fi

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All critical tests passed! AirGate OS is ready.${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start the development server: npm run dev"
    echo "2. Test credential flows in the browser"
    echo "3. Connect wallet to Moca Devnet (Chain ID 5151)"
    echo "4. Configure AIR Console domain settings"
else
    echo ""
    echo -e "${RED}🚨 $FAILED test(s) failed. Please fix the issues above.${NC}"
    exit 1
fi