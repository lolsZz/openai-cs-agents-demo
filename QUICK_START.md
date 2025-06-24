# Quick Start Guide

## Installation (5 minutes)

1. **Clone and setup**:
   ```bash
   git clone [repository-url] amazon-q-intelligent-orchestration
   cd amazon-q-intelligent-orchestration/mcp-server
   npm install
   ```

2. **Test the server**:
   ```bash
   npm test
   ```

3. **Add to Amazon Q CLI** (`~/.aws/amazonq/mcp.json`):
   ```json
   {
     "mcpServers": {
       "amazon-q-intelligent-orchestration": {
         "command": "node",
         "args": ["/full/path/to/mcp-server/index.js"],
         "transportType": "stdio"
       }
     }
   }
   ```

## Usage Examples

### Deployment
```
Goal: "Deploy a secure Node.js API with database and monitoring"
Result: 5-step execution plan coordinating fs_read, fs_write, use_aws, execute_bash
```

### Security
```
Goal: "Implement comprehensive security for my application"  
Result: 4-step security implementation plan with compliance checks
```

### Performance
```
Goal: "Optimize application performance and setup monitoring"
Result: 3-step optimization plan with monitoring setup
```

## Troubleshooting

**Server won't start**: Check Node.js version (requires 18+)
**Amazon Q can't find tools**: Verify full path in mcp.json
**Permission errors**: Ensure execute permissions on index.js

## Next Steps

Once working, try complex goals like:
- "Setup CI/CD pipeline with security scanning"
- "Migrate legacy application to microservices"
- "Implement disaster recovery for production system"

The system will analyze your goal and create intelligent execution plans.
