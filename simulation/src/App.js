import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Menu } from 'antd';
import { Link, NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AxLoginSimPage } from './pages/AxLoginSimPage';
const widgets = [
    { key: '/widgets/ax-login', label: 'AxLogin' },
    // Add more widget entries here as they come online.
];
export function App() {
    return (_jsx(Router, { children: _jsxs(Layout, { style: { minHeight: '100vh' }, children: [_jsxs(Layout.Sider, { width: 220, style: { background: '#fff', borderRight: '1px solid #f0f0f0' }, children: [_jsx("div", { style: { padding: 16, fontWeight: 600, fontSize: 14, color: '#3F51B5' }, children: _jsx(Link, { to: "/", style: { color: 'inherit' }, children: "AX Widget Sim" }) }), _jsx(Menu, { mode: "inline", style: { borderRight: 0 }, children: widgets.map((w) => (_jsx(Menu.Item, { children: _jsx(NavLink, { to: w.key, children: w.label }) }, w.key))) })] }), _jsx(Layout.Content, { style: { padding: 24, background: '#f5f5f5' }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, { widgets: widgets }) }), _jsx(Route, { path: "/widgets/ax-login", element: _jsx(AxLoginSimPage, {}) })] }) })] }) }));
}
