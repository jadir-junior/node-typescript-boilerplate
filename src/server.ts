import './util/module-alias';

import * as database from '@src/database';
import * as http from 'http';

import express, { Application } from 'express';

import { AuthenticationController } from './controllers/authentication/authentication.controller';
import PassportStrategy from './config/passport.config';
import { Server } from '@overnightjs/core';
import { UsersController } from './controllers/users/users.controller';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import logger from './logger';
import passport from 'passport';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    this.setupPassport();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(passport.initialize());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupControllers(): void {
    const authenticationController = new AuthenticationController();
    const usersController = new UsersController();
    this.addControllers([usersController, authenticationController]);
  }

  public getApp(): Application {
    return this.app;
  }

  private setupPassport(): void {
    PassportStrategy.initLocal();
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((error) => {
          if (error) {
            return reject(error);
          }

          resolve(true);
        });
      });
    }
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server listing on port: ${this.port}`);
    });
  }
}
