const { Router } = require('express');
const NotificationsController = require('./notifications.controller');
const authenticate = require('../../middleware/authenticate');

const router = Router();
router.use(authenticate);

router.get('/', NotificationsController.list);
router.get('/unread-count', NotificationsController.unreadCount);
router.patch('/:id/read', NotificationsController.markRead);
router.patch('/read-all', NotificationsController.markAllRead);

module.exports = router;
