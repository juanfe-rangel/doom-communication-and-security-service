import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportUserDTO, UpdateReportStatusDto } from './ReportDTOS';
import { REPORT_PORTS } from 'src/Application/Ports/Out/ReportTokens';
import type { ReportUserUseCase } from 'src/Application/Ports/In/Report/ReportUserUseCase';
import type { GetReportsUseCase } from 'src/Application/Ports/In/Report/GetReportsUseCase';
import type { GetReportByIdUseCase } from 'src/Application/Ports/In/Report/GetReportByIdUseCase';
import type { ManageReportUseCase } from 'src/Application/Ports/In/Report/ManageReportUseCase';
import type { GetUserReportUseCase } from 'src/Application/Ports/In/Report/GetUserReportUseCase';
import { ReportStatus } from 'src/Domain/Model/Enum/ReportStatus';

@ApiTags('Report')
@Controller('reports')
export class ReportController {
  constructor(
    @Inject(REPORT_PORTS.ReportUserUseCase)
    private readonly reportUserUseCase: ReportUserUseCase,
    @Inject(REPORT_PORTS.GetReportsUseCase)
    private readonly getReportsUseCase: GetReportsUseCase,
    @Inject(REPORT_PORTS.GetReportByIdUseCase)
    private readonly getReportByIdUseCase: GetReportByIdUseCase,
    @Inject(REPORT_PORTS.ManageReportUseCase)
    private readonly manageReportUseCase: ManageReportUseCase,
    @Inject(REPORT_PORTS.GetUserReportsUseCase)
    private readonly getUserReportsUseCase: GetUserReportUseCase,
  ) {}

  @Get()
  async getReports() {
    return this.getReportsUseCase.GetReports();
  }

  @Get(':id')
  async getReportById(@Param('id') id: string) {
    return this.getReportByIdUseCase.GetReportById(id);
  }

  @Get('user/:userId')
  async getUserReports(@Param('userId') userId: number) {
    const id = Number(userId);
    return this.getUserReportsUseCase.GetUserReport(id);
  }

  @Patch(':id')
  async manageReport(
    @Param('id') id: string,
    @Body() body: UpdateReportStatusDto,
  ) {
    return this.manageReportUseCase.ManageReport(id, body.reportStatus);
  }

  @Post('create')
  async createReport(@Body() reportDTO: ReportUserDTO) {
    return this.reportUserUseCase.ReportUser(reportDTO);
  }
}
