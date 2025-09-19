#!/bin/bash

echo "🚀 Demo: Fast Brand Protection Scan"
echo "==================================="
echo ""

# Test with a smaller domain set for demo
echo "📋 Testing optimized scanning..."
echo ""

# Start a quick scan via API
curl -X POST http://localhost:3000/api/scan/start \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "testbrand",
    "baseUrl": "https://example.com",
    "features": ["typosquatting", "threat-intel"],
    "sequence": "testbrand123.com",
    "range": 5,
    "ctDays": 7
  }' \
  | jq '.'

echo ""
echo "✅ Scan started! Check the web interface at:"
echo "   http://localhost:3000"
echo ""
echo "🔍 Optimizations applied:"
echo "   • Limited to 500 domains (vs 2420 previously)"
echo "   • Increased concurrency to 50 (vs 15)"
echo "   • Better progress tracking"
echo "   • Faster feature processing"
echo ""
echo "⚡ Expected completion: 2-5 minutes (vs 20+ minutes before)"
