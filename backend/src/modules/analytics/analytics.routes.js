const { Router } = require('express');
const AnalyticsController = require('./analytics.controller');
const authenticate = require('../../middleware/authenticate');

const router = Router();
router.use(authenticate);

router.get('/dashboard', AnalyticsController.dashboard);
router.get('/spending', AnalyticsController.spending);
router.get('/vendor-performance', AnalyticsController.vendorPerformance);
router.get('/procurement-health', AnalyticsController.procurementHealth);
router.get('/cost-savings', AnalyticsController.costSavings);

module.exports = router;
