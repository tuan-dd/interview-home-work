import authController from '@/controllers/auth.controller';
import { catchError, checkUser, validateRequest } from '@/middleware/validate';
import { signInSchema, signUpSchema } from '@/schema/auth.schema';
import express from 'express';

const router = express.Router();

router.post('/sign-in', validateRequest(signInSchema), catchError(authController.signIn));

router.post('/sign-up', validateRequest(signUpSchema), catchError(authController.signUp));

router.post('/new-access-token', catchError(authController.getNewAccessToken));

router.post('/sign-out', checkUser, catchError(authController.signOut));

// router.post('/validate-otp', catchError(authController.validateOTP));

// router.post(
//   '/forget-password',
//   validateRequest(forgetPwdSchema),
//   catchError(authController.forgetPwd),
// );

// router.post(
//   '/create-otp',
//   checkUser,
//   validateRequest(signUpSchema),
//   catchError(authController.generateOTP),
// );

// router.post('/disable-otp', checkUser, catchError(authController.disableOTP));

// router.post('/verify-otp', checkUser, catchError(authController.verifyOTP));

export default router;
