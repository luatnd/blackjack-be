import { Module } from '@nestjs/common';
import { BlackjackController } from './blackjack.controller';
import { BlackjackService } from './blackjack.service';

@Module({
  controllers: [BlackjackController],
  providers: [BlackjackService]
})
export class BlackjackModule {}
