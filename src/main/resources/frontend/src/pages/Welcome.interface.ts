export interface IHostEntity {
  name: string;
  id?: string;
  protocol: number;
  hostname: string;
  port: number;
  username?: string;
  possword: string;
  thumbnail?: string;
  ignoreCert?: boolean;
  category?: number;
}

export interface IHostCategory {
  name: string;
  id: string;
}

export interface IProtocolForm {
  name: string;
  required: boolean;
  type: 'text' | 'select' | 'number' | 'switch';
  message: string;
  defaultValue?: any;
  value?: any;
}
export interface IProtocolForms {
  ssh: IProtocolForm[];
  telnet: IProtocolForm[];
  rdp: IProtocolForm[];
  vnc: IProtocolForm[];
}
