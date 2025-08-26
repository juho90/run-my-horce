import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'default-secret';
  private readonly issuer = process.env.JWT_ISSUER || 'my-app';
  private readonly audience = process.env.JWT_AUDIENCE || 'my-clients';
  private readonly algorithm =
    (process.env.JWT_ALG as jwt.Algorithm) || 'HS256';

  signAccessToken(payload: JwtPayload, expiresIn = '24h'): string {
    return jwt.sign(payload, this.secret, {
      algorithm: this.algorithm,
      issuer: this.issuer,
      audience: this.audience,
      expiresIn,
    } as jwt.SignOptions);
  }

  signRefreshToken(payload: JwtPayload, expiresIn = '24h'): string {
    return jwt.sign(payload, this.secret, {
      algorithm: this.algorithm,
      issuer: this.issuer,
      audience: this.audience,
      expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience,
      }) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException(
        `Invalid or expired token: ${err.message}`,
      );
    }
  }

  decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}
