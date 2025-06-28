#!/usr/bin/env node

/**
 * Test Modal Integration with Orchestration System
 */

import { ModalExecutor } from './modal_integration.js';

async function testModalIntegration() {
  console.log('🧪 Testing Modal Integration with Orchestration System\n');
  
  const modalExecutor = new ModalExecutor();
  
  // Test 1: Basic validation
  console.log('Test 1: Basic Plan Validation');
  const testPlan = {
    goal_analysis: { category: 'development', complexity: 'medium' },
    execution_steps: [
      { step: 1, action: 'analyze_code', description: 'Analyze Python code structure', tool: 'fs_read' },
      { step: 2, action: 'optimize_performance', description: 'Optimize algorithm performance', tool: 'execute_python' },
      { step: 3, action: 'validate_results', description: 'Validate optimization results', tool: 'execute_python' }
    ],
    timestamp: new Date().toISOString()
  };
  
  try {
    const validationResult = await modalExecutor.validatePlan(testPlan, 'prototype');
    console.log('✅ Prototype validation completed');
    console.log(`   Feasibility Score: ${validationResult.results.feasibility_score}%`);
    console.log(`   Prototypes Created: ${validationResult.results.prototypes_created}`);
    console.log(`   Execution Time: ${validationResult.execution_time_ms}ms\n`);
  } catch (error) {
    console.error('❌ Prototype validation failed:', error.message);
  }
  
  // Test 2: Benchmark validation
  console.log('Test 2: Benchmark Validation');
  try {
    const benchmarkResult = await modalExecutor.validatePlan(testPlan, 'benchmark');
    console.log('✅ Benchmark validation completed');
    console.log(`   Performance Score: ${benchmarkResult.results.performance_score}%`);
    console.log(`   Benchmarks Run: ${benchmarkResult.results.benchmarks_run}`);
    console.log(`   Execution Time: ${benchmarkResult.execution_time_ms}ms\n`);
  } catch (error) {
    console.error('❌ Benchmark validation failed:', error.message);
  }
  
  // Test 3: Full validation
  console.log('Test 3: Full Validation');
  try {
    const fullResult = await modalExecutor.validatePlan(testPlan, 'full_validation');
    console.log('✅ Full validation completed');
    console.log(`   Overall Confidence: ${fullResult.results.overall_confidence}%`);
    console.log(`   Implementation Readiness: ${fullResult.results.implementation_readiness}`);
    console.log(`   Execution Time: ${fullResult.execution_time_ms}ms\n`);
  } catch (error) {
    console.error('❌ Full validation failed:', error.message);
  }
  
  // Test 4: Execution statistics
  console.log('Test 4: Execution Statistics');
  const stats = modalExecutor.getExecutionStats();
  console.log('📊 Execution Statistics:');
  console.log(`   Total Executions: ${stats.total_executions}`);
  console.log(`   Success Rate: ${(stats.success_rate * 100).toFixed(1)}%`);
  console.log(`   Average Execution Time: ${stats.average_execution_time.toFixed(0)}ms`);
  console.log(`   Validation Modes Used: ${stats.validation_modes_used.join(', ')}\n`);
  
  console.log('🎯 Modal Integration Test Complete!');
  console.log('🚀 Enhanced orchestration system ready for collaborative engineering!');
}

// Run the test
testModalIntegration().catch(console.error);
