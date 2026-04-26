import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { UsersService } from '../users/users.service'
import { SignUpDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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
    
  }
}
