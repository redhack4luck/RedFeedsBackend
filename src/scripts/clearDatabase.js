const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Thread = require('../models/Thread');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get confirmation before clearing
    console.log('\n⚠️  WARNING: This will delete ALL data in the database!');
    console.log('Collections to be cleared:');
    console.log('- Users');
    console.log('- Threads');
    console.log('- Follows');
    console.log('- Notifications');
    
    // Clear all collections
    console.log('\nClearing collections...');
    
    const userResult = await User.deleteMany({});
    console.log(`✓ Deleted ${userResult.deletedCount} users`);
    
    const threadResult = await Thread.deleteMany({});
    console.log(`✓ Deleted ${threadResult.deletedCount} threads`);
    
    const followResult = await Follow.deleteMany({});
    console.log(`✓ Deleted ${followResult.deletedCount} follows`);
    
    const notificationResult = await Notification.deleteMany({});
    console.log(`✓ Deleted ${notificationResult.deletedCount} notifications`);
    
    console.log('\n✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
clearDatabase();
