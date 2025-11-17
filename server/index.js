// Enhanced backend for SurgiConnect. Run with: node server/index.js
import http from 'http';
import url from 'url';
import crypto from 'crypto';

const PORT = process.env.PORT || 5000;

// In-memory data stores (replace with database in production)
const users = [];
const patients = new Map();
const familyTasks = new Map();
const tokens = new Map(); // token -> userId
const communityTips = []; // Community tips and experiences
const medicationLogs = new Map(); // patientId -> [{ medicationId, date, time, taken }]

// Helper to generate simple tokens (use JWT in production)
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Helper to hash passwords (use bcrypt in production)
function hashPassword(password) {
  // Simple hash for dev - use bcrypt in production
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper to get user from token
function getUserFromToken(token) {
  const userId = tokens.get(token);
  if (!userId) return null;
  return users.find(u => u.id === userId);
}

// Helper to read request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function jsonResponse(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  res.end(body);
}

// Initialize with some demo data
function initializeDemoData() {
  // Create demo users
  const demoPatient = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: hashPassword('demo123'),
    userType: 'patient',
    phone: '(555) 111-2222'
  };
  
  const demoFamily = {
    id: 2,
    name: 'John Johnson',
    email: 'john@example.com',
    password: hashPassword('demo123'),
    userType: 'family',
    phone: '(555) 111-2223'
  };

  users.push(demoPatient, demoFamily);

  // Create demo patient data
  patients.set(1, {
    id: 1,
    userId: 1,
    name: 'Sarah Johnson',
    procedure: 'Knee Replacement',
    surgeryDate: '2025-01-15',
    daysPostOp: 7,
    tasks: [
      { id: 1, title: 'Morning Wound Inspection', time: '9:00 AM', category: 'Wound Care', completed: false },
      { id: 2, title: 'Take Prescribed Medication', time: '10:00 AM', category: 'Medication', completed: false },
      { id: 3, title: 'Light Walking Exercise', time: '2:00 PM', category: 'Physical Therapy', completed: false },
      { id: 4, title: 'Evening Dressing Change', time: '7:00 PM', category: 'Wound Care', completed: false }
    ],
    medications: [
      { id: 1, name: 'Ibuprofen 400mg', frequency: '2x daily', lastTaken: null },
      { id: 2, name: 'Antibiotic', frequency: '3x daily', lastTaken: null }
    ],
    painLevel: 3,
    woundStatus: 'Healing Well'
  });

  // Create demo family tasks
  familyTasks.set(1, [
    { id: 1, assignee: 'John (Spouse)', task: 'Assist with morning wound cleaning', time: '9:00 AM', status: 'completed' },
    { id: 2, assignee: 'Emily (Daughter)', task: 'Prepare medication organizer', time: '8:00 AM', status: 'completed' },
    { id: 3, assignee: 'John (Spouse)', task: 'Help with mobility exercises', time: '2:00 PM', status: 'pending' },
    { id: 4, assignee: 'Emily (Daughter)', task: 'Evening dressing change assistance', time: '7:00 PM', status: 'pending' }
  ]);

  // Initialize medication logs
  medicationLogs.set(1, []);

  // Demo community tips
  communityTips.push(
    {
      id: 1,
      videoId: 1,
      videoTitle: 'Complete Guide to Post-Knee Surgery Care',
      author: 'Maria T.',
      content: 'This video helped us so much! The step-by-step approach made everything less overwhelming. My mom is recovering beautifully thanks to these tips.',
      upvotes: 145,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      videoId: 2,
      videoTitle: 'Daily Wound Care for Elderly Patients',
      author: 'John K.',
      content: 'Pro tip: We found that warming the saline solution slightly (not hot!) made the cleaning process more comfortable for my dad.',
      upvotes: 98,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      videoId: 3,
      videoTitle: 'Advanced Dressing Change Techniques',
      author: 'Sarah M.',
      content: 'As a nurse, I appreciate how accurate and detailed this is. Great resource for family caregivers!',
      upvotes: 203,
      createdAt: new Date().toISOString()
    }
  );
}

