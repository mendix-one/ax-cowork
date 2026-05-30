import { Layout, Menu } from "antd";
import { Link, NavLink, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AxLoginSimPage } from "./pages/AxLoginSimPage";

const widgets = [
    { key: "/widgets/ax-login", label: "AxLogin" }
    // Add more widget entries here as they come online.
];

export function App() {
    return (
        <Router>
            <Layout style={{ minHeight: "100vh" }}>
                <Layout.Sider width={220} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
                    <div style={{ padding: 16, fontWeight: 600, fontSize: 14, color: "#3F51B5" }}>
                        <Link to="/" style={{ color: "inherit" }}>
                            AX Widget Sim
                        </Link>
                    </div>
                    <Menu mode="inline" style={{ borderRight: 0 }}>
                        {widgets.map(w => (
                            <Menu.Item key={w.key}>
                                <NavLink to={w.key}>{w.label}</NavLink>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Layout.Sider>
                <Layout.Content style={{ padding: 24, background: "#f5f5f5" }}>
                    <Routes>
                        <Route path="/" element={<HomePage widgets={widgets} />} />
                        <Route path="/widgets/ax-login" element={<AxLoginSimPage />} />
                    </Routes>
                </Layout.Content>
            </Layout>
        </Router>
    );
}
