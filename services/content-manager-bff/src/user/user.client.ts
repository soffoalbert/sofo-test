import { Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { TimeoutError, catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class AuthenticationClient {
  constructor(
    @Inject('AUTHENTICATION_SERVICE') private readonly authClient: ClientProxy, @Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

  async login(user): Promise<{ access_token: string }> {
    console.log({ ...user })
    try {
      const token = await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, { ...user }).pipe(
          catchError((error) => {
            throw new Error(error.message);
          }),
        ),
      );
      return token;
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

  }

  async register(user): Promise<{ access_token: string }> {
    const userStored = await firstValueFrom(
      this.userClient.send({ cmd: 'register' }, { ...user }).pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error registering the user:', error.message);
          throw new Error('Unable to register User');
        }),
      ),
    );
    return userStored;
  }

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('connected')

  }
}

