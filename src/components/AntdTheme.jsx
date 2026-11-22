'use client';

import React from 'react';
import { ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#19678b',
    colorLink: '#19678b',
    colorSuccess: '#7dc142',
    colorWarning: '#d68645',
    colorError: '#a35243',
    fontFamily: 'Roboto, Arial, sans-serif',
    borderRadius: 10,
    colorText: '#19678b',
    colorTextSecondary: '#607c8c',
    colorBorder: '#dbe8f0',
  },
  components: {
    Modal: { contentBg: '#ffffff', headerBg: '#ffffff' },
    Drawer: { colorBgElevated: '#ffffff' },
    Table: { headerBg: '#fbfcfd', borderColor: '#e9ebee' },
  },
};

export default function AntdTheme({ children }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
