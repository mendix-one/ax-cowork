import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
export function HomePage({ widgets }) {
  return _jsxs('div', {
    children: [
      _jsx(Typography.Title, { level: 3, children: 'Widget simulations' }),
      _jsx(Typography.Paragraph, {
        type: 'secondary',
        children: 'Each entry renders a Mendix pluggable widget with mocked runtime props so you can iterate without Studio Pro.',
      }),
      _jsx('div', {
        style: { display: 'flex', gap: 16, flexWrap: 'wrap' },
        children: widgets.map((w) =>
          _jsx(
            Link,
            {
              to: w.key,
              style: { textDecoration: 'none' },
              children: _jsx(Card, { hoverable: true, style: { width: 240 }, children: _jsx(Card.Meta, { title: w.label, description: w.key }) }),
            },
            w.key,
          ),
        ),
      }),
    ],
  })
}
