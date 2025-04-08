const express = require('express');
const authRoutes = require('./auth');
const questionRoutes = require('./question');
const leadsRoutes = require('./leads');
const campaignRoutes = require('./campaign');
const userRoutes = require('./user');
const clientRoutes = require('./client');
const dashboardRoutes = require('./dashboard');
const vendorLeadsRoutes = require('./vendor-leads');
const apiHistoryRoutes = require('./api-history');
const statusRoutes = require('./status');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);

// Protected routes (requires token verification)
router.use('/question', authMiddleware, questionRoutes);
router.use('/lead', authMiddleware, leadsRoutes);
router.use('/campaign', authMiddleware, campaignRoutes);
router.use('/user', authMiddleware, userRoutes);
router.use('/client', authMiddleware, clientRoutes);
router.use('/dashboard', authMiddleware, dashboardRoutes);
router.use('/api-history', authMiddleware, apiHistoryRoutes);
router.use('/status', authMiddleware, statusRoutes);

router.use('/vendor', vendorLeadsRoutes);

module.exports = router;
