const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
require('dotenv').config();

const db = require('./database/init.db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Serve header and footer as reusable components
app.get('/header', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'header.html'));
});

app.get('/footer', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'footer.html'));
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/admin812430', (req, res) => {
    if (req.session.adminLoggedIn) {
        res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
    }
});

// API Routes
app.get('/api/applications', (req, res) => {
    db.all("SELECT * FROM applications ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/application/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM applications WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }
        res.json(row);
    });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        req.session.adminLoggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Add new application (admin only)
app.post('/api/admin/applications', upload.single('image'), (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, days_ago } = req.body;
    const image_path = req.file ? '/uploads/' + req.file.filename : '';

    if (!title || !description || !image_path) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        "INSERT INTO applications (title, description, image_path, days_ago) VALUES (?, ?, ?, ?)",
        [title, description, image_path, days_ago || '0 days ago'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                success: true, 
                id: this.lastID,
                message: 'Application added successfully' 
            });
        }
    );
});

// Delete application (admin only)
app.delete('/api/admin/applications/:id', (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = req.params.id;
    db.run("DELETE FROM applications WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Application deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});