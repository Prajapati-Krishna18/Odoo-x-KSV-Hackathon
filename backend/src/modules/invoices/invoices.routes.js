const { Router } = require('express');
const InvoicesController = require('./invoices.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

const router = Router();
router.use(authenticate);

router.get('/', InvoicesController.list);
router.get('/:id', InvoicesController.getById);
router.post('/', authorize('invoice.create'), InvoicesController.create);
router.put('/:id', authorize('invoice.update'), InvoicesController.update);
router.patch('/:id/verify', authorize('invoice.update'), InvoicesController.verify);
router.get('/:id/pdf', InvoicesController.downloadPdf);
router.post('/:id/send', authorize('invoice.update'), InvoicesController.send);

module.exports = router;
