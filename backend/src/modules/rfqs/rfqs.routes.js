const { Router } = require('express');
const RfqsController = require('./rfqs.controller');
const QuotationsController = require('../quotations/quotations.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const upload = require('../../middleware/upload');
const { createRfqSchema, updateRfqSchema, inviteVendorsSchema } = require('./rfqs.validator');

const router = Router();
router.use(authenticate);

router.get('/', RfqsController.list);
router.get('/:id', RfqsController.getById);
router.post('/', authorize('rfq.create'), validate(createRfqSchema), RfqsController.create);
router.put('/:id', authorize('rfq.update'), validate(updateRfqSchema), RfqsController.update);
router.delete('/:id', authorize('rfq.delete'), RfqsController.remove);
router.get('/:id/compare', QuotationsController.compare);
router.patch('/:id/publish', authorize('rfq.update'), RfqsController.publish);
router.patch('/:id/close', authorize('rfq.update'), RfqsController.close);
router.post('/:id/vendors', authorize('rfq.update'), validate(inviteVendorsSchema), RfqsController.inviteVendors);
router.post('/:id/attachments', authorize('rfq.update'), upload.single('file'), RfqsController.addAttachment);
router.delete('/:id/attachments/:aid', authorize('rfq.update'), RfqsController.removeAttachment);

module.exports = router;
