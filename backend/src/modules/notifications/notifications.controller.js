const NotificationsRepository = require('./notifications.repository');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { parsePagination } = require('../../utils/pagination');

class NotificationsController {
  static list = asyncHandler(async (req, res) => {
    const { skip, take, page, limit } = parsePagination(req.query);
    const { notifications, total } = await NotificationsRepository.findByUser(req.user.id, { skip, take });
    ApiResponse.paginated(res, { data: notifications, page, limit, total });
  });

  static markRead = asyncHandler(async (req, res) => {
    await NotificationsRepository.markRead(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Marked as read' });
  });

  static markAllRead = asyncHandler(async (req, res) => {
    await NotificationsRepository.markAllRead(req.user.id);
    ApiResponse.success(res, { message: 'All notifications marked as read' });
  });

  static unreadCount = asyncHandler(async (req, res) => {
    const count = await NotificationsRepository.getUnreadCount(req.user.id);
    ApiResponse.success(res, { data: { count } });
  });
}

module.exports = NotificationsController;
