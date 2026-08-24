import { JwtPayload } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
