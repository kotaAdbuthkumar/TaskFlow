import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB at: ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    await Notification.deleteMany();
    console.log('[Seed] Cleared existing database records.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Alex Morgan',
        email: 'admin@taskflow.com',
        password: 'Admin@12345',
        role: 'admin',
        bio: 'Lead System Architect & TaskFlow Administrator.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        theme: 'system',
      },
      {
        name: 'John Doe',
        email: 'john@taskflow.com',
        password: 'User@12345',
        role: 'user',
        bio: 'Senior Full Stack Software Engineer passionate about web performance and UI/UX.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        theme: 'light',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@taskflow.com',
        password: 'User@12345',
        role: 'user',
        bio: 'UI/UX Product Designer crafting accessible and clean digital experiences.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        theme: 'light',
      },
      {
        name: 'Michael Scott',
        email: 'michael@taskflow.com',
        password: 'User@12345',
        role: 'user',
        bio: 'Engineering Team Manager & Scrum Master.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        theme: 'dark',
      },
      {
        name: 'Emily Watson',
        email: 'emily@taskflow.com',
        password: 'User@12345',
        role: 'user',
        bio: 'Cloud DevOps Specialist & Site Reliability Engineer.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        theme: 'system',
      },
    ]);

    const [admin, john, sarah, michael, emily] = users;
    console.log(`[Seed] Created ${users.length} users.`);

    // 2. Create Projects
    const projects = await Project.create([
      {
        name: 'Web Development',
        description: 'Modern SaaS productivity application built with React, Tailwind CSS, Express, and MongoDB.',
        color: '#6366f1', // Indigo
        owner: john._id,
        members: [john._id, sarah._id, admin._id],
      },
      {
        name: 'IoT Project',
        description: 'Smart environmental monitoring dashboard using ESP32 microcontrollers, MQTT, and telemetry visualizers.',
        color: '#f59e0b', // Amber
        owner: emily._id,
        members: [emily._id, john._id],
      },
      {
        name: 'College',
        description: 'Semester coursework, Distributed Systems assignments, Computer Vision lab, and Final Thesis.',
        color: '#8b5cf6', // Purple
        owner: john._id,
        members: [john._id],
      },
      {
        name: 'Personal',
        description: 'Daily health tracking, home renovation plans, budgeting, and lifestyle goals.',
        color: '#10b981', // Emerald
        owner: john._id,
        members: [john._id],
      },
      {
        name: 'Learning',
        description: 'Advanced System Design patterns, Kubernetes certification prep, and Rust concurrency.',
        color: '#ec4899', // Pink
        owner: admin._id,
        members: [admin._id, john._id, michael._id],
      },
    ]);

    const [webDev, iot, college, personal, learning] = projects;
    console.log(`[Seed] Created ${projects.length} projects.`);

    // Compute dates relative to current local time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0);
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
    const in3Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 15, 0);
    const in5Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 20, 0);
    const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 12, 0);
    const overdue2Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 0);
    const overdue5Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 11, 0);
    const completed2DaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 16, 30);
    const completedYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 15);

    // 3. Create Realistic Tasks
    const tasks = await Task.create([
      {
        title: 'Design high-converting landing page',
        description: 'Create responsive SaaS landing page wireframes with interactive hero, feature grid, and testimonials.',
        status: 'Completed',
        priority: 'High',
        startDate: overdue5Days,
        dueDate: overdue2Days,
        project: webDev._id,
        tags: ['design', 'ui', 'marketing'],
        assignedTo: sarah._id,
        createdBy: john._id,
        completedAt: completedYesterday,
        subtasks: [
          { title: 'Define brand colors and typography scale', completed: true },
          { title: 'Create interactive hero section layout', completed: true },
          { title: 'Design features comparison table', completed: true },
          { title: 'Figma prototype validation with team', completed: true },
        ],
      },
      {
        title: 'Build Portfolio Website',
        description: 'Complete personal portfolio showcase with dark theme, responsive grid, dynamic project modal, and contact form.',
        status: 'In Progress',
        priority: 'Urgent',
        startDate: overdue2Days,
        dueDate: today,
        project: personal._id,
        tags: ['portfolio', 'frontend', 'react'],
        assignedTo: john._id,
        createdBy: john._id,
        subtasks: [
          { title: 'Design homepage layout', completed: true },
          { title: 'Create navbar with responsive mobile drawer', completed: true },
          { title: 'Build projects filter section', completed: true },
          { title: 'Add contact form with validation', completed: false },
          { title: 'Deploy website on custom domain', completed: false },
        ],
      },
      {
        title: 'Implement JWT Authentication & Refresh Flow',
        description: 'Secure all REST endpoints using token-based authentication with bcrypt password hashing and role authorization.',
        status: 'Completed',
        priority: 'Urgent',
        startDate: overdue5Days,
        dueDate: overdue2Days,
        project: webDev._id,
        tags: ['backend', 'security', 'jwt', 'auth'],
        assignedTo: john._id,
        createdBy: admin._id,
        completedAt: completed2DaysAgo,
        subtasks: [
          { title: 'Configure User mongoose model schema', completed: true },
          { title: 'Implement bcrypt salt hashing on save', completed: true },
          { title: 'Build auth middleware with Bearer token decode', completed: true },
          { title: 'Write tests for expired token responses', completed: true },
        ],
      },
      {
        title: 'Calibrate ESP32 DHT22 Temperature Sensors',
        description: 'Verify accuracy against calibrated thermometer across cold and room temperatures in laboratory test bench.',
        status: 'Todo',
        priority: 'Medium',
        startDate: today,
        dueDate: in3Days,
        project: iot._id,
        tags: ['iot', 'hardware', 'sensors'],
        assignedTo: emily._id,
        createdBy: emily._id,
        subtasks: [
          { title: 'Wire breadboard connections with pull-up resistor', completed: true },
          { title: 'Flash ESP-IDF firmware via serial monitor', completed: false },
          { title: 'Capture 24h sample telemetry data', completed: false },
        ],
      },
      {
        title: 'Distributed Systems Term Paper Draft',
        description: 'Literature review on Raft consensus algorithm vs Paxos in distributed database leader election scenarios.',
        status: 'In Progress',
        priority: 'High',
        startDate: overdue2Days,
        dueDate: in5Days,
        project: college._id,
        tags: ['college', 'research', 'algorithms'],
        assignedTo: john._id,
        createdBy: john._id,
        subtasks: [
          { title: 'Collect 10 peer-reviewed papers from IEEE & ACM', completed: true },
          { title: 'Write introduction and problem formulation', completed: true },
          { title: 'Draft comparison benchmark section', completed: false },
          { title: 'Format citations in IEEE LaTeX template', completed: false },
        ],
      },
      {
        title: 'Weekly 10K Distance Running & Fitness Review',
        description: 'Maintain cardio baseline target and track resting heart rate metrics in health log.',
        status: 'Todo',
        priority: 'Low',
        startDate: today,
        dueDate: tomorrow,
        project: personal._id,
        tags: ['health', 'fitness', 'habits'],
        assignedTo: john._id,
        createdBy: john._id,
        subtasks: [
          { title: 'Hydration and carbohydrate intake planning', completed: false },
          { title: '5km warm-up tempo run', completed: false },
          { title: 'Post-workout mobility routine', completed: false },
        ],
      },
      {
        title: 'Study Kubernetes Operator Pattern & CRDs',
        description: 'Build custom controller using Kubebuilder to automate Postgres cluster state failovers.',
        status: 'In Progress',
        priority: 'High',
        startDate: overdue2Days,
        dueDate: in5Days,
        project: learning._id,
        tags: ['devops', 'kubernetes', 'golang'],
        assignedTo: admin._id,
        createdBy: admin._id,
        subtasks: [
          { title: 'Read Kubernetes documentation on Custom Resources', completed: true },
          { title: 'Scaffold project with operator-sdk', completed: true },
          { title: 'Implement reconciler loop state check', completed: false },
          { title: 'Deploy on local Minikube cluster', completed: false },
        ],
      },
      {
        title: 'Fix mobile viewport horizontal scroll bug',
        description: 'Tables in dashboard view exceed viewport on screens below 380px width, causing horizontal overflow.',
        status: 'Todo',
        priority: 'Urgent',
        startDate: today,
        dueDate: today,
        project: webDev._id,
        tags: ['bug', 'css', 'mobile', 'frontend'],
        assignedTo: sarah._id,
        createdBy: michael._id,
        subtasks: [
          { title: 'Inspect CSS overflow properties in DevTools', completed: false },
          { title: 'Add overflow-x-auto container wrapper', completed: false },
          { title: 'Verify layout on iPhone SE and Galaxy S20', completed: false },
        ],
      },
      {
        title: 'Setup MQTT Broker with TLS Encryption',
        description: 'Deploy Mosquitto MQTT broker on cloud server with Let’s Encrypt SSL/TLS certificates and ACL authorization.',
        status: 'Todo',
        priority: 'Medium',
        startDate: in3Days,
        dueDate: nextWeek,
        project: iot._id,
        tags: ['iot', 'mqtt', 'security', 'devops'],
        assignedTo: emily._id,
        createdBy: emily._id,
        subtasks: [
          { title: 'Provision Ubuntu 24.04 droplet', completed: false },
          { title: 'Install Mosquitto and configure password file', completed: false },
          { title: 'Generate TLS certificates with Certbot', completed: false },
        ],
      },
      {
        title: 'Prepare Computer Vision Final Exam Flashcards',
        description: 'Review Convolutional Neural Networks, YOLO object detection architectures, and optical flow formulas.',
        status: 'In Progress',
        priority: 'High',
        startDate: overdue2Days,
        dueDate: in3Days,
        project: college._id,
        tags: ['college', 'ai', 'exam'],
        assignedTo: john._id,
        createdBy: john._id,
        subtasks: [
          { title: 'Review lecture notes weeks 1-6', completed: true },
          { title: 'Create Anki flashcards for backpropagation math', completed: true },
          { title: 'Solve 3 previous year exam question sets', completed: false },
        ],
      },
      {
        title: 'Audit application WCAG 2.1 AA Accessibility',
        description: 'Run automated Lighthouse tests and manual screen reader audits on navigation, modals, and forms.',
        status: 'Completed',
        priority: 'Medium',
        startDate: overdue5Days,
        dueDate: overdue2Days,
        project: webDev._id,
        tags: ['a11y', 'testing', 'frontend'],
        assignedTo: sarah._id,
        createdBy: admin._id,
        completedAt: completedYesterday,
        subtasks: [
          { title: 'Check color contrast ratios against 4.5:1 standard', completed: true },
          { title: 'Ensure all buttons and inputs have aria labels', completed: true },
          { title: 'Test keyboard Tab and Esc dismiss in modals', completed: true },
        ],
      },
      {
        title: 'Organize Home Office Workspace & Cable Management',
        description: 'Install under-desk cable raceway and mount monitors on dual gas-spring articulating arms.',
        status: 'Completed',
        priority: 'Low',
        startDate: overdue5Days,
        dueDate: overdue2Days,
        project: personal._id,
        tags: ['home', 'lifestyle'],
        assignedTo: john._id,
        createdBy: john._id,
        completedAt: completed2DaysAgo,
        subtasks: [
          { title: 'Order velcro cable ties and surge protector', completed: true },
          { title: 'Assemble dual monitor desk clamp', completed: true },
        ],
      },
      {
        title: 'Optimize MongoDB Aggregation Pipeline Queries',
        description: 'Add compound indices on { project: 1, status: 1 } and { dueDate: 1 } for sub-millisecond query responses.',
        status: 'In Progress',
        priority: 'High',
        startDate: today,
        dueDate: in5Days,
        project: webDev._id,
        tags: ['backend', 'database', 'performance'],
        assignedTo: john._id,
        createdBy: admin._id,
        subtasks: [
          { title: 'Profile slow queries using explain("executionStats")', completed: true },
          { title: 'Add Mongoose schema index annotations', completed: true },
          { title: 'Benchmark response latency under simulated load', completed: false },
        ],
      },
      {
        title: 'Read System Design Interview Book Vol 2',
        description: 'Study Chapters 4-6 on Distributed Message Queues, Ad Click Event Aggregation, and S3 Storage Engine.',
        status: 'Todo',
        priority: 'Medium',
        startDate: tomorrow,
        dueDate: nextWeek,
        project: learning._id,
        tags: ['system-design', 'books', 'architecture'],
        assignedTo: michael._id,
        createdBy: admin._id,
        subtasks: [
          { title: 'Read Chapter 4: Distributed Message Queue', completed: false },
          { title: 'Read Chapter 5: Real-time Gaming Leaderboard', completed: false },
          { title: 'Summarize key architecture diagrams in notes', completed: false },
        ],
      },
      {
        title: 'Update monthly household budget spreadsheet',
        description: 'Categorize expenses, review recurring SaaS subscriptions, and calculate monthly savings rate.',
        status: 'Todo',
        priority: 'Low',
        startDate: today,
        dueDate: in3Days,
        project: personal._id,
        tags: ['finance', 'budget'],
        assignedTo: john._id,
        createdBy: john._id,
        subtasks: [
          { title: 'Export bank and credit card statements', completed: false },
          { title: 'Cancel unused subscription services', completed: false },
        ],
      },
    ]);

    console.log(`[Seed] Created ${tasks.length} realistic tasks.`);

    // 4. Add Comments
    const comments = await Comment.create([
      {
        taskId: tasks[1]._id, // Portfolio task
        userId: sarah._id,
        content: 'Love the minimalist typography! The dark theme contrast on cards looks super sleek.',
      },
      {
        taskId: tasks[1]._id,
        userId: john._id,
        content: 'Thanks Sarah! Just finishing up the form validation and animations now.',
      },
      {
        taskId: tasks[7]._id, // Mobile bug
        userId: michael._id,
        content: 'Noticed this primarily happens on screens narrower than 375px. Tables are forcing minimum width.',
      },
      {
        taskId: tasks[7]._id,
        userId: sarah._id,
        content: 'On it! Adding a scroll wrapper with clean CSS touch scrolling rules.',
      },
      {
        taskId: tasks[12]._id, // MongoDB optimization
        userId: admin._id,
        content: 'The compound indexes brought query execution time down from 140ms to 4ms in testing!',
      },
    ]);

    // Attach comments to tasks
    await Task.findByIdAndUpdate(tasks[1]._id, {
      $push: { comments: { $each: [comments[0]._id, comments[1]._id] } },
    });
    await Task.findByIdAndUpdate(tasks[7]._id, {
      $push: { comments: { $each: [comments[2]._id, comments[3]._id] } },
    });
    await Task.findByIdAndUpdate(tasks[12]._id, {
      $push: { comments: comments[4]._id },
    });

    console.log(`[Seed] Created ${comments.length} comments.`);

    // 5. Create In-App Notifications
    const notifications = await Notification.create([
      {
        userId: john._id,
        type: 'deadline',
        message: 'Upcoming Deadline: "Build Portfolio Website" is due today at 5:00 PM!',
        taskId: tasks[1]._id,
        isRead: false,
      },
      {
        userId: john._id,
        type: 'comment',
        message: 'Sarah Chen commented on your task "Build Portfolio Website"',
        taskId: tasks[1]._id,
        isRead: false,
      },
      {
        userId: john._id,
        type: 'assignment',
        message: 'Alex Morgan assigned you to task "Optimize MongoDB Aggregation Pipeline Queries"',
        taskId: tasks[12]._id,
        isRead: true,
      },
      {
        userId: sarah._id,
        type: 'overdue',
        message: 'High Priority: "Fix mobile viewport horizontal scroll bug" is due today!',
        taskId: tasks[7]._id,
        isRead: false,
      },
      {
        userId: admin._id,
        type: 'completion',
        message: 'John Doe completed high priority task "Implement JWT Authentication & Refresh Flow"',
        taskId: tasks[2]._id,
        isRead: true,
      },
    ]);

    console.log(`[Seed] Created ${notifications.length} notifications.`);
    console.log('\n==========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==========================================');
    console.log('Demo Credentials:');
    console.log('👑 Admin:  admin@taskflow.com / Admin@12345');
    console.log('👤 User:   john@taskflow.com  / User@12345');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
