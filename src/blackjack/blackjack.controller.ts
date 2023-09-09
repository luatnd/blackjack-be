import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiTags('BlackJack')
@Controller({
  path: 'blackjack',
  version: '1',
})
export class BlackjackController {
  @ApiBearerAuth()
  @Post('new-match')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public newMatch(

  ): Promise<string> {
    return new Promise(resolve => resolve("oke"));
  }
}
