const { createNotification } = require('./notificationService');
const { connectedUsers, io } = require('../server');

const sendNotification = async (userId, title, message, type = 'info') => {
  const notification = await createNotification(userId, title, message, type);

  const socketId = connectedUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }

  return notification;
};

module.exports = { sendNotification };
