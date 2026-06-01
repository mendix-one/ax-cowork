import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { App } from './App';
const root = createRoot(document.getElementById('root'));
root.render(_jsx(StrictMode, { children: _jsx(ConfigProvider, { theme: { token: { colorPrimary: '#3F51B5' } }, children: _jsx(App, {}) }) }));
