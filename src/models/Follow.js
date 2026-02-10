const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'accepted',
  },
}, {
  timestamps: true,
});

followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 });
followSchema.index({ follower: 1 });

followSchema.pre('save', async function (next) {
  if (this.isNew) {
    const followingUser = await mongoose.model('User').findById(this.following);
    if (followingUser && followingUser.isPrivate) {
      this.status = 'pending';
    }
  }
  next();
});

module.exports = mongoose.model('Follow', followSchema);
