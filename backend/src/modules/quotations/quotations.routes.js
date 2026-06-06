const { Router } = require('express');
const QuotationsController = require('./quotations.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const { createQuotationSchema, updateQuotationSchema } = require('./quotations.validator');

const router = Router();
router.use(authenticate);

router.get('/', QuotationsController.list);
router.get('/:id', QuotationsController.getById);
router.post('/', validate(createQuotationSchema), QuotationsController.create);
router.put('/:id', validate(updateQuotationSchema), QuotationsController.update);
router.patch('/:id/accept', authorize('rfq.update'), QuotationsController.accept);
router.patch('/:id/reject', authorize('rfq.update'), QuotationsController.reject);

module.exports = router;
