import { IDesktopInfo } from "../utils";

export enum UseStatus {
  CONTROLLING = "20", // 20-运行中（其他端正在远控中）
  RUNNING = "25", // 25-运行中
  SHUTDOWN = "105", // 105-已关机
}

export interface IDesktopListItem {
  id: string;
  objName: string;
  desktopCode: string;
  useStatus: UseStatus;
  useStatusText: string;
  useStatusColor: string;

  /** 是否需要唤醒 */
  needLineUp: boolean;
}

interface ICTYunConfig {
  uri: string;
  servername: string;
  host: string;
  port: number;
  cert: string;
  ca: string;
  ssl: boolean;
  key: string;
  screen: {
    w: number;
    h: number;
  };
  desktopId: string;
  token: string;
  deviceType: number;
  deviceCode: string | null;
  osType: number;
  osName: string;
  userAccount: string;
  clipBoardIn: boolean;
  clipBoardOut: boolean;
  dragFileIn: boolean;
  dragFileOut: boolean;
  clientStrategy: number;
  oqs: number;
  flowChartConfig: number;
  picUpperFrameRatio: number;
  picQulity: number;
  videoQulity: number;
  subjpegQuality: number;
  videoFrameRatio: number;
}

interface ICTYun {
  /** 停止连接 */
  stop(): void;

  /** 运行客户端 */
  run(config: ICTYunConfig): void;

  /** 退出客户端 */
  exit(): void;
}

declare global {
  interface Window {
    forceMission3?: boolean;
    CTYunPCKeepAliveElectronVersion: string;
    ctct: { identify: Function; init: Function; track: Function };
    __APP__: {
      clink: ICTYun;
      desktop: {
        getDesktopPageList: (props: {
          getCnt: 20;
          desktopTypes: ["1", "2001", "2002"];
          desktopStateFilter: "";
        }) => Promise<Array<IDesktopListItem>>;
        getDesktopList: () => Promise<Array<IDesktopListItem>>;
        createDesktopConnection: (desktop: IDesktopListItem) => Promise<void>;
        deleteDesktopConnection: (id: string) => Promise<void>;
        connectDesktop: (id: string) => Promise<{
          connectionInfo: {
            desktopInfo: IDesktopInfo;
          };
        }>;
      };
    };
  }
}

export type { ICTYun, ICTYunConfig };
