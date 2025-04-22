const express = require('express');
const { getUserNotifications, markAsRead } = require('../utils/notificationService');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all user notifications
router.get('/', verifyToken, async (req, res) => {
  const notifications = await getUserNotifications(req.user.id);
  res.json(notifications);
});

// Mark a specific notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  await markAsRead(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
