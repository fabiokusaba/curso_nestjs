import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import type { User } from '@prisma/client'
import { AuthenticatedUser } from '../common/decorators/authenticated-user.decorator'
import { SignInDTO, SignUpDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() data: SignUpDTO) {
    return this.authService.signup(data)
  }

  @Post('signin')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  signin(@Body() data: SignInDTO) {
    return this.authService.signin(data)
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protected(@AuthenticatedUser() user: User) {
    return {
      message: `Authenticated! ${user.email}`,
    }
  }
}
