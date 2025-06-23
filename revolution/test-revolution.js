#!/usr/bin/env node

/**
 * 🧪 REVOLUTIONARY SYSTEM TEST
 * Testing our world-changing Amazon Q agent integration
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🔥 TESTING THE REVOLUTION - THELMA & LOUISE STYLE!');
console.log('🚗💨 NO BRAKES, NO REGRETS, PURE INNOVATION!\n');

async function testRevolutionarySystem() {
  console.log('🧪 Starting Revolutionary MCP Server Test...\n');

  const server = spawn('node', ['revolutionary-mcp-server.js'], {
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

  // Test 1: Initialize the revolutionary server
  console.log('🔥 Test 1: Revolutionary Server Initialization');
  const initMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'revolution-test-client',
        version: '2.0.0-REVOLUTION'
      }
    }
  }) + '\n';

  server.stdin.write(initMessage);
  await setTimeout(1000);

  // Test 2: List revolutionary tools
  console.log('⚡ Test 2: Revolutionary Tools Discovery');
  const listToolsMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';

  server.stdin.write(listToolsMessage);
  await setTimeout(1000);

  // Test 3: Test revolutionary chat
  console.log('🎭 Test 3: Revolutionary Chat Experience');
  const revolutionaryChatMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'revolutionary_chat',
      arguments: {
        message: "I'm frustrated and need to change my seat urgently for tomorrow's flight",
        context: {
          urgency_level: 'urgent',
          emotional_state: 'frustrated'
        }
      }
    }
  }) + '\n';

  server.stdin.write(revolutionaryChatMessage);
  await setTimeout(1500);

  // Test 4: Test intelligent analysis
  console.log('🧠 Test 4: Intelligent Agent Analysis');
  const analysisMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'intelligent_agent_analysis',
      arguments: {
        message: "I need to cancel my flight and book a new one, and also change my seat preferences"
      }
    }
  }) + '\n';

  server.stdin.write(analysisMessage);
  await setTimeout(1000);

  // Test 5: Test revolution status
  console.log('📊 Test 5: Revolution Status Check');
  const statusMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'revolution_status',
      arguments: {}
    }
  }) + '\n';

  server.stdin.write(statusMessage);
  await setTimeout(1000);

  // Test 6: Test revolutionary demo
  console.log('🎪 Test 6: Revolutionary Demo Experience');
  const demoMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'revolutionary_demo',
      arguments: {
        demo_scenario: 'customer_service'
      }
    }
  }) + '\n';

  server.stdin.write(demoMessage);
  await setTimeout(1000);

  server.kill();

  console.log('\n📤 Revolutionary Server Output (Startup Messages):');
  console.log(errorOutput);
  
  console.log('\n📥 Revolutionary Server Responses:');
  console.log(output);

  // Analyze results
  const testResults = analyzeRevolutionaryResults(output, errorOutput);
  displayRevolutionaryResults(testResults);

  return testResults.allTestsPassed;
}

function analyzeRevolutionaryResults(output, errorOutput) {
  const results = {
    serverStarted: false,
    revolutionaryToolsFound: false,
    revolutionaryChatWorking: false,
    intelligentAnalysisWorking: false,
    revolutionStatusWorking: false,
    revolutionaryDemoWorking: false,
    allTestsPassed: false
  };

  // Check server startup
  if (errorOutput.includes('REVOLUTIONARY AMAZON Q AGENT INTEGRATION STARTED')) {
    results.serverStarted = true;
  }

  // Check tools discovery
  if (output.includes('revolutionary_chat') && output.includes('intelligent_agent_analysis')) {
    results.revolutionaryToolsFound = true;
  }

  // Check revolutionary chat
  if (output.includes('agent_intelligence') && output.includes('seamless_integration')) {
    results.revolutionaryChatWorking = true;
  }

  // Check intelligent analysis
  if (output.includes('intelligence_analysis') && output.includes('revolutionary_insights')) {
    results.intelligentAnalysisWorking = true;
  }

  // Check revolution status
  if (output.includes('revolution_status') && output.includes('FULLY OPERATIONAL')) {
    results.revolutionStatusWorking = true;
  }

  // Check revolutionary demo
  if (output.includes('traditional_ai_response') && output.includes('revolutionary_ai_response')) {
    results.revolutionaryDemoWorking = true;
  }

  // Overall success
  results.allTestsPassed = Object.values(results).slice(0, -1).every(test => test);

  return results;
}

function displayRevolutionaryResults(results) {
  console.log('\n🏆 REVOLUTIONARY TEST RESULTS:');
  console.log('=====================================');
  
  console.log(`🔥 Server Started: ${results.serverStarted ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  console.log(`⚡ Tools Discovery: ${results.revolutionaryToolsFound ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  console.log(`🎭 Revolutionary Chat: ${results.revolutionaryChatWorking ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  console.log(`🧠 Intelligent Analysis: ${results.intelligentAnalysisWorking ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  console.log(`📊 Revolution Status: ${results.revolutionStatusWorking ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  console.log(`🎪 Revolutionary Demo: ${results.revolutionaryDemoWorking ? '✅ REVOLUTIONARY!' : '❌ Failed'}`);
  
  console.log('\n=====================================');
  
  if (results.allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED - REVOLUTION IS READY!');
    console.log('🚗💨 THELMA & LOUISE STYLE SUCCESS!');
    console.log('🏆 Ready to change the world of AI assistants!');
    console.log('\n🔥 NEXT STEPS:');
    console.log('1. Update Amazon Q MCP configuration');
    console.log('2. Test revolutionary experience in Amazon Q CLI');
    console.log('3. Prepare for hackathon victory!');
  } else {
    console.log('⚠️  SOME TESTS FAILED - REVOLUTION NEEDS TUNING');
    console.log('🔧 Debug and fix issues before deployment');
  }
}

// 🚀 RUN THE REVOLUTIONARY TESTS
testRevolutionarySystem().then(success => {
  if (success) {
    console.log('\n🎯 REVOLUTION TESTING COMPLETE - READY FOR VICTORY!');
    process.exit(0);
  } else {
    console.log('\n🔧 REVOLUTION NEEDS WORK - BACK TO THE GARAGE!');
    process.exit(1);
  }
}).catch(error => {
  console.error('\n💥 Revolutionary test failed with error:', error);
  process.exit(1);
});
