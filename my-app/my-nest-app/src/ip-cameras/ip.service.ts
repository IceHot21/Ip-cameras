import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg'; // Используйте импорт по умолчанию
import RtspStream from 'node-rtsp-stream'; // Используйте импорт по умолчанию
import { startProbe } from 'node-onvif-ts';

@Injectable()
export class IpService {
  private streams: { [key: number]: RtspStream } = {};
  private recordings: { [key: number]: ffmpeg.FfmpegCommand } = {};
  private readonly logger = new Logger(IpService.name);

  constructor() {}

  startStream(rtspUrl: string, port: number): void {
    if (this.streams[port]) {
      this.streams[port].stop();
    }

    this.streams[port] = new RtspStream({
      name: `camera-${port}`,
      streamUrl: rtspUrl,
      wsPort: port,
      ffmpegOptions: {
        '-stats': '',
        '-r': '30',
        '-preset': 'ultrafast',
        '-tune': 'zerolatency',
        '-b:v': '800k', // Битрейт видео
      },
    });

    console.log(`Stream ${port} started`);
  }

  stopStream(port: number): void {
    const stream = this.streams[port];
    if (stream) {
      stream.stop();
      delete this.streams[port];
      console.log(`Stream ${port} stopped`);
    } else {
      console.warn(`Stream ${port} not found`);
    }
  }

  startRecording(rtspUrl: string, cameraName: string, port: number): string {
    const now = Date.now();
    const fileName = `video_${cameraName}_${now}.mp4`;
    const filePath = path.join(__dirname, '..', 'recordings', fileName);

    this.recordings[port] = ffmpeg(rtspUrl)
      .outputOptions('-c:v copy')
      .save(filePath)
      .on('end', () => {
        delete this.recordings[port];
        console.log(`Recording ${fileName} ended`);
      })
      .on('error', (err: any) => {
        delete this.recordings[port];
        console.error(`Recording error: ${err.message}`);
      });

    return fileName;
  }

  stopRecording(port: number): void {
    const recorder = this.recordings[port];
    if (recorder) {
      recorder.kill('SIGINT'); // Обновлено для корректного остановки
      console.log(`Recording stopped for port ${port}`);
    } else {
      console.warn(`Recording not found for port ${port}`);
    }
  }

  listRecordings(startDate: string, endDate: string): string[] {
    const recordingsDir = path.join(__dirname, '..', 'recordings');
    const files = fs.readdirSync(recordingsDir);

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    return files.filter((file) => {
      const match = file.match(/\d+/);
      if (match) {
        const timestamp = parseInt(match[0], 10);
        return timestamp >= startTimestamp && timestamp <= endTimestamp;
      }
      return false;
    });
  }

  getScreen(fileName: string): string | null {
    const filePath = path.join(__dirname, '..', 'screens', fileName);
    return fs.existsSync(filePath) ? filePath : null;
  }

  getScreens(): string[] {
    const screensDir = path.join(__dirname, '..', 'screens');
    return fs.readdirSync(screensDir);
  }

  saveScreens(rtspUrl: string, cameraName: string): string {
    const now = Date.now();
    const fileName = `screenshot_${cameraName}_${now}.png`;
    const filePath = path.join(__dirname, '..', 'screens', fileName);

    ffmpeg(rtspUrl)
      .outputOptions('-frames:v 1')
      .save(filePath)
      .on('end', () => {
        console.log(`Screenshot ${fileName} saved`);
      })
      .on('error', (err: any) => {
        console.error(`Screenshot error: ${err.message}`);
      });

    return fileName;
  }

  listScreens(startDate: string, endDate: string): string[] {
    const screensDir = path.join(__dirname, '..', 'screens');
    const files = fs.readdirSync(screensDir);

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    return files.filter((file) => {
      const match = file.match(/\d+/);
      if (match) {
        const timestamp = parseInt(match[0], 10);
        return timestamp >= startTimestamp && timestamp <= endTimestamp;
      }
      return false;
    });
  }

  getRecordings(fileName: string): string | null {
    const filePath = path.join(__dirname, '..', 'recordings', fileName);
    return fs.existsSync(filePath) ? filePath : null;
  }
  async getCamerasList(): Promise<
    { urn: string; name: string; address: string }[]
  > {
    try {
      // Использование промиса для получения списка устройств
      const deviceInfoList = await startProbe();

      // Формирование списка камер
      const cameras = deviceInfoList.map((info: any) => ({
        urn: info.urn,
        name: info.name,
        address: info.xaddrs[0],
      }));

      console.log(cameras.length + ' devices were found.');
      return cameras;
    } catch (error) {
      console.error('Error during ONVIF discovery:', error);
      throw error;
    }
  }
}
