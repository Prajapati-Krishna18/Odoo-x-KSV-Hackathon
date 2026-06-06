const { Router } = require('express');
const PurchaseOrdersController = require('./purchaseOrders.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');

const router = Router();
router.use(authenticate);

router.get('/', PurchaseOrdersController.list);
router.get('/:id', PurchaseOrdersController.getById);
router.post('/', authorize('purchase_order.create'), PurchaseOrdersController.create);
router.patch('/:id/status', authorize('purchase_order.update'), PurchaseOrdersController.updateStatus);
router.get('/:id/pdf', PurchaseOrdersController.downloadPdf);
router.post('/:id/send', authorize('purchase_order.update'), PurchaseOrdersController.sendToVendor);

module.exports = router;
