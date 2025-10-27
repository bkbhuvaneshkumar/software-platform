const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create applications table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_path TEXT NOT NULL,
        days_ago TEXT DEFAULT '0 days ago',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default dummy applications
    const defaultApps = [
        {
            title: "Photo Editor Pro",
            description: "Advanced photo editing software with AI-powered tools and filters for professional results.",
            image_path: "/default/photo-editor.jpg",
            days_ago: "3 days ago"
        },
        {
            title: "Video Converter",
            description: "Convert any video format to MP4, AVI, MOV with high quality and fast processing speed.",
            image_path: "/default/video-converter.jpg",
            days_ago: "3 days ago"
        },
        {
            title: "PDF Master",
            description: "Complete PDF solution with editing, merging, splitting and conversion capabilities.",
            image_path: "/default/pdf-master.jpg",
            days_ago: "3 days ago"
        },
        {
            title: "System Cleaner",
            description: "Optimize your computer performance by cleaning junk files and registry errors.",
            image_path: "/default/system-cleaner.jpg",
            days_ago: "3 days ago"
        },
        {
            title: "Audio Studio",
            description: "Professional audio editing software with multi-track recording and effects.",
            image_path: "/default/audio-studio.jpg",
            days_ago: "3 days ago"
        },
        {
            title: "Security Shield",
            description: "Complete antivirus protection with real-time scanning and malware detection.",
            image_path: "/default/security-shield.jpg",
            days_ago: "3 days ago"
        }
    ];

    const insertStmt = db.prepare(`INSERT OR IGNORE INTO applications 
        (title, description, image_path, days_ago) VALUES (?, ?, ?, ?)`);
    
    defaultApps.forEach(app => {
        insertStmt.run(app.title, app.description, app.image_path, app.days_ago);
    });
    
    insertStmt.finalize();
});

module.exports = db;