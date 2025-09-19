#!/bin/bash
file="frontend/src/components/ComprehensiveDashboard.tsx"

# Add descriptions to remaining tools
sed -i '' 's/{ id: '\''responsible-gaming'\'', name: '\''Responsible Gaming'\'', icon: UserCheck, category: '\''Player Protection'\'', endpoint: '\''responsible-gaming'\'' }/{ id: '\''responsible-gaming'\'', name: '\''Responsible Gaming'\'', description: '\''Monitor player protection and self-exclusion'\'', icon: UserCheck, category: '\''Player Protection'\'', endpoint: '\''responsible-gaming'\'' }/g' "$file"

sed -i '' 's/{ id: '\''geo-compliance'\'', name: '\''Geo Compliance'\'', icon: Globe, category: '\''Regulatory'\'', endpoint: '\''geo-compliance'\'' }/{ id: '\''geo-compliance'\'', name: '\''Geo Compliance'\'', description: '\''Verify location and regional restrictions'\'', icon: Globe, category: '\''Regulatory'\'', endpoint: '\''geo-compliance'\'' }/g' "$file"

sed -i '' 's/{ id: '\''payment-analysis'\'', name: '\''Payment Analysis'\'', icon: DollarSign, category: '\''Financial'\'', endpoint: '\''payment-analysis'\'' }/{ id: '\''payment-analysis'\'', name: '\''Payment Analysis'\'', description: '\''Monitor transaction patterns and payment methods'\'', icon: DollarSign, category: '\''Financial'\'', endpoint: '\''payment-analysis'\'' }/g' "$file"

sed -i '' 's/{ id: '\''fraud-detection'\'', name: '\''Fraud Detection'\'', icon: Shield, category: '\''Security'\'', endpoint: '\''fraud-detection'\'' }/{ id: '\''fraud-detection'\'', name: '\''Fraud Detection'\'', description: '\''Detect fraudulent activities using ML algorithms'\'', icon: Shield, category: '\''Security'\'', endpoint: '\''fraud-detection'\'' }/g' "$file"

sed -i '' 's/{ id: '\''tournaments'\'', name: '\''Tournaments'\'', icon: Award, category: '\''Operations'\'', endpoint: '\''tournaments'\'' }/{ id: '\''tournaments'\'', name: '\''Tournament Management'\'', description: '\''Manage tournaments and prize distributions'\'', icon: Award, category: '\''Operations'\'', endpoint: '\''tournaments'\'' }/g' "$file"

sed -i '' 's/{ id: '\''live-dealers'\'', name: '\''Live Dealers'\'', icon: Eye, category: '\''Operations'\'', endpoint: '\''live-dealers'\'' }/{ id: '\''live-dealers'\'', name: '\''Live Dealer Management'\'', description: '\''Schedule and monitor live dealer performance'\'', icon: Eye, category: '\''Operations'\'', endpoint: '\''live-dealers'\'' }/g' "$file"

sed -i '' 's/{ id: '\''vip-players'\'', name: '\''VIP Management'\'', icon: UserCheck, category: '\''VIP'\'', endpoint: '\''vip-players'\'' }/{ id: '\''vip-players'\'', name: '\''VIP Management'\'', description: '\''Manage VIP players and exclusive offers'\'', icon: UserCheck, category: '\''VIP'\'', endpoint: '\''vip-players'\'' }/g' "$file"

sed -i '' 's/{ id: '\''player-behavior'\'', name: '\''Player Analytics'\'', icon: Users, category: '\''Analytics'\'', endpoint: '\''player-behavior'\'' }/{ id: '\''player-behavior'\'', name: '\''Player Analytics'\'', description: '\''Analyze player behavior and segmentation'\'', icon: Users, category: '\''Analytics'\'', endpoint: '\''player-behavior'\'' }/g' "$file"

sed -i '' 's/{ id: '\''game-performance'\'', name: '\''Game Performance'\'', icon: BarChart3, category: '\''Analytics'\'', endpoint: '\''game-performance'\'' }/{ id: '\''game-performance'\'', name: '\''Game Performance'\'', description: '\''Monitor game performance and player engagement'\'', icon: BarChart3, category: '\''Analytics'\'', endpoint: '\''game-performance'\'' }/g' "$file"

echo "Descriptions added successfully!"
