import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';

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

  //   @Put('')
  //   public async update(req: Request, res: Response): Promise<void> {}

  //   @Delete('')
  //   public async delete(req: Request, res: Response): Promise<void> {}
}
