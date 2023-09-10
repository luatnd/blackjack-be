import { Module } from '@nestjs/common';
import { BlackjackController } from './blackjack.controller';
import { BlackjackService } from './blackjack.service';
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [BlackjackController],
  providers: [BlackjackService],
  imports: [UsersModule],
})
export class BlackjackModule {}
