const { Router } = require('express');
const VendorsController = require('./vendors.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const { createVendorSchema, updateVendorSchema, updateStatusSchema, rateVendorSchema } = require('./vendors.validator');

const router = Router();

router.use(authenticate);

router.get('/', VendorsController.list);
router.get('/recommend', VendorsController.recommend);
router.get('/:id', VendorsController.getById);
router.post('/', authorize('vendor.create'), validate(createVendorSchema), VendorsController.create);
router.put('/:id', authorize('vendor.update'), validate(updateVendorSchema), VendorsController.update);
router.delete('/:id', authorize('vendor.delete'), VendorsController.remove);
router.patch('/:id/status', authorize('vendor.update'), validate(updateStatusSchema), VendorsController.updateStatus);
router.post('/:id/rate', authorize('vendor.create'), validate(rateVendorSchema), VendorsController.rate);
router.get('/:id/performance', VendorsController.getPerformance);

module.exports = router;
