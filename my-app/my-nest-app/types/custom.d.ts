declare module 'node-rtsp-stream' {
  interface RtspStreamOptions {
    name: string;
    streamUrl: string;
    wsPort: number;
    ffmpegOptions: {
      '-stats'?: string;
      '-r'?: string;
      '-preset'?: string;
      '-tune'?: string;
      '-b:v'?: string;
      '-maxrate'?: string;
      '-bufsize'?: string;
    };
  }

  class RtspStream {
    constructor(options: RtspStreamOptions);
    stop(): void;
  }

  export default RtspStream;
}
