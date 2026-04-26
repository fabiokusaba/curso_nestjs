import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'
import { SignUpDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiCreatedResponse()
  signup(@Body() data: SignUpDTO) {
    return this.authService.signup(data)
  }
}
