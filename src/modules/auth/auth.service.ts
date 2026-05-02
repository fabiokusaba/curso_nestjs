import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { SignInDTO, SignUpDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(data: SignUpDTO) {
    // 1. Criptografar a senha do usuário
    const passwordHash = await bcrypt.hash(data.password, 12)

    // 2. Salvar o usuário no banco de dados
    const newUser = await this.userService.create({
      ...data,
      password: passwordHash,
    })

    // 3. Retornar o token JWT de acesso
    return {
      token: this.jwtService.sign({
        sub: newUser.id,
      }),
    }
  }

  async signin(data: SignInDTO) {
    // Dado o email que o usuário passou na requisição precisamos validar esse usuário e a
    // sua senha
    const user = await this.userService.findByEmail(data.email)

    if (user && (await bcrypt.compare(data.password, user.password))) {
      return {
        token: this.jwtService.sign({
          sub: user.id,
        }),
      }
    }

    throw new UnauthorizedException('Email or password invalid')
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: 'password_reset',
    })

    await this.mailService.sendPasswordRequest(user.email, token)

    return {
      message: 'Password reset email sent',
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token)

      if (payload.purpose !== 'password_reset') {
        throw new BadRequestException('Invalid token')
      }

      const user = await this.userService.findById(payload.sub)

      if (!user) {
        throw new BadRequestException('Invalid token')
      }

      const passwordHash = await bcrypt.hash(newPassword, 12)

      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: passwordHash,
        },
      })
    } catch (error) {
      console.error(error)
      throw new BadRequestException('Invalid or expired token')
    }
  }
}
