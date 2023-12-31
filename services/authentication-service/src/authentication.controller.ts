import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() payload: any): Promise<{ access_token: string }> {
    try {
      return await this.authService.login(payload);
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @MessagePattern({ cmd: 'check' })
  async isLogedin(@Payload() payload: any): Promise<{ access_token: string }> {
    try {
      return await this.authService.validateToken(payload.jwt);
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @Get()
  async test() {
    return 'Got request in authentication service'
  }
}
