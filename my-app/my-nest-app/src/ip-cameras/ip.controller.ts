import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IpService } from './ip.service';

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Post('start-stream')
  startStream(
    @Body() body: { rtspUrl: string; port: number },
    @Res() res: Response,
  ) {
    this.ipService.startStream(body.rtspUrl, body.port);
    res.sendStatus(HttpStatus.OK);
  }

  @Post('stop-stream')
  stopStream(@Body() body: { port: number }, @Res() res: Response) {
    this.ipService.stopStream(body.port);
    res.sendStatus(HttpStatus.OK);
  }

  @Post('start-recording')
  startRecording(
    @Body() body: { rtspUrl: string; cameraName: string; port: number },
    @Res() res: Response,
  ) {
    const fileName = this.ipService.startRecording(
      body.rtspUrl,
      body.cameraName,
      body.port,
    );
    res.json({ success: true, fileName });
  }

  @Post('stop-recording')
  stopRecording(@Body() body: { port: number }, @Res() res: Response) {
    this.ipService.stopRecording(body.port);
    res.json({ success: true });
  }

  @Get('list-recordings')
  listRecordings(
    @Query() query: { startDate: string; endDate: string },
    @Res() res: Response,
  ) {
    const recordings = this.ipService.listRecordings(
      query.startDate,
      query.endDate,
    );
    res.json(recordings);
  }

  @Get('screens/:fileName')
  getScreen(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.ipService.getScreen(fileName);
    if (filePath) {
      res.sendFile(filePath);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'File not found' });
    }
  }

  @Get('screens')
  getScreens(@Res() res: Response) {
    const screens = this.ipService.getScreens();
    res.json(screens);
  }

  @Post('save-screens')
  saveScreens(
    @Body() body: { rtspUrl: string; cameraName: string },
    @Res() res: Response,
  ) {
    const fileName = this.ipService.saveScreens(body.rtspUrl, body.cameraName);
    res.json({ success: true, fileName });
  }

  @Get('list-screens')
  listScreens(
    @Query() query: { startDate: string; endDate: string },
    @Res() res: Response,
  ) {
    const screens = this.ipService.listScreens(query.startDate, query.endDate);
    res.json(screens);
  }

  @Get('recordings/:fileName')
  getRecordings(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.ipService.getRecordings(fileName);
    if (filePath) {
      res.sendFile(filePath);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'File not found' });
    }
  }
  @Get('cameras-list')
  async getCamerasList(@Res() res: Response) {
    try {
      // Использование await для получения результата
      const camerasList = await this.ipService.getCamerasList();
      // Отправка ответа после получения данных
      res.json(camerasList);
    } catch (error) {
      console.error('Error fetching camera list:', error);
      res.status(500).json({ message: 'Failed to fetch camera list' });
    }
  }
}