initializeDemoData();

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method || 'GET';

  // Basic request logging
  console.log(`${new Date().toISOString()} - ${method} ${parsed.pathname}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    });
    return res.end();
  }

  try {
    // Health check
    if (parsed.pathname === '/api/ping' && method === 'GET') {
      return jsonResponse(res, 200, { ok: true, timestamp: new Date().toISOString() });
    }

    // Auth endpoints
    if (parsed.pathname === '/api/auth/signup' && method === 'POST') {
      const data = await readBody(req);
      
      if (!data.email || !data.password || !data.name) {
        return jsonResponse(res, 400, { error: 'Missing required fields' });
      }

      // Check if user exists
      if (users.find(u => u.email === data.email)) {
        return jsonResponse(res, 400, { error: 'Email already registered' });
      }

      // Create user
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
        userType: data.userType || 'patient',
        phone: data.phone || ''
      };

      users.push(newUser);

      // Generate token
      const token = generateToken();
      tokens.set(token, newUser.id);

      // Create patient record if patient
      if (newUser.userType === 'patient') {
        patients.set(newUser.id, {
          id: newUser.id,
          userId: newUser.id,
          name: newUser.name,
          procedure: '',
          surgeryDate: null,
          daysPostOp: 0,
          tasks: [],
          medications: [],
          painLevel: 0,
          woundStatus: 'Unknown'
        });
      }

      return jsonResponse(res, 201, {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.userType,
          phone: newUser.phone
        }
      });
    }

    if (parsed.pathname === '/api/auth/login' && method === 'POST') {
      const data = await readBody(req);
      
      if (!data.email || !data.password) {
        return jsonResponse(res, 400, { error: 'Email and password required' });
      }

      const user = users.find(u => u.email === data.email);
      if (!user || user.password !== hashPassword(data.password)) {
        return jsonResponse(res, 401, { error: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken();
      tokens.set(token, user.id);

      return jsonResponse(res, 200, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          phone: user.phone
        }
      });
    }

    // Get authorization token
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const currentUser = token ? getUserFromToken(token) : null;

    // Protected routes - require authentication
    if (parsed.pathname && parsed.pathname.startsWith('/api/patients/')) {
      if (!currentUser) {
        return jsonResponse(res, 401, { error: 'Authentication required' });
      }

      const parts = parsed.pathname.split('/');
      const patientId = parseInt(parts[3]);
      const subPath = parts[4];

      // Helper to get or create patient
      function getOrCreatePatient(patientId, userId) {
        let patient = patients.get(patientId);
        if (!patient) {
          // Create patient record if it doesn't exist
          const user = users.find(u => u.id === userId);
          patient = {
            id: patientId,
            userId: userId,
            name: user?.name || 'Patient',
            procedure: '',
            surgeryDate: null,
            daysPostOp: 0,
            tasks: [],
            medications: [],
            painLevel: 0,
            woundStatus: 'Unknown'
          };
          patients.set(patientId, patient);
        }
        return patient;
      }

      // Get patient data
      if (method === 'GET' && !subPath) {
        const patient = getOrCreatePatient(patientId, currentUser.id);
        return jsonResponse(res, 200, patient);
      }

      // Add new task
      if (method === 'POST' && subPath === 'tasks') {
        const data = await readBody(req);
        const patient = getOrCreatePatient(patientId, currentUser.id);

        const newTask = {
          id: patient.tasks.length > 0 ? Math.max(...patient.tasks.map(t => t.id)) + 1 : 1,
          title: data.title || 'New Task',
          time: data.time || '9:00 AM',
          category: data.category || 'General',
          completed: false
        };

        patient.tasks.push(newTask);
        patients.set(patientId, patient);
        return jsonResponse(res, 201, patient);
      }

      // Update task
      if (method === 'PATCH' && subPath === 'tasks' && parts[5]) {
        const taskId = parseInt(parts[5]);
        const data = await readBody(req);
        const patient = getOrCreatePatient(patientId, currentUser.id);

        const task = patient.tasks.find(t => t.id === taskId);
        if (task) {
          if (data.completed !== undefined) task.completed = data.completed;
          if (data.title) task.title = data.title;
          if (data.time) task.time = data.time;
          if (data.category) task.category = data.category;
        }

        patients.set(patientId, patient);
        return jsonResponse(res, 200, patient);
      }

      // Delete task
      if (method === 'DELETE' && subPath === 'tasks' && parts[5]) {
        const taskId = parseInt(parts[5]);
        const patient = getOrCreatePatient(patientId, currentUser.id);

        patient.tasks = patient.tasks.filter(t => t.id !== taskId);
        patients.set(patientId, patient);
        return jsonResponse(res, 200, patient);
      }

      // Medication endpoints
      if (subPath === 'medications' && method === 'GET') {
        const patient = getOrCreatePatient(patientId, currentUser.id);
        const logs = medicationLogs.get(patientId) || [];
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = logs.filter(log => log.date === today);
        
        return jsonResponse(res, 200, {
          medications: patient.medications || [],
          todayLogs: todayLogs,
          allLogs: logs
        });
      }

      // Mark medication as taken
      if (subPath === 'medications' && method === 'POST') {
        const data = await readBody(req);
        const patient = getOrCreatePatient(patientId, currentUser.id);

        const logs = medicationLogs.get(patientId) || [];
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

        const logEntry = {
          id: logs.length > 0 ? Math.max(...logs.map(l => l.id || 0)) + 1 : 1,
          medicationId: data.medicationId,
          medicationName: data.medicationName,
          date: today,
          time: now,
          taken: true
        };

        logs.push(logEntry);
        medicationLogs.set(patientId, logs);

        // Update lastTaken in medication
        const medication = patient.medications.find(m => m.id === data.medicationId);
        if (medication) {
          medication.lastTaken = `${today} ${now}`;
        }

        patients.set(patientId, patient);
        return jsonResponse(res, 201, { success: true, log: logEntry });
      }

      // Add medication
      if (subPath === 'medications' && method === 'PUT') {
        const data = await readBody(req);
        const patient = getOrCreatePatient(patientId, currentUser.id);

        const newMedication = {
          id: patient.medications.length > 0 ? Math.max(...patient.medications.map(m => m.id)) + 1 : 1,
          name: data.name || 'New Medication',
          frequency: data.frequency || '1x daily',
          lastTaken: null
        };

        patient.medications.push(newMedication);
        patients.set(patientId, patient);
        return jsonResponse(res, 201, patient);
      }
    }

    // Family tasks endpoints
    if (parsed.pathname && parsed.pathname.startsWith('/api/family/')) {
      if (!currentUser) {
        return jsonResponse(res, 401, { error: 'Authentication required' });
      }

      const parts = parsed.pathname.split('/');
      const patientId = parseInt(parts[3]);
      const subPath = parts[4];

      if (subPath === 'tasks' && method === 'GET') {
        const tasks = familyTasks.get(patientId) || [];
        return jsonResponse(res, 200, { tasks });
      }

      // Add family task
      if (subPath === 'tasks' && method === 'POST') {
        const data = await readBody(req);
        const tasks = familyTasks.get(patientId) || [];
        
        const newTask = {
          id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
          assignee: data.assignee || 'Family Member',
          task: data.task || 'New Task',
          time: data.time || '9:00 AM',
          status: 'pending'
        };

        tasks.push(newTask);
        familyTasks.set(patientId, tasks);
        return jsonResponse(res, 201, { tasks });
      }

      // Update family task
      if (subPath === 'tasks' && parts[5] && method === 'PATCH') {
        const taskId = parseInt(parts[5]);
        const data = await readBody(req);
        const tasks = familyTasks.get(patientId) || [];
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          if (data.status) task.status = data.status;
          if (data.task) task.task = data.task;
          if (data.assignee) task.assignee = data.assignee;
          if (data.time) task.time = data.time;
        }

        familyTasks.set(patientId, tasks);
        return jsonResponse(res, 200, { tasks });
      }

      // Delete family task
      if (subPath === 'tasks' && parts[5] && method === 'DELETE') {
        const taskId = parseInt(parts[5]);
        const tasks = familyTasks.get(patientId) || [];
        
        const filtered = tasks.filter(t => t.id !== taskId);
        familyTasks.set(patientId, filtered);
        return jsonResponse(res, 200, { tasks: filtered });
      }
    }

    // Directory endpoint
    if (parsed.pathname === '/api/directory' && method === 'GET') {
      const search = parsed.query.search || '';
      const searchLower = search.toLowerCase();

      let hospitals = [
        { 
          id: 1, 
          name: "St. Mary's Medical Center", 
          type: 'Hospital', 
          specialty: 'Orthopedic Surgery', 
          phone: '(555) 123-4567', 
          address: '1234 Health Ave, City, ST 12345',
          distance: '2.3 miles',
          hours: '24/7 Emergency',
          rating: 4.8,
          languages: ['English', 'Spanish'],
          emergency: true
        },
        { 
          id: 2, 
          name: 'Advanced Wound Care Clinic', 
          type: 'Clinic', 
          specialty: 'Wound Management', 
          phone: '(555) 234-5678', 
          address: '567 Healing Way, City, ST 12345',
          distance: '1.5 miles',
          hours: 'Mon-Fri 8AM-6PM',
          rating: 4.6,
          languages: ['English'],
          emergency: false
        },
        {
          id: 3,
          name: 'City General Hospital',
          type: 'Hospital',
          specialty: 'General Surgery',
          phone: '(555) 345-6789',
          address: '789 Medical Blvd, City, ST 12345',
          distance: '5.1 miles',
          hours: '24/7 Emergency',
          rating: 4.5,
          languages: ['English', 'Spanish', 'Mandarin'],
          emergency: true
        }
      ];

      let specialists = [
        { 
          id: 1, 
          name: 'Dr. Sarah Chen', 
          specialty: 'Orthopedic Surgeon', 
          hospital: "St. Mary's Medical Center", 
          phone: '(555) 123-4570',
          rating: 4.9,
          experience: '15 years',
          languages: ['English', 'Mandarin'],
          accepting: true
        },
        {
          id: 2,
          name: 'Dr. Michael Rodriguez',
          specialty: 'Wound Care Specialist',
          hospital: 'Advanced Wound Care Clinic',
          phone: '(555) 234-5680',
          rating: 4.7,
          experience: '12 years',
          languages: ['English', 'Spanish'],
          accepting: true
        },
        {
          id: 3,
          name: 'Dr. Emily Watson',
          specialty: 'Physical Therapist',
          hospital: 'City General Hospital',
          phone: '(555) 345-6790',
          rating: 4.8,
          experience: '10 years',
          languages: ['English'],
          accepting: true
        }
      ];

      // Filter by search if provided
      if (search) {
        hospitals = hospitals.filter(h => 
          h.name.toLowerCase().includes(searchLower) ||
          h.specialty.toLowerCase().includes(searchLower)
        );
        specialists = specialists.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.specialty.toLowerCase().includes(searchLower)
        );
      }

      return jsonResponse(res, 200, { hospitals, specialists });
    }

    // Videos endpoint
    if (parsed.pathname === '/api/videos' && method === 'GET') {
      const search = parsed.query.search || '';
      const category = parsed.query.category || '';
      const searchLower = search.toLowerCase();
      const categoryLower = category.toLowerCase();

      let videos = [
        { 
          id: 1, 
          title: 'Complete Guide to Post-Knee Surgery Care', 
          duration: '15:23', 
          category: 'Knee Surgery', 
          views: 12500,
          likes: 342,
          comments: 89,
          description: 'Comprehensive guide covering wound care, medication management, and mobility exercises for knee replacement recovery.',
          audience: 'Patient'
        },
        { 
          id: 2, 
          title: 'Daily Wound Care for Elderly Patients', 
          duration: '8:45', 
          category: 'Wound Care', 
          views: 8200,
          likes: 256,
          comments: 67,
          description: 'Step-by-step instructions for safe and effective wound care tailored for elderly patients.',
          audience: 'Caregiver'
        },
        {
          id: 3,
          title: 'Safe Patient Transfer Techniques',
          duration: '6:15',
          category: 'Mobility',
          views: 5600,
          likes: 189,
          comments: 45,
          description: 'Learn proper techniques for helping patients move safely after surgery.',
          audience: 'Caregiver'
        },
        {
          id: 4,
          title: 'Recognizing Infection Signs',
          duration: '5:40',
          category: 'Monitoring',
          views: 9200,
          likes: 298,
          comments: 78,
          description: 'Important warning signs to watch for that may indicate infection.',
          audience: 'Both'
        },
        {
          id: 5,
          title: 'Physical Therapy Exercises - Week 1',
          duration: '12:30',
          category: 'Physical Therapy',
          views: 6800,
          likes: 201,
          comments: 56,
          description: 'Gentle exercises to begin your recovery journey in the first week post-surgery.',
          audience: 'Patient'
        },
        {
          id: 6,
          title: 'Medication Management Best Practices',
          duration: '7:20',
          category: 'Medication',
          views: 4500,
          likes: 134,
          comments: 34,
          description: 'How to organize and track medications during recovery.',
          audience: 'Both'
        }
      ];

      // Filter by search and category
      if (search) {
        videos = videos.filter(v =>
          v.title.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower) ||
          v.category.toLowerCase().includes(searchLower)
        );
      }

      if (category) {
        videos = videos.filter(v => v.category.toLowerCase() === categoryLower);
      }

      return jsonResponse(res, 200, { videos });
    }

    // Community tips endpoints
    if (parsed.pathname === '/api/community/tips' && method === 'GET') {
      const videoId = parsed.query.videoId;
      let tips = [...communityTips];
      
      if (videoId) {
        tips = tips.filter(t => t.videoId === parseInt(videoId));
      }
      
      // Sort by upvotes
      tips.sort((a, b) => b.upvotes - a.upvotes);
      
      return jsonResponse(res, 200, { tips });
    }

    if (parsed.pathname === '/api/community/tips' && method === 'POST') {
      if (!currentUser) {
        return jsonResponse(res, 401, { error: 'Authentication required' });
      }

      const data = await readBody(req);
      
      const newTip = {
        id: communityTips.length > 0 ? Math.max(...communityTips.map(t => t.id)) + 1 : 1,
        videoId: data.videoId || null,
        videoTitle: data.videoTitle || '',
        author: currentUser.name,
        content: data.content || '',
        upvotes: 0,
        createdAt: new Date().toISOString()
      };

      communityTips.push(newTip);
      return jsonResponse(res, 201, { tip: newTip });
    }

    if (parsed.pathname === '/api/community/tips' && parsed.pathname.includes('/upvote/') && method === 'POST') {
      const parts = parsed.pathname.split('/');
      const tipId = parseInt(parts[parts.length - 1]);
      const tip = communityTips.find(t => t.id === tipId);
      
      if (tip) {
        tip.upvotes = (tip.upvotes || 0) + 1;
        return jsonResponse(res, 200, { tip });
      }
      
      return jsonResponse(res, 404, { error: 'Tip not found' });
    }

    // Hospital contact endpoints
    if (parsed.pathname === '/api/hospitals' && method === 'GET') {
      const search = parsed.query.search || '';
      const searchLower = search.toLowerCase();

      let hospitals = [
        { 
          id: 1, 
          name: "St. Mary's Medical Center", 
          type: 'Hospital', 
          specialty: 'Orthopedic Surgery', 
          phone: '(555) 123-4567', 
          email: 'info@stmarys.example.com',
          address: '1234 Health Ave, City, ST 12345',
          distance: '2.3 miles',
          hours: '24/7 Emergency',
          rating: 4.8,
          languages: ['English', 'Spanish'],
          emergency: true,
          website: 'https://stmarys.example.com'
        },
        { 
          id: 2, 
          name: 'Advanced Wound Care Clinic', 
          type: 'Clinic', 
          specialty: 'Wound Management', 
          phone: '(555) 234-5678',
          email: 'contact@woundcare.example.com',
          address: '567 Healing Way, City, ST 12345',
          distance: '1.5 miles',
          hours: 'Mon-Fri 8AM-6PM',
          rating: 4.6,
          languages: ['English'],
          emergency: false,
          website: 'https://woundcare.example.com'
        },
        {
          id: 3,
          name: 'City General Hospital',
          type: 'Hospital',
          specialty: 'General Surgery',
          phone: '(555) 345-6789',
          email: 'info@citygeneral.example.com',
          address: '789 Medical Blvd, City, ST 12345',
          distance: '5.1 miles',
          hours: '24/7 Emergency',
          rating: 4.5,
          languages: ['English', 'Spanish', 'Mandarin'],
          emergency: true,
          website: 'https://citygeneral.example.com'
        }
      ];

      if (search) {
        hospitals = hospitals.filter(h => 
          h.name.toLowerCase().includes(searchLower) ||
          h.specialty.toLowerCase().includes(searchLower) ||
          h.address.toLowerCase().includes(searchLower)
        );
      }

      return jsonResponse(res, 200, { hospitals });
    }

    if (parsed.pathname === '/api/hospitals/contact' && method === 'POST') {
      if (!currentUser) {
        return jsonResponse(res, 401, { error: 'Authentication required' });
      }

      const data = await readBody(req);
      
      // In production, this would send an email or create a ticket
      // For now, just log and return success
      console.log('Hospital contact request:', {
        hospitalId: data.hospitalId,
        hospitalName: data.hospitalName,
        from: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        message: data.message,
        subject: data.subject
      });

      return jsonResponse(res, 200, { 
        success: true, 
        message: 'Your message has been sent. The hospital will contact you soon.' 
      });
    }

    // 404 for other api routes
    if (parsed.pathname && parsed.pathname.startsWith('/api')) {
      return jsonResponse(res, 404, { error: 'not_found', path: parsed.pathname });
    }

    // default response for non-api paths
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SurgiConnect backend: running');
  } catch (error) {
    console.error('Request error:', error);
    jsonResponse(res, 500, { error: 'Internal server error', message: error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SurgiConnect backend listening on http://0.0.0.0:${PORT}`);
  console.log(`Demo users: sarah@example.com / demo123 (patient), john@example.com / demo123 (family)`);
});

server.on('error', (err) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
});
