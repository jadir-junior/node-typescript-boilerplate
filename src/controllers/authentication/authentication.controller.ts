import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import AuthService from '@src/services/auth.service';
import { ErrorController } from '../error.controller.';
import passport from 'passport';

@Controller('authentication')
export class AuthenticationController extends ErrorController {
  @Post('login')
  public async login(req: Request, res: Response): Promise<Response | void> {
    const { email, password } = req.body;

    if (!email || !password) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Email or password is required!',
      });
    }

    passport.authenticate('local', (error, user, info): Response => {
      if (error) {
        return this.sendErrorResponse(res, error);
      }

      if (user) {
        const token = AuthService.generateToken(user.toJSON());
        return res.status(200).send({ token });
      }

      return this.sendErrorResponse(res, info);
    })(req, res);
  }
}
