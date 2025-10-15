#!/usr/bin/env node

/**
 * Manos Agent - Automated Task Execution Agent
 * This agent polls the VA server for pending tasks and executes them automatically.
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VA_SERVER_URL = process.env.VA_SERVER_URL || 'http://localhost:8080';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000'); // 5 seconds default

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Fetch pending tasks from the VA server
 */
async function fetchPendingTasks() {
  try {
    const response = await fetch(`${VA_SERVER_URL}/ops/task/pending`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Error fetching pending tasks:', error.message);
    return [];
  }
}

/**
 * Update task status
 */
async function updateTaskStatus(taskId, status, result = null) {
  try {
    const response = await fetch(`${VA_SERVER_URL}/ops/task/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, status, result }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error.message);
    return null;
  }
}

/**
 * Execute a task based on its payload
 */
async function executeTask(task) {
  console.log(`Executing task ${task.id}...`);
  
  try {
    // Update status to 'processing'
    await updateTaskStatus(task.id, 'processing');

    const { payload } = task;
    let result = {};

    // Task execution logic based on payload type
    if (payload?.type === 'voice_command') {
      // Handle voice command execution
      result = await handleVoiceCommand(payload);
    } else if (payload?.type === 'scheduled_task') {
      // Handle scheduled task execution
      result = await handleScheduledTask(payload);
    } else if (payload?.type === 'automation') {
      // Handle general automation task
      result = await handleAutomation(payload);
    } else {
      throw new Error(`Unknown task type: ${payload?.type}`);
    }

    // Update status to 'completed'
    await updateTaskStatus(task.id, 'completed', result);
    console.log(`Task ${task.id} completed successfully.`);
  } catch (error) {
    console.error(`Error executing task ${task.id}:`, error.message);
    await updateTaskStatus(task.id, 'failed', { error: error.message });
  }
}

/**
 * Handle voice command execution
 */
async function handleVoiceCommand(payload) {
  console.log('Handling voice command:', payload);
  
  // Example: Execute a voice command
  // This is where you would integrate with external services or APIs
  
  return {
    success: true,
    message: 'Voice command executed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle scheduled task execution
 */
async function handleScheduledTask(payload) {
  console.log('Handling scheduled task:', payload);
  
  // Example: Execute a scheduled task
  // This could involve sending notifications, updating data, etc.
  
  return {
    success: true,
    message: 'Scheduled task executed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle general automation task
 */
async function handleAutomation(payload) {
  console.log('Handling automation task:', payload);
  
  // Example: Execute an automation task
  // This could involve complex workflows, API calls, data processing, etc.
  
  return {
    success: true,
    message: 'Automation task executed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Main polling loop
 */
async function pollAndExecute() {
  console.log('Polling for pending tasks...');
  
  const tasks = await fetchPendingTasks();
  
  if (tasks.length > 0) {
    console.log(`Found ${tasks.length} pending task(s).`);
    
    // Execute tasks sequentially
    for (const task of tasks) {
      await executeTask(task);
    }
  } else {
    console.log('No pending tasks found.');
  }
}

/**
 * Start the agent
 */
async function startAgent() {
  console.log('Manos Agent started.');
  console.log(`VA Server URL: ${VA_SERVER_URL}`);
  console.log(`Poll Interval: ${POLL_INTERVAL}ms`);
  console.log('---');
  
  // Initial poll
  await pollAndExecute();
  
  // Set up recurring poll
  setInterval(async () => {
    await pollAndExecute();
  }, POLL_INTERVAL);
}

// Start the agent
startAgent().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

