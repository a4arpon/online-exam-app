import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
export class AuthGuardGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean | Promise<boolean> {
    return true
  }
}
