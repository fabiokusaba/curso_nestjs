import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY!,
    })
  }

  async validate(payload: { sub: string; purpose: string }) {
    // Validar que o token passado pelo usuário não é um token de reset de senha, pois não
    // podemos deixar que o usuário acesse a nossa aplicação com esse tipo de token
    if (payload.purpose === 'password_reset') {
      throw new UnauthorizedException('Invalid token')
    }

    // 1. Validar a existência do usuário
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    })

    if (!user) {
      return null
    }

    return user
  }
}
