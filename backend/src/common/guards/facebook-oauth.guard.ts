import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookOauthGuard extends AuthGuard('facebook') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  getAuthenticateOptions() {
    return {
      scope: ['email', 'public_profile'],
    };
  }
}
