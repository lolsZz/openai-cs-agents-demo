#!/usr/bin/env node

/**
 * Test script for Amazon Q Intelligent Orchestration MCP Server
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🧪 Testing Amazon Q Intelligent Orchestration MCP Server...\n');

// Test the MCP server by sending it MCP protocol messages
async function testMCPServer() {
  const server = spawn('node', ['index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errorOutput = '';

  server.stdout.on('data', (data) => {
    output += data.toString();
  });

  server.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  // Send initialization message
  const initMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  }) + '\n';

  // Send list tools message
  const listToolsMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list"
  }) + '\n';

  server.stdin.write(initMessage);
  server.stdin.write(listToolsMessage);

  // Wait for responses
  await setTimeout(2000);

  server.kill();

  console.log('📤 Server Error Output (startup messages):');
  console.log(errorOutput);
  console.log('\n📥 Server Output (MCP responses):');
  console.log(output);

  // Check if we got the expected intelligent_orchestration tool
  const hasIntelligentOrchestration = output.includes('intelligent_orchestration');
  const hasOldCustomerService = output.includes('start_customer_service_session');

  if (hasIntelligentOrchestration && !hasOldCustomerService) {
    console.log('\n✅ MCP Server test PASSED! Clean intelligent orchestration implementation.');
    console.log('\n🎉 Ready to integrate with Amazon Q CLI!');
    console.log('\n📋 Next steps:');
    console.log('1. Add this MCP server to your Amazon Q CLI configuration');
    console.log('2. Test the intelligent orchestration tool');
    console.log('3. Demo complex workflow orchestration');
  } else if (hasOldCustomerService) {
    console.log('\n❌ MCP Server test FAILED! Still contains old customer service tools.');
    console.log('🔧 Server needs cleanup to remove airline customer service functionality.');
  } else {
    console.log('\n❌ MCP Server test FAILED! Server not responding as expected.');
    console.log('🔧 Server needs debugging before integration.');
  }
}

testMCPServer().catch(console.error);
