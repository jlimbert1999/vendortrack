import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from '../interfaces/jwt.interface';
import { Users } from 'src/modules/users/entities/user.entity';
import { EnvVars } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<EnvVars>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("JWT_TOKEN"),
    });
  }
  async validate(payload: jwtPayload) {
    const { userId } = payload;
    const userDB = await this.userRepository.findOne({ where: { id: userId } });
    if (!userDB) throw new UnauthorizedException('Token invalido, vuelva a iniciar sesion');
    if (!userDB.isActive) throw new UnauthorizedException('El usuario ha sido deshabilitado');
    // const {}?=
    // delete userDB.password;
    return userDB;
  }
}
