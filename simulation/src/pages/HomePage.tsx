import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

interface WidgetEntry {
    key: string;
    label: string;
}

export function HomePage({ widgets }: { widgets: WidgetEntry[] }) {
    return (
        <div>
            <Typography.Title level={3}>Widget simulations</Typography.Title>
            <Typography.Paragraph type="secondary">
                Each entry renders a Mendix pluggable widget with mocked runtime props so you can iterate without
                Studio Pro.
            </Typography.Paragraph>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {widgets.map(w => (
                    <Link key={w.key} to={w.key} style={{ textDecoration: "none" }}>
                        <Card hoverable style={{ width: 240 }}>
                            <Card.Meta title={w.label} description={w.key} />
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
