# 🚀 Deployment Guide - Amazon Q Agent Orchestra

## 📋 **Prerequisites**

### **System Requirements**
- **Operating System**: Linux, macOS, or Windows with WSL
- **Node.js**: Version 18.0.0 or higher
- **Amazon Q CLI**: Pro License with MCP support
- **Memory**: Minimum 512MB available RAM
- **Disk Space**: 100MB for installation and dependencies

### **Amazon Q CLI Setup**
```bash
# Verify Amazon Q CLI installation
q --version

# Check authentication status
q whoami

# Ensure Pro License is active
q login --license pro

# Verify MCP support
q doctor -v
```

---

## 📦 **Installation**

### **Method 1: Direct Installation**

```bash
# 1. Clone the repository
git clone https://github.com/your-org/amazon-q-agents-hackathon.git
cd amazon-q-agents-hackathon/mcp-server

# 2. Install dependencies
npm install

# 3. Test the server
npm test

# 4. Verify installation
node index.js --version
```

### **Method 2: From Release Package**

```bash
# 1. Download latest release
wget https://github.com/your-org/amazon-q-agents-hackathon/releases/latest/amazon-q-agent-orchestra.tar.gz

# 2. Extract and install
tar -xzf amazon-q-agent-orchestra.tar.gz
cd amazon-q-agent-orchestra
npm install --production

# 3. Test installation
npm test
```

---

## ⚙️ **Configuration**

### **Amazon Q MCP Configuration**

Add the Agent Orchestra server to your Amazon Q MCP configuration:

```bash
# Edit MCP configuration
nano ~/.aws/amazonq/mcp.json
```

Add this configuration:
```json
{
  "mcpServers": {
    "amazon-q-agent-orchestra": {
      "autoApprove": ["*"],
      "disabled": false,
      "timeout": 120000,
      "command": "node",
      "args": [
        "/full/path/to/amazon-q-agents-hackathon/mcp-server/index.js"
      ],
      "transportType": "stdio"
    }
  }
}
```

**Important Notes:**
- Replace `/full/path/to/` with the actual absolute path
- Ensure the path is accessible by the Amazon Q CLI process
- Use forward slashes even on Windows

### **Environment Configuration**

Create optional environment configuration:
```bash
# Create .env file (optional)
cat > .env << EOF
NODE_ENV=production
LOG_LEVEL=info
SESSION_TIMEOUT=3600000
MAX_SESSIONS=1000
EOF
```

### **Permissions Setup**

```bash
# Make the server executable
chmod +x /path/to/amazon-q-agents-hackathon/mcp-server/index.js

# Ensure Amazon Q can access the directory
chmod 755 /path/to/amazon-q-agents-hackathon/
chmod 755 /path/to/amazon-q-agents-hackathon/mcp-server/
```

---

## 🔄 **Activation**

### **Restart Amazon Q MCP Servers**

```bash
# Method 1: Using Q CLI settings
q settings mcp.loadedBefore false
sleep 2
q settings mcp.loadedBefore true

# Method 2: Using alias (if available)
qr

# Method 3: Restart entire Q CLI session
# Exit current session and start new one
```

### **Verification**

```bash
# Check if server is loaded
q doctor -v

# Test basic functionality
echo "List all available agents" | q chat --trust-all-tools

# Verify all tools are available
echo "Show me the Agent Orchestra tools" | q chat --trust-all-tools
```

---

## 🧪 **Testing Deployment**

### **Basic Functionality Test**

```bash
# Test 1: Start a session
echo "Start a customer service session for testing" | q chat --trust-all-tools

# Test 2: List agents
echo "Show me all available agents in the Agent Orchestra" | q chat --trust-all-tools

# Test 3: Test guardrails
echo "Test the guardrail system with message: 'Hello, I need help with my flight'" | q chat --trust-all-tools
```

### **Advanced Testing**

```bash
# Test complete workflow
cat << 'EOF' | q chat --trust-all-tools
Start a customer service session for John Doe, then send the message "I need to change my seat to 23A" to test the intelligent routing system.
EOF

# Test error handling
echo "Try to get status for a non-existent session ID: test-123" | q chat --trust-all-tools
```

### **Performance Testing**

```bash
# Monitor server startup time
time echo "Start a customer service session" | q chat --trust-all-tools

# Test response times
for i in {1..5}; do
  time echo "List available agents" | q chat --trust-all-tools
done
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Server Not Loading**
```bash
# Check MCP configuration syntax
cat ~/.aws/amazonq/mcp.json | jq .

# Verify file permissions
ls -la /path/to/amazon-q-agents-hackathon/mcp-server/index.js

# Check Node.js version
node --version  # Should be >= 18.0.0

# Test server directly
cd /path/to/amazon-q-agents-hackathon/mcp-server
node index.js
```

#### **Tools Not Available**
```bash
# Restart MCP servers
q settings mcp.loadedBefore false && sleep 2 && q settings mcp.loadedBefore true

# Check server logs
q doctor -v | grep -A 10 "MCP"

