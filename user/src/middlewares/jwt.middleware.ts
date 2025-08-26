import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from 'src/auth/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }
    const header = req.headers['authorization'];
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const token = header.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }
    try {
      const decoded = this.jwtService.verifyToken(token);
      req['x-email'] = decoded.email;
      req['x-sub'] = decoded.sub;
      next();
    } catch (err) {
      throw new UnauthorizedException(
        `Invalid or expired token: ${err.message}`,
      );
    }
  }
}
