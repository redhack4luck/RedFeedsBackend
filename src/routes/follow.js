const express = require('express');
const { followUser, unfollowUser, getFollowers, getFollowing, acceptFollowRequest } = require('../controllers/followController');
const { getMyProfile, updateMyProfile, listUsers } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, updateMyProfile);
router.get('/', authenticate, listUsers);

router.post('/:userId/follow', authenticate, followUser);
router.delete('/:userId/follow', authenticate, unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.put('/requests/:followId/accept', authenticate, acceptFollowRequest);

module.exports = router;
