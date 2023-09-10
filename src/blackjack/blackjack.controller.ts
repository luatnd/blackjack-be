import {Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Request, SerializeOptions, UseGuards} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {GameMatch} from "./model/GameMatch";
import {BlackjackService} from "./blackjack.service";
import {HandDto} from "./datasource/db-collection/Matchs";


@ApiTags('BlackJack')
@Controller({
  path: 'blackjack',
  version: '1',
})
export class BlackjackController {
  constructor(private readonly service: BlackjackService) {}


  @ApiBearerAuth()
  @Get('last-match')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public lastMatch(@Request() request): Promise<GameMatch> {
    const user = request.user
    return this.service.getUserLastMatch(user.id);
  }

  @ApiBearerAuth()
  @Post('new-match')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public newMatch(@Request() request): Promise<GameMatch> {
    const user = request.user
    return this.service.createNewMatch(user.id);
  }

  @ApiBearerAuth()
  @Patch('hit')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public hit(@Request() request): Promise<GameMatch> {
    const user = request.user
    return this.service.hit(user.id);
  }

  @ApiBearerAuth()
  @Patch('stay')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public stay(@Request() request): Promise<GameMatch> {
    const user = request.user
    return this.service.stay(user.id);
  }
}
