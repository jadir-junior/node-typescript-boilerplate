import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';

import AuthService from '@src/services/auth.service';
import { ErrorController } from '../error.controller.';
import { User } from '@src/models/user.model';
import logger from '@src/logger';

@Controller('users')
export class UsersController extends ErrorController {
  //   @Get('')
  //   public async find(req: Request, res: Response): Promise<void> {}

  // @Get(':id')
  // public async findOne(req: Request, res: Response): Promise<void> {}

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpadateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticated(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password || ''))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ token: token });
  }

  //   @Put('')
  //   public async update(req: Request, res: Response): Promise<void> {}

  //   @Delete('')
  //   public async delete(req: Request, res: Response): Promise<void> {}
}
