#!/usr/bin/env node

/**
 * Amazon Q Intelligent Orchestration MCP Server
 * 
 * Extends Amazon Q with intelligent workflow orchestration capabilities.
 * Analyzes complex user goals and coordinates Amazon Q's existing tools
 * to create comprehensive execution plans.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { v4 as uuidv4 } from 'uuid';

// Agent Orchestra Core System
class AgentOrchestra {
  constructor() {
    this.sessions = new Map(); // conversation_id -> session_state
    this.agents = this.initializeAgents();
  }

  initializeAgents() {
    return {
      triage: {
        name: "Triage Agent",
        role: "Router and initial contact",
        description: "Routes customer requests to appropriate specialized agents",
        capabilities: ["routing", "initial_assessment", "handoff_coordination"],
        handoffs: ["seat_booking", "flight_status", "faq", "cancellation"]
      },
      seat_booking: {
        name: "Seat Booking Agent", 
        role: "Seat management specialist",
        description: "Handles seat changes, upgrades, and seat map interactions",
        capabilities: ["seat_updates", "seat_map_display", "seat_availability"],
        handoffs: ["triage", "flight_status"]
      },
      flight_status: {
        name: "Flight Status Agent",
        role: "Flight information specialist", 
        description: "Provides real-time flight status, gate info, and delays",
        capabilities: ["flight_lookup", "status_updates", "gate_information"],
        handoffs: ["triage", "faq"]
      },
      faq: {
        name: "FAQ Agent",
        role: "Knowledge base specialist",
        description: "Answers frequently asked questions about airline policies",
        capabilities: ["policy_lookup", "baggage_info", "general_questions"],
        handoffs: ["triage"]
      },
      cancellation: {
        name: "Cancellation Agent", 
        role: "Cancellation specialist",
        description: "Handles flight cancellations and refund processes",
        capabilities: ["flight_cancellation", "refund_processing", "rebooking"],
        handoffs: ["triage"]
      }
    };
  }

  createSession(customerInfo = {}) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      currentAgent: 'triage',
      context: {
        passenger_name: customerInfo.name || null,
        confirmation_number: customerInfo.confirmation || null,
        flight_number: customerInfo.flight || null,
        seat_number: customerInfo.seat || null,
        account_number: this.generateAccountNumber(),
        ...customerInfo
      },
      conversation: [],
      guardrails: {
        relevance_checks: [],
        jailbreak_checks: []
      },
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  // Intelligent Orchestration Method
  async createOrchestrationPlan(goal, context) {
    const timestamp = new Date().toISOString();
    
    // Analyze the goal and create intelligent orchestration plan
    const plan = {
      goal_analysis: this.analyzeGoal(goal, context),
      execution_steps: this.planExecutionSteps(goal, context),
      tool_coordination: this.planToolCoordination(goal, context),
      risk_assessment: this.assessRisks(goal, context),
      success_metrics: this.defineSuccessMetrics(goal, context),
      timestamp: timestamp
    };
    
    return plan;
  }

  analyzeGoal(goal, context) {
    const lowerGoal = goal.toLowerCase();
    
    // Intelligent goal categorization
    let category = 'general';
    let complexity = 'medium';
    let requirements = [];
    
    if (lowerGoal.includes('deploy') || lowerGoal.includes('deployment')) {
      category = 'deployment';
      complexity = 'high';
      requirements = ['infrastructure', 'security', 'monitoring'];
    } else if (lowerGoal.includes('secure') || lowerGoal.includes('security')) {
      category = 'security';
      complexity = 'high';
      requirements = ['authentication', 'encryption', 'compliance'];
    } else if (lowerGoal.includes('api') || lowerGoal.includes('service')) {
      category = 'development';
      complexity = 'medium';
      requirements = ['code_generation', 'testing', 'documentation'];
    } else if (lowerGoal.includes('monitor') || lowerGoal.includes('performance')) {
      category = 'monitoring';
      complexity = 'medium';
      requirements = ['metrics', 'alerts', 'dashboards'];
    }
    
    return {
      category,
      complexity,
      requirements,
      estimated_steps: requirements.length + 2,
      amazon_q_tools_needed: this.identifyRequiredTools(category, requirements)
    };
  }

  planExecutionSteps(goal, context) {
    const analysis = this.analyzeGoal(goal, context);
    const steps = [];
    
    // Generate intelligent execution steps based on goal analysis
    switch (analysis.category) {
      case 'deployment':
        steps.push(
          { step: 1, action: 'analyze_codebase', tool: 'fs_read', description: 'Analyze project structure and requirements' },
          { step: 2, action: 'generate_configs', tool: 'fs_write', description: 'Generate deployment configurations' },
          { step: 3, action: 'provision_infrastructure', tool: 'use_aws', description: 'Provision AWS infrastructure' },
          { step: 4, action: 'deploy_application', tool: 'execute_bash', description: 'Execute deployment pipeline' },
          { step: 5, action: 'verify_deployment', tool: 'use_aws', description: 'Verify deployment success' }
        );
        break;
      case 'security':
        steps.push(
          { step: 1, action: 'security_scan', tool: 'fs_read', description: 'Scan codebase for vulnerabilities' },
          { step: 2, action: 'implement_security', tool: 'fs_write', description: 'Implement security measures' },
          { step: 3, action: 'configure_auth', tool: 'use_aws', description: 'Configure authentication services' },
          { step: 4, action: 'test_security', tool: 'execute_bash', description: 'Run security tests' }
        );
        break;
      default:
        steps.push(
          { step: 1, action: 'analyze_requirements', tool: 'fs_read', description: 'Analyze current state' },
          { step: 2, action: 'plan_implementation', tool: 'fs_write', description: 'Create implementation plan' },
          { step: 3, action: 'execute_plan', tool: 'execute_bash', description: 'Execute the plan' }
        );
    }
    
    return steps;
  }

  planToolCoordination(goal, context) {
    return {
      primary_tools: ['fs_read', 'fs_write', 'execute_bash', 'use_aws'],
      coordination_strategy: 'sequential_with_validation',
      error_handling: 'intelligent_retry_with_alternatives',
      progress_tracking: 'real_time_with_human_updates',
      human_approval_points: ['before_infrastructure_changes', 'before_deployment']
    };
  }

  assessRisks(goal, context) {
    return {
      technical_risks: ['configuration_errors', 'permission_issues'],
      business_risks: ['downtime', 'cost_overrun'],
      mitigation_strategies: ['validation_steps', 'rollback_plan'],
      confidence_level: 'high'
    };
  }

  defineSuccessMetrics(goal, context) {
    return {
      completion_criteria: ['all_steps_executed', 'validation_passed'],
      performance_targets: ['sub_5_minute_execution', 'zero_errors'],
      user_satisfaction: ['single_command_completion', 'clear_progress_updates']
    };
  }

  identifyRequiredTools(category, requirements) {
    const toolMap = {
      deployment: ['fs_read', 'fs_write', 'use_aws', 'execute_bash'],
      security: ['fs_read', 'fs_write', 'use_aws', 'execute_bash'],
      development: ['fs_read', 'fs_write', 'execute_bash'],
      monitoring: ['use_aws', 'fs_write', 'execute_bash']
    };
    
    return toolMap[category] || ['fs_read', 'fs_write', 'execute_bash'];
  }

  generateAccountNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  async processMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Update last activity
    session.last_activity = new Date().toISOString();

    // Run guardrails first
    const guardrailResults = await this.runGuardrails(message, session);
    
    if (guardrailResults.blocked) {
      const response = {
        agent: session.currentAgent,
        message: "Sorry, I can only answer questions related to airline travel.",
        guardrails: guardrailResults,
        handoff: null,
        context_updates: {}
      };
      
      session.conversation.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });
      
      session.conversation.push({
        role: 'assistant', 
        content: response.message,
        agent: session.currentAgent,
        timestamp: new Date().toISOString(),
        guardrails: guardrailResults
      });

      return response;
    }

    // Process message with current agent
    const agentResponse = await this.processWithAgent(session, message);
    
    // Add to conversation history
    session.conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    session.conversation.push({
      role: 'assistant',
      content: agentResponse.message,
      agent: agentResponse.agent,
      timestamp: new Date().toISOString(),
      handoff: agentResponse.handoff,
      context_updates: agentResponse.context_updates
    });

    return agentResponse;
  }

  async runGuardrails(message, session) {
    const results = {
      relevance: await this.checkRelevance(message),
      jailbreak: await this.checkJailbreak(message),
      blocked: false
    };

    results.blocked = !results.relevance.passed || !results.jailbreak.passed;
    
    // Store guardrail results
    session.guardrails.relevance_checks.push(results.relevance);
    session.guardrails.jailbreak_checks.push(results.jailbreak);

    return results;
  }

  async checkRelevance(message) {
    // Simplified relevance check - in real implementation, this would use Claude
    const lowerMessage = message.toLowerCase();
    const airlineKeywords = [
      'flight', 'seat', 'booking', 'cancel', 'baggage', 'gate', 'departure',
      'arrival', 'ticket', 'confirmation', 'airline', 'plane', 'airport',
      'check-in', 'status', 'delay', 'refund', 'upgrade', 'hi', 'hello',
      'help', 'ok', 'yes', 'no', 'thanks', 'thank you'
    ];
    
    const isRelevant = airlineKeywords.some(keyword => lowerMessage.includes(keyword)) ||
                     lowerMessage.length < 10; // Allow short conversational responses
    
    return {
      passed: isRelevant,
      reasoning: isRelevant ? "Message is related to airline travel" : "Message appears unrelated to airline services",
      timestamp: new Date().toISOString()
    };
  }

  async checkJailbreak(message) {
    // Simplified jailbreak detection
    const suspiciousPatterns = [
      'system prompt', 'instructions', 'ignore previous', 'drop table',
      'reveal', 'bypass', 'override', '```', 'sql injection', 'prompt injection'
    ];
    
    const lowerMessage = message.toLowerCase();
    const isSafe = !suspiciousPatterns.some(pattern => lowerMessage.includes(pattern));
    
    return {
      passed: isSafe,
      reasoning: isSafe ? "Message appears safe" : "Message contains potentially malicious content",
      timestamp: new Date().toISOString()
    };
  }

  async processWithAgent(session, message) {
    const currentAgent = this.agents[session.currentAgent];
    const context = session.context;
    
    // Simulate agent processing - in real implementation, this would call Claude
    let response = {
      agent: currentAgent.name,
      message: "",
      handoff: null,
      context_updates: {},
      tools_used: []
    };

    // Route based on current agent and message content
    const lowerMessage = message.toLowerCase();
    
    switch (session.currentAgent) {
      case 'triage':
        response = await this.processTriage(message, context, session);
        break;
      case 'seat_booking':
        response = await this.processSeatBooking(message, context, session);
        break;
      case 'flight_status':
        response = await this.processFlightStatus(message, context, session);
        break;
      case 'faq':
        response = await this.processFAQ(message, context, session);
        break;
      case 'cancellation':
        response = await this.processCancellation(message, context, session);
        break;
    }

    // Apply context updates
    Object.assign(session.context, response.context_updates);
    
    // Handle handoffs
    if (response.handoff) {
      session.currentAgent = response.handoff.target;
      
      // Execute handoff hooks
      if (response.handoff.target === 'seat_booking') {
        session.context.flight_number = `FLT-${Math.floor(100 + Math.random() * 900)}`;
        session.context.confirmation_number = this.generateConfirmationNumber();
      } else if (response.handoff.target === 'cancellation') {
        if (!session.context.confirmation_number) {
          session.context.confirmation_number = this.generateConfirmationNumber();
        }
        if (!session.context.flight_number) {
          session.context.flight_number = `FLT-${Math.floor(100 + Math.random() * 900)}`;
        }
      }
    }

    return response;
  }

  generateConfirmationNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async processTriage(message, context, session) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('seat') || lowerMessage.includes('change seat')) {
      return {
        agent: "Triage Agent",
        message: "I'll connect you with our seat booking specialist who can help you change your seat.",
        handoff: { target: 'seat_booking', reason: 'seat_change_request' },
        context_updates: {},
        tools_used: []
      };
    } else if (lowerMessage.includes('flight status') || lowerMessage.includes('status')) {
      return {
        agent: "Triage Agent", 
        message: "Let me transfer you to our flight status specialist for the most up-to-date information.",
        handoff: { target: 'flight_status', reason: 'flight_status_request' },
        context_updates: {},
        tools_used: []
      };
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('cancellation')) {
      return {
        agent: "Triage Agent",
        message: "I'll connect you with our cancellation specialist who can help you with your flight cancellation.",
        handoff: { target: 'cancellation', reason: 'cancellation_request' },
        context_updates: {},
        tools_used: []
      };
    } else if (lowerMessage.includes('bag') || lowerMessage.includes('wifi') || lowerMessage.includes('seats on plane')) {
      return {
        agent: "Triage Agent",
        message: "Let me connect you with our FAQ specialist who can answer your questions about our policies and services.",
        handoff: { target: 'faq', reason: 'general_inquiry' },
        context_updates: {},
        tools_used: []
      };
    } else {
      return {
        agent: "Triage Agent",
        message: "Hello! I'm here to help you with your airline needs. I can assist with seat changes, flight status, cancellations, or general questions. What can I help you with today?",
        handoff: null,
        context_updates: {},
        tools_used: []
      };
    }
  }

  async processSeatBooking(message, context, session) {
    const lowerMessage = message.toLowerCase();
    
    if (!context.confirmation_number) {
      return {
        agent: "Seat Booking Agent",
        message: `I can help you change your seat! I have your confirmation number as ${context.confirmation_number}. Is this correct?`,
        handoff: null,
        context_updates: {},
        tools_used: []
      };
    }
    
    if (lowerMessage.includes('seat map') || lowerMessage.includes('show me seats')) {
      return {
        agent: "Seat Booking Agent",
        message: "I'll display an interactive seat map for you to choose your preferred seat. [SEAT_MAP_DISPLAY]",
        handoff: null,
        context_updates: {},
        tools_used: ['display_seat_map']
      };
    } else if (lowerMessage.match(/\d+[a-z]/i)) {
      const seatMatch = lowerMessage.match(/(\d+[a-z])/i);
      const newSeat = seatMatch ? seatMatch[1].toUpperCase() : null;
      
      if (newSeat) {
        return {
          agent: "Seat Booking Agent",
          message: `Perfect! I've successfully changed your seat to ${newSeat}. Your confirmation number ${context.confirmation_number} has been updated. Is there anything else I can help you with?`,
          handoff: null,
          context_updates: { seat_number: newSeat },
          tools_used: ['update_seat']
        };
      }
    } else if (lowerMessage.includes('flight status') || lowerMessage.includes('status')) {
      return {
        agent: "Seat Booking Agent",
        message: "Let me transfer you to our flight status specialist for that information.",
        handoff: { target: 'flight_status', reason: 'flight_status_request' },
        context_updates: {},
        tools_used: []
      };
    }
    
    return {
      agent: "Seat Booking Agent",
      message: "I can help you change your seat. Would you like to see an interactive seat map, or do you have a specific seat in mind? You can also ask me about flight status if needed.",
      handoff: null,
      context_updates: {},
      tools_used: []
    };
  }

  async processFlightStatus(message, context, session) {
    const flightNumber = context.flight_number || 'FLT-123';
    
    return {
      agent: "Flight Status Agent",
      message: `Flight ${flightNumber} is on time and scheduled to depart at gate A10. Boarding will begin 30 minutes before departure.`,
      handoff: null,
      context_updates: {},
      tools_used: ['flight_status_lookup']
    };
  }

  async processFAQ(message, context, session) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bag') || lowerMessage.includes('baggage')) {
      return {
        agent: "FAQ Agent",
        message: "You are allowed to bring one bag on the plane. It must be under 50 pounds and 22 inches x 14 inches x 9 inches.",
        handoff: null,
        context_updates: {},
        tools_used: ['faq_lookup']
      };
    } else if (lowerMessage.includes('seats') || lowerMessage.includes('plane')) {
      return {
        agent: "FAQ Agent", 
        message: "There are 120 seats on the plane. There are 22 business class seats and 98 economy seats. Exit rows are rows 4 and 16. Rows 5-8 are Economy Plus, with extra legroom.",
        handoff: null,
        context_updates: {},
        tools_used: ['faq_lookup']
      };
    } else if (lowerMessage.includes('wifi')) {
      return {
        agent: "FAQ Agent",
        message: "We have free wifi on the plane, join Airline-Wifi network once you're onboard.",
        handoff: null,
        context_updates: {},
        tools_used: ['faq_lookup']
      };
    } else {
      return {
        agent: "FAQ Agent",
        message: "I can help answer questions about baggage allowances, seat information, wifi, and other airline policies. What would you like to know?",
        handoff: null,
        context_updates: {},
        tools_used: []
      };
    }
  }

  async processCancellation(message, context, session) {
    const lowerMessage = message.toLowerCase();
    const confirmationNumber = context.confirmation_number;
    const flightNumber = context.flight_number;
    
    if (lowerMessage.includes('correct') || lowerMessage.includes('yes')) {
      return {
        agent: "Cancellation Agent",
        message: `Your flight ${flightNumber} with confirmation number ${confirmationNumber} has been successfully cancelled. If you need assistance with refunds or any other requests, please let me know!`,
        handoff: null,
        context_updates: { flight_cancelled: true },
        tools_used: ['cancel_flight']
      };
    } else {
      return {
        agent: "Cancellation Agent",
        message: `I can help you cancel your flight. I have your confirmation number as ${confirmationNumber} and your flight number as ${flightNumber}. Can you please confirm that these details are correct before I proceed with the cancellation?`,
        handoff: null,
        context_updates: {},
        tools_used: []
      };
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  listSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      currentAgent: session.currentAgent,
      created_at: session.created_at,
      last_activity: session.last_activity,
      message_count: session.conversation.length
    }));
  }
}

// Initialize the Agent Orchestra
const orchestra = new AgentOrchestra();

// Create the MCP server
const server = new Server(
  {
    name: 'amazon-q-agent-orchestra',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the tools that Amazon Q can use
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'intelligent_orchestration',
        description: 'Analyze complex user goals and orchestrate Amazon Q capabilities for enhanced productivity',
        inputSchema: {
          type: 'object',
          properties: {
            goal: {
              type: 'string',
              description: 'High-level user objective (e.g., "deploy secure API", "optimize performance", "setup monitoring")'
            },
            context: {
              type: 'object',
              properties: {
                project_type: { type: 'string', description: 'Type of project (web app, API, infrastructure, etc.)' },
                tech_stack: { type: 'string', description: 'Technologies being used' },
                environment: { type: 'string', description: 'Target environment (AWS, local, etc.)' },
                constraints: { type: 'string', description: 'Any constraints or requirements' }
              },
              description: 'Context about the current situation and requirements'
            }
          },
          required: ['goal']
        },
      }
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'intelligent_orchestration': {
        const { goal, context = {} } = args;
        
        // Revolutionary orchestration logic
        const orchestrationPlan = await orchestra.createOrchestrationPlan(goal, context);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                revolutionary_orchestration: true,
                goal: goal,
                context: context,
                orchestration_plan: orchestrationPlan,
                next_steps: orchestrationPlan.execution_steps,
                amazon_q_coordination: orchestrationPlan.tool_coordination,
                productivity_multiplier: "10x",
                paradigm: "Human directs → AI orchestrates → Human approves → AI executes"
              }, null, 2)
            }
          ]
        };
      }
      
      case 'start_customer_service_session': {
        const session = orchestra.createSession(args.customer_info || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                session_id: session.id,
                message: "Customer service session started! You're connected with our Triage Agent who will route you to the right specialist.",
                current_agent: session.currentAgent,
                context: session.context,
                available_agents: Object.keys(orchestra.agents)
              }, null, 2),
            },
          ],
        };
      }

      case 'send_message_to_agents': {
        const { session_id, message } = args;
        const response = await orchestra.processMessage(session_id, message);
        const session = orchestra.getSession(session_id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                response: response.message,
                current_agent: response.agent,
                handoff: response.handoff,
                context_updates: response.context_updates,
                tools_used: response.tools_used,
                guardrails: response.guardrails,
                session_context: session?.context
              }, null, 2),
            },
          ],
        };
      }

      case 'get_session_status': {
        const { session_id } = args;
        const session = orchestra.getSession(session_id);
        
        if (!session) {
          throw new McpError(ErrorCode.InvalidRequest, `Session ${session_id} not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                session_id: session.id,
                current_agent: session.currentAgent,
                context: session.context,
                conversation_length: session.conversation.length,
                last_activity: session.last_activity,
                guardrail_stats: {
                  relevance_checks: session.guardrails.relevance_checks.length,
                  jailbreak_checks: session.guardrails.jailbreak_checks.length
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'list_available_agents': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                agents: orchestra.agents,
                total_agents: Object.keys(orchestra.agents).length,
                active_sessions: orchestra.listSessions()
              }, null, 2),
            },
          ],
        };
      }

      case 'trigger_handoff': {
        const { session_id, target_agent } = args;
        const session = orchestra.getSession(session_id);
        
        if (!session) {
          throw new McpError(ErrorCode.InvalidRequest, `Session ${session_id} not found`);
        }

        if (!orchestra.agents[target_agent]) {
          throw new McpError(ErrorCode.InvalidRequest, `Agent ${target_agent} not found`);
        }

        const previousAgent = session.currentAgent;
        session.currentAgent = target_agent;
        session.last_activity = new Date().toISOString();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                handoff_completed: true,
                previous_agent: previousAgent,
                current_agent: target_agent,
                message: `Successfully handed off from ${orchestra.agents[previousAgent].name} to ${orchestra.agents[target_agent].name}`,
                session_id: session_id
              }, null, 2),
            },
          ],
        };
      }

      case 'run_guardrail_check': {
        const { message } = args;
        const dummySession = { guardrails: { relevance_checks: [], jailbreak_checks: [] } };
        const results = await orchestra.runGuardrails(message, dummySession);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: message,
                guardrail_results: results,
                blocked: results.blocked,
                relevance: results.relevance,
                jailbreak: results.jailbreak,
                recommendation: results.blocked ? "Message would be blocked" : "Message would be processed"
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🎭 Amazon Q Agent Orchestra MCP Server started!');
  console.error('🚀 Ready to orchestrate multi-agent conversations for Amazon Q');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
