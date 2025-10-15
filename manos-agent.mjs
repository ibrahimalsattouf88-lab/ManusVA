#!/usr/bin/env node

/**
 * Manos Agent - Automated Task Execution Agent
 * This agent polls the VA server for pending tasks and executes them by calling Manus API.
 */

import fetch from 'node-fetch';

const BASE = process.env.VA_BASE ?? 'http://localhost:8080';
const MANOS_API_KEY = process.env.MANOS_API_KEY;
const MANOS_API_URL = process.env.MANUS_API_URL || 'https://api.manus.im/v1';

const HEAD = { 
  'Authorization': `Bearer ${process.env.MANOS_TOKEN}`, 
  'Content-Type':'application/json' 
};

if (!MANOS_API_KEY) {
  console.error('Error: MANOS_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * Call Manus API to execute a task
 */
async function callManusAPI(prompt) {
  try {
    const response = await fetch(`${MANOS_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANOS_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'manus-1',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Manus API error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'No response from Manus';
  } catch (error) {
    throw new Error(`Failed to call Manus API: ${error.message}`);
  }
}

/**
 * Execute a task by calling Manus API with appropriate instructions
 */
async function execTask(task){
  const { type, payload } = task;
  
  console.log(`Executing task type: ${type}`);
  
  let prompt = '';
  
  // Build the appropriate prompt based on task type
  switch(type) {
    case 'va.ws.health':
      prompt = 'Check the WebSocket health status and return a health report.';
      break;
      
    case 'va.cmd.replay':
      prompt = `Replay the following voice command that failed: ${JSON.stringify(payload)}`;
      break;
      
    case 'asr.install_models':
      prompt = 'Install and configure ASR models (whisper.cpp and Vosk) for Arabic speech recognition. Return installation status.';
      break;
      
    case 'asr.switch_offline_on_fail':
      prompt = 'Switch ASR to offline mode due to network failure. Configure fallback to local models.';
      break;
      
    case 'analytics.rollup_daily':
      prompt = 'Perform daily analytics rollup: aggregate user engagement, VA performance metrics, and behavioral insights.';
      break;
      
    case 'analytics.behavioral_insights.sync':
      prompt = 'Sync behavioral insights from va_phrase_stats table and generate user behavior patterns.';
      break;
      
    case 'fx.refresh':
      prompt = 'Refresh Syrian Pound (SYP) black market exchange rates from 5 sources, filter anomalies, and calculate weighted average.';
      break;
      
    case 'fx.validate_anomalies':
      prompt = 'Validate FX data for anomalies, remove outliers, and ensure data integrity.';
      break;
      
    case 'sec.rls_audit':
      prompt = 'Audit Row Level Security (RLS) policies for all sensitive tables in Supabase. Report any security issues.';
      break;
      
    case 'sec.service_paths.lint':
      prompt = 'Lint all service API paths for security vulnerabilities, authentication issues, and authorization problems.';
      break;
      
    case 'ci.smoke':
      prompt = 'Run smoke tests after deployment: test all critical endpoints, verify database connectivity, check WebSocket functionality.';
      break;
      
    case 'ci.uat_report':
      prompt = 'Generate User Acceptance Testing (UAT) report with all test scenarios and results. Format: 0 failures / 0 errors.';
      break;
      
    case 'ci.rollback_on_fail':
      prompt = 'Deployment failed. Perform automatic rollback to the last stable version.';
      break;
      
    case 'build.apk.release':
      prompt = 'Build and sign release APK for both Smart Assistant and Control Panel Flutter applications. Configure Codemagic CI/CD pipeline.';
      break;
      
    case 'handover.generate_brief':
      prompt = 'Generate handover documentation (PDF) including: setup instructions, environment variables, API documentation, and UAT checklist.';
      break;
      
    case 'accounting.add_purchase':
      prompt = `Add a purchase to the accounting system with the following details: ${JSON.stringify(payload)}`;
      break;
      
    default:
      prompt = `Execute the following task: Type: ${type}, Payload: ${JSON.stringify(payload)}`;
  }
  
  // Call Manus API to execute the task
  try {
    const manusResponse = await callManusAPI(prompt);
    return { 
      ok: true, 
      result: manusResponse,
      type: type,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { 
      ok: false, 
      error: error.message,
      type: type
    };
  }
}

/**
 * Main polling loop
 */
async function loop(){
  while(true){
    try {
      const next = await fetch(`${BASE}/ops/next`, { method:'POST', headers: HEAD });
      const { task } = await next.json();
      
      if(!task){ 
        await new Promise(r=>setTimeout(r, 1500)); 
        continue; 
      }
      
      console.log(`\n[${new Date().toISOString()}] Received task: ${task.id} (${task.type})`);
      
      try {
        const res = await execTask(task);
        await fetch(`${BASE}/ops/complete`, {
          method:'POST', 
          headers: HEAD, 
          body: JSON.stringify({ 
            id: task.id, 
            ok: !!res.ok, 
            result: res, 
            error: res.error 
          })
        });
        console.log(`[${new Date().toISOString()}] Task ${task.id} completed: ${res.ok ? 'SUCCESS' : 'FAILED'}`);
        if (res.ok && res.result) {
          console.log(`Result preview: ${res.result.substring(0, 200)}...`);
        }
      } catch (e) {
        await fetch(`${BASE}/ops/complete`, {
          method:'POST', 
          headers: HEAD, 
          body: JSON.stringify({ 
            id: task.id, 
            ok:false, 
            error: String(e) 
          })
        });
        console.error(`[${new Date().toISOString()}] Task ${task.id} failed with exception:`, e);
      }
    } catch (e) {
      console.error(`[${new Date().toISOString()}] Polling error:`, e.message);
      await new Promise(r=>setTimeout(r, 5000)); // Wait 5 seconds before retrying
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down Manos Agent...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nShutting down Manos Agent...');
  process.exit(0);
});

// Start the agent
console.log('='.repeat(60));
console.log('Manos Agent started.');
console.log(`VA Server URL: ${BASE}`);
console.log(`Manus API URL: ${MANOS_API_URL}`);
console.log(`Authorization: ${HEAD.Authorization ? 'Configured' : 'Missing'}`);
console.log(`Manus API Key: ${MANOS_API_KEY ? 'Configured' : 'Missing'}`);
console.log('='.repeat(60));
console.log('');

loop();

