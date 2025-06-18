import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './dtos';
import { Users } from './entities/user.entity';
import { PaginationParamsDto } from '../common';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepository: Repository<Users>) {}

  async findAll({ limit, offset, term }: PaginationParamsDto) {
    const [users, length] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
      ...(term && {
        where: { fullName: ILike(`%${term}%`) },
      }),
      order: {
        createdAt: 'DESC',
      },
    });
    return { users: users.map((user) => this.removePasswordField(user)), length };
  }

  async create({ password, ...props }: CreateUserDto) {
    await this.checkDuplicateLogin(props.login);
    const encryptedPassword = await this.encryptPassword(password);
    const newUser = this.userRepository.create({ ...props, password: encryptedPassword });
    const createdUser = await this.userRepository.save(newUser);
    return this.removePasswordField(createdUser);
  }

  async update(id: string, user: UpdateUserDto) {
    const userDB = await this.userRepository.findOneBy({ id });
    if (!userDB) throw new NotFoundException(`El usuario editado no existe`);
    if (user.login !== userDB.login && user.login) await this.checkDuplicateLogin(user.login);
    if (user.password) user['password'] = await this.encryptPassword(user.password);
    const updatedUser = await this.userRepository.save({ id, ...user });
    return this.removePasswordField(updatedUser);
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async checkDuplicateLogin(login: string) {
    const duplicate = await this.userRepository.findOneBy({ login });
    if (duplicate) throw new BadRequestException(`El login ${login} ya existe`);
  }

  private removePasswordField(user: Users) {
    const { password, ...props } = user;
    return props;
  }
}
