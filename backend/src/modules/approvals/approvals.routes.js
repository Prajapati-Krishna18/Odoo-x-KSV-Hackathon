const { Router } = require('express');
const ApprovalsController = require('./approvals.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

const router = Router();
router.use(authenticate);

router.get('/pending', ApprovalsController.getPending);
router.get('/:id', ApprovalsController.getById);
router.post('/:id/approve', authorize('approval.approve'), ApprovalsController.approve);
router.post('/:id/reject', authorize('approval.approve'), ApprovalsController.reject);
router.post('/:id/escalate', authorize('approval.approve'), ApprovalsController.escalate);

module.exports = router;
