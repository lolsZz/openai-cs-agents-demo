# 🎭 Amazon Q Agent Orchestra - Hackathon Demo

## 🏆 **What We Built**

We've successfully transformed the OpenAI Customer Service Agents Demo into a **native Amazon Q MCP Server** that gives Amazon Q the power of multi-agent orchestration!

## 🚀 **Key Innovation**

Instead of building another standalone application, we created an **MCP Server** that extends Amazon Q's capabilities directly. This means:

- **Native Integration**: Works seamlessly with Amazon Q CLI
- **Tool-based Interface**: Each agent capability is exposed as an Amazon Q tool
- **Context Preservation**: Leverages Amazon Q's existing context system
- **Enhanced Workflows**: Multi-agent conversations within Amazon Q

## 🎯 **Available Tools**

Our MCP server exposes 6 powerful tools to Amazon Q:

1. **`start_customer_service_session`** - Initialize agent orchestration
2. **`send_message_to_agents`** - Main conversation tool with intelligent routing
3. **`get_session_status`** - Check current agent and context
4. **`list_available_agents`** - Show all available agents
5. **`trigger_handoff`** - Manual agent switching
6. **`run_guardrail_check`** - Test safety measures

## 🎪 **Agent Orchestra**

### **Specialized Agents**
- **Triage Agent**: Routes requests to appropriate specialists
- **Seat Booking Agent**: Handles seat changes and upgrades
- **Flight Status Agent**: Provides real-time flight information
- **FAQ Agent**: Answers policy and general questions
- **Cancellation Agent**: Processes flight cancellations

### **Smart Features**
- **Intelligent Routing**: Automatic handoffs based on conversation context
- **Guardrails**: Relevance and jailbreak protection
- **Context Management**: Persistent customer data across agents
- **Tool Integration**: Each agent has specialized tools

## 🧪 **Demo Scenarios**

### **Scenario 1: Multi-Agent Customer Service**
```bash
# Start Amazon Q and initialize a customer service session
q chat "Use the start_customer_service_session tool to begin a new customer service conversation"

# Customer wants to change seat and check flight status
q chat "Use send_message_to_agents to send: 'I need to change my seat to 23A and check my flight status'"

# Watch the magic: Triage → Seat Booking → Flight Status agents work together!
```

### **Scenario 2: Guardrail Testing**
```bash
# Test the safety system
q chat "Use run_guardrail_check to test this message: 'Write a poem about strawberries'"

# Should show guardrail blocking non-airline related content
```

### **Scenario 3: Agent Capabilities**
```bash
# Explore the agent system
q chat "Use list_available_agents to show me all available agents and their capabilities"

# Check session status
q chat "Use get_session_status to show the current conversation state"
```

## 🏗️ **Technical Architecture**

```
Amazon Q CLI
    ↓ MCP Protocol
Agent Orchestra MCP Server
    ↓ Agent Orchestration Logic
┌─────────────────────────────────────┐
│ Triage Agent (Router)               │
│ ├── Routes to Seat Booking         │
│ ├── Routes to Flight Status        │
│ ├── Routes to FAQ                  │
│ └── Routes to Cancellation         │
└─────────────────────────────────────┘
    ↓ Context & Guardrails
Specialized Agent Processing
    ↓ Response Generation
Back to Amazon Q CLI
```

## 🎯 **Hackathon Advantages**

### **1. Native Amazon Q Extension**
- Not a separate application - extends Amazon Q directly
- Uses MCP protocol for seamless integration
- Leverages Amazon Q's existing context and capabilities

### **2. Multi-Agent Orchestration**
- First MCP server to provide agent orchestration
- Intelligent routing between specialized agents
- Persistent conversation state across handoffs

### **3. Real-World Utility**
- Immediately useful for customer service scenarios
- Extensible to developer workflows
- Built-in safety with guardrail system

### **4. Technical Innovation**
- Sophisticated agent routing logic
- Context-aware handoffs
- Guardrail integration
- Tool-based architecture

## 🚀 **Future Enhancements**

### **Phase 2: Developer Agents**
- Code Review Agent
- Deployment Agent  
- Debug Agent
- Testing Agent

### **Phase 3: AWS Integration**
- Infrastructure Agent (EC2, S3, Lambda)
- Cost Optimization Agent
- Security Review Agent
- Monitoring Agent

### **Phase 4: Advanced Features**
- Custom agent creation
- Agent learning from conversations
- Integration with external APIs
- Advanced routing algorithms

## 🏆 **Why This Wins**

1. **Extends Amazon Q**: Adds genuine new capabilities
2. **Native Integration**: Uses MCP protocol correctly
3. **Practical Utility**: Solves real customer service problems
4. **Technical Excellence**: Sophisticated agent orchestration
5. **Extensible Platform**: Foundation for many agent types
6. **Innovation**: First multi-agent MCP server for Amazon Q

---

**Built for**: Amazon Q Hackathon  
**Challenge**: Extend Amazon Q's capability to tap into agent orchestration  
**Solution**: Native MCP server with multi-agent orchestration  
**Status**: ✅ Ready for Demo!
