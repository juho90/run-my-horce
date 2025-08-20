import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const rid = (req.headers['x-request-id'] as string) || randomUUID();
    this.cls.run(() => {
      this.cls.set('requestId', rid);
      res.setHeader('x-request-id', rid);
      next();
    });
  }
}
