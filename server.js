
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for Base64 images

// 1. Database Connection
// Ensure your .env file has: MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecowave
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecowave';

mongoose.connect(mongoURI)
  .then(() => console.log('🌊 EcoWave: Connected to Deep Sea Database (MongoDB)'))
  .catch(err => console.error('❌ Connection Error:', err));

// 2. Data Models
const ReportSchema = new mongoose.Schema({
  type: String,
  severity: String,
  location: {
    lat: Number,
    lng: Number,
    name: String
  },
  description: String,
  image: String, // Stores Base64 string
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now }
});

const ActivitySchema = new mongoose.Schema({
  type: { type: String, default: 'report' },
  title: String,
  context: String,
  points: { type: Number, default: 50 },
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);
const Activity = mongoose.model('Activity', ActivitySchema);

// 3. API Routes

// Home Dashboard Data
app.get('/api/home', async (req, res) => {
  try {
    const reportsCount = await Report.countDocuments();
    const recentActivities = await Activity.find().sort({ timestamp: -1 }).limit(5);
    
    // Formatting activities for the frontend
    const formattedActivities = recentActivities.map(act => ({
      id: act._id,
      type: act.type,
      title: act.title,
      context: act.context,
      points: act.points,
      timestamp: timeSince(act.timestamp)
    }));

    res.json({
      stats: {
        reports: reportsCount,
        events: 0, // Placeholder for future events feature
        activeUsers: 1240
      },
      recentActivity: formattedActivities
    });
  } catch (err) {
    res.status(500).json({ error: 'Database retrieval failed' });
  }
});

// Submit a new Pollution Report
app.post('/api/reports', async (req, res) => {
  try {
    const { type, severity, location, description, image } = req.body;

    // Save report to MongoDB
    const newReport = new Report({
      type,
      severity,
      location,
      description,
      image
    });
    await newReport.save();

    // Log this as an activity for the Impact Stream
    const newActivity = new Activity({
      title: `Reported ${type}`,
      context: location.name
    });
    await newActivity.save();

    res.status(201).json({ 
      success: true, 
      pointsAwarded: 50,
      reportId: newReport._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Helper: Format date to "2 hours ago" etc.
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

app.listen(PORT, () => {
  console.log(`🚀 EcoWave Server patrolling on port ${PORT}`);
});
