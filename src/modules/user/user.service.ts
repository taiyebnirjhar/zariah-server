import { AppLoggerService } from '@/modules/logger/logger.service';
import { IQueryFeatures } from '@/type/query-features.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryBuilder } from '../mongodb/query-builder';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  // private readonly logger = new Logger(UserService.name);

  constructor(
    private configService: ConfigService,
    private logger: AppLoggerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return await createdUser.save();
  }

  async findAll(queryFeatures: IQueryFeatures) {
    const queryBuilder = new QueryBuilder<User>(this.userModel, queryFeatures, {
      searchFields: ['name', 'email'] as (keyof User)[],
    });

    const result = await queryBuilder.execute();

    return result;
  }

  async findOne(id: string, query: IQueryFeatures) {
    const select =
      Object.keys(query.fields)?.length > 0
        ? {
            ...query.fields,
            organizationId: 1,
          }
        : {};
    const user = await this.userModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .select(select);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);
  }
}
