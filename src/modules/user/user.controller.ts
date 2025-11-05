import {
  QueryFeatureMultiple,
  QueryFeatureSingle,
} from '@/decorators/query-feature.decorator';
import { SwaggerGetMultipleQueryParams } from '@/decorators/sweggers.decorators';
import { IApiResponse } from '@/type/api-response.type';
import { IQueryFeatures } from '@/type/query-features.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<User>> {
    const user = await this.userService.create(createUserDto);

    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully retrieved.',
    type: [User],
  })
  @SwaggerGetMultipleQueryParams(UserSchema, ['password'])
  @Get()
  async findAll(
    @QueryFeatureMultiple() queryFeatures: IQueryFeatures,
  ): Promise<IApiResponse<User[]>> {
    const res = await this.userService.findAll(queryFeatures);
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: res.data,
      meta: {
        total: res.total,
        page: queryFeatures.page || 1,
        limit: queryFeatures.limit || res.total,
      },
    };
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @QueryFeatureSingle() queryFeatures: IQueryFeatures,
  ) {
    return this.userService.findOne(id, queryFeatures);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
