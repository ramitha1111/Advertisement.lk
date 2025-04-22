const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type = 'info') => {
  return await Notification.create({ userId, title, message, type });
};

const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(id, { isRead: true });
};

const getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

module.exports = { createNotification, markAsRead, getUserNotifications };