# Verify configuration
cat ~/.aws/amazonq/mcp.json | grep -A 10 "amazon-q-agent-orchestra"
```

#### **Permission Errors**
```bash
# Fix permissions
chmod 755 /path/to/amazon-q-agents-hackathon/
chmod 755 /path/to/amazon-q-agents-hackathon/mcp-server/
chmod +x /path/to/amazon-q-agents-hackathon/mcp-server/index.js

# Check Amazon Q CLI permissions
ls -la ~/.aws/amazonq/
```

#### **Timeout Issues**
```bash
# Increase timeout in MCP configuration
# Edit ~/.aws/amazonq/mcp.json and change timeout to 180000 (3 minutes)

# Or globally increase Amazon Q timeout
q settings timeout.response 120
```

### **Debug Mode**

Enable debug logging:
```bash
# Set environment variable
export DEBUG=amazon-q-agent-orchestra

# Or modify the server code temporarily
# Add console.error() statements for debugging
```

### **Log Analysis**

```bash
# Check Amazon Q logs
tail -f ~/.aws/amazonq/lspLog.log

# Monitor system resources
top -p $(pgrep -f "amazon-q-agent-orchestra")

# Check for memory leaks
ps aux | grep "amazon-q-agent-orchestra"
```

---

## 🔄 **Updates & Maintenance**

### **Updating the Server**

```bash
# 1. Stop Amazon Q MCP servers
q settings mcp.loadedBefore false

# 2. Update code
cd /path/to/amazon-q-agents-hackathon
git pull origin main

# 3. Update dependencies
cd mcp-server
npm update

# 4. Test updated version
npm test

# 5. Restart MCP servers
q settings mcp.loadedBefore true
```

### **Backup Configuration**

```bash
# Backup MCP configuration
cp ~/.aws/amazonq/mcp.json ~/.aws/amazonq/mcp.json.backup.$(date +%Y%m%d)

# Backup server code
tar -czf amazon-q-agent-orchestra-backup-$(date +%Y%m%d).tar.gz \
  /path/to/amazon-q-agents-hackathon/
```

### **Health Monitoring**

```bash
# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
echo "Testing Agent Orchestra health..."
result=$(echo "List available agents" | q chat --trust-all-tools 2>&1)
if [[ $result == *"agents"* ]]; then
  echo "✅ Agent Orchestra is healthy"
  exit 0
else
  echo "❌ Agent Orchestra is not responding"
  echo "Response: $result"
  exit 1
fi
EOF

chmod +x health-check.sh

# Run health check
./health-check.sh
```

---

## 🌐 **Production Deployment**

### **Production Configuration**

```json
{
  "mcpServers": {
    "amazon-q-agent-orchestra": {
      "autoApprove": ["*"],
      "disabled": false,
      "timeout": 180000,
      "command": "node",
      "args": [
        "/opt/amazon-q-agent-orchestra/index.js"
      ],
      "transportType": "stdio",
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "warn"
      }
    }
  }
}
```

### **System Service (Optional)**

For production environments, consider creating a system service:

```bash
# Create systemd service file
sudo tee /etc/systemd/system/amazon-q-agent-orchestra.service << EOF
[Unit]
Description=Amazon Q Agent Orchestra MCP Server
After=network.target

[Service]
Type=simple
User=amazonq
WorkingDirectory=/opt/amazon-q-agent-orchestra
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable amazon-q-agent-orchestra
sudo systemctl start amazon-q-agent-orchestra
```

### **Monitoring & Alerting**

```bash
# Create monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash
while true; do
  if ! ./health-check.sh; then
    echo "$(date): Agent Orchestra health check failed" >> /var/log/agent-orchestra.log
    # Add alerting logic here (email, Slack, etc.)
  fi
  sleep 300  # Check every 5 minutes
done
EOF
```

---

## 📊 **Performance Optimization**

### **Memory Optimization**

```bash
# Set Node.js memory limits
export NODE_OPTIONS="--max-old-space-size=512"

# Or modify MCP configuration
"env": {
  "NODE_OPTIONS": "--max-old-space-size=512"
}
```

### **Response Time Optimization**

```bash
# Reduce timeout for faster failures
"timeout": 60000

# Enable keep-alive
"env": {
  "NODE_ENV": "production",
  "HTTP_KEEP_ALIVE": "true"
}
```

---

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] Node.js 18+ installed
- [ ] Amazon Q CLI Pro License active
- [ ] MCP support verified
- [ ] Dependencies installed
- [ ] Tests passing

### **Deployment**
- [ ] MCP configuration updated
- [ ] File permissions set correctly
- [ ] Server path is absolute
- [ ] MCP servers restarted
- [ ] Basic functionality tested

### **Post-Deployment**
- [ ] All 6 tools available
- [ ] Agent orchestration working
- [ ] Guardrails functional
- [ ] Performance acceptable
- [ ] Error handling working

### **Production Readiness**
- [ ] Health monitoring setup
- [ ] Backup procedures in place
- [ ] Update procedures documented
- [ ] Troubleshooting guide available
- [ ] Performance monitoring active

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 2025-06-23  
**Compatibility**: Amazon Q CLI with MCP support  
**Status**: ✅ Production ready
