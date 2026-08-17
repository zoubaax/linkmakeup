import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller.js';

const router = Router();

// Public Wallet endpoints
router.get('/wallet/apple/:username', WalletController.getApplePass);
router.get('/wallet/google/:username', WalletController.getGooglePass);
router.post('/wallet/send-email', WalletController.sendWalletEmail);

export default router;
