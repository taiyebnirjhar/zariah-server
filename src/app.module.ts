import { validateEnv } from '@/config';
import { LoggerModule } from '@/modules/logger/logger.module';
import { MongoDBModule } from '@/modules/mongodb/mongodb.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongoDBModule,
    LoggerModule,
    UserModule,
    ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
