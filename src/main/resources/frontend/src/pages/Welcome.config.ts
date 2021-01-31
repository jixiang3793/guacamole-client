import { IProtocolForms } from './Welcome.interface';

export const protocolForms: IProtocolForms = {
  ssh: [
    {
      name: 'hostname',
      required: true,
      type: 'text',
      message: '主机IP',
    },
    {
      name: 'port',
      required: true,
      type: 'number',
      message: '主机端口',
      defaultValue: 22,
    },
    {
      name: 'username',
      required: true,
      type: 'text',
      message: '用户名',
    },
    {
      name: 'password',
      required: true,
      type: 'text',
      message: '密码',
    },
  ],
  telnet: [
    {
      name: 'hostname',
      required: true,
      type: 'text',
      message: '主机IP',
    },
    {
      name: 'port',
      required: true,
      type: 'number',
      message: '主机端口',
      defaultValue: 23,
    },
    {
      name: 'username',
      required: true,
      type: 'text',
      message: '用户名',
    },
    {
      name: 'password',
      required: true,
      type: 'text',
      message: '密码',
    },
  ],
  rdp: [
    {
      name: 'hostname',
      required: true,
      type: 'text',
      message: '主机IP',
    },
    {
      name: 'port',
      required: true,
      type: 'number',
      message: '主机端口',
      defaultValue: 3389,
    },
    {
      name: 'username',
      required: true,
      type: 'text',
      message: '用户名',
    },
    {
      name: 'password',
      required: true,
      type: 'text',
      message: '密码',
    },
    {
      name: 'ignoreCert',
      required: false,
      type: 'switch',
      message: '忽略证书',
      defaultValue: true,
    },
  ],
  vnc: [
    {
      name: 'hostname',
      required: true,
      type: 'text',
      message: '主机IP',
    },
    {
      name: 'port',
      required: true,
      type: 'number',
      message: '主机端口',
      defaultValue: 5900,
    },
    {
      name: 'username',
      required: false,
      type: 'text',
      message: '用户名',
    },
    {
      name: 'password',
      required: true,
      type: 'text',
      message: '密码',
    },
  ],
};
