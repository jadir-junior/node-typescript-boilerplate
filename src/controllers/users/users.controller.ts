import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { ErrorController } from '../error.controller.';
import { User } from '@src/models/user.model';
import { authMiddleware } from '@src/middlewares/auth/auth.midddleware';

@Controller('users')
@ClassMiddleware(authMiddleware)
export class UsersController extends ErrorController {
  @Get('me')
  public async find(req: Request, res: Response): Promise<void> {
    const id = req.decoded?._id;
    try {
      const user = await User.findById(id);
      res.status(200).send(user);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

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

  //   @Put('')
  //   public async update(req: Request, res: Response): Promise<void> {}

  //   @Delete('')
  //   public async delete(req: Request, res: Response): Promise<void> {}
}
