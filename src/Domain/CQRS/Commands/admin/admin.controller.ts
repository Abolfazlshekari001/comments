import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AddSystemDto,
  AddSystemResponseDto,
} from 'src/Domain/DTO/addSystem.dto';
import { addSystemCommand } from './add-system.command';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GatewayGuard } from 'src/Common/guard/getWay.guard';
@UseGuards(GatewayGuard)
@Controller('admin')
export class adminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @Post('addSystem')
  @ApiOperation({
    summary: 'this api will add system'
  })
  async addSystem(
    @Req() req,
    @Body() body: AddSystemDto,
  ): Promise<AddSystemResponseDto> {
    const result = await this.commandBus.execute(
      new addSystemCommand(req, body),
    );
    return result as AddSystemResponseDto;
  }
}
