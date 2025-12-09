/**
 * @summary
 * External API routes configuration.
 * Handles public endpoints that don't require authentication.
 *
 * @module routes/externalRoutes
 */

import { Router } from 'express';
import * as contactController from '@/api/external/contact/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Contact form routes - /api/external/contact
 */
router.post('/contact', contactController.submitHandler);

export default router;
