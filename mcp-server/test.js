#!/usr/bin/env node

/**
 * Test script for Amazon Q Agent Orchestra MCP Server
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🧪 Testing Amazon Q Agent Orchestra MCP Server...\n');

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
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  }) + '\n';

  server.stdin.write(initMessage);

  // Wait a bit for response
  await setTimeout(1000);

  // Send list tools request
  const listToolsMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';

  server.stdin.write(listToolsMessage);

  // Wait for response
  await setTimeout(1000);

  server.kill();

  console.log('📤 Server Error Output (startup messages):');
  console.log(errorOutput);
  
  console.log('\n📥 Server Output (MCP responses):');
  console.log(output);

  // Check if we got expected responses
  if (output.includes('tools') && output.includes('start_customer_service_session')) {
    console.log('\n✅ MCP Server test PASSED! Server is responding correctly.');
    return true;
  } else {
    console.log('\n❌ MCP Server test FAILED! Server not responding as expected.');
    return false;
  }
}

// Run the test
testMCPServer().then(success => {
  if (success) {
    console.log('\n🎉 Ready to integrate with Amazon Q CLI!');
    console.log('\n📋 Next steps:');
    console.log('1. Add this MCP server to your Amazon Q CLI configuration');
    console.log('2. Test the agent orchestration tools');
    console.log('3. Demo the multi-agent customer service workflow');
  } else {
    console.log('\n🔧 Server needs debugging before integration.');
  }
}).catch(error => {
  console.error('Test failed with error:', error);
});
