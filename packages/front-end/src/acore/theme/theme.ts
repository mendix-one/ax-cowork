import { type ThemeConfig } from 'antd'
import type { AliasToken } from 'antd/es/theme/interface'
import antDToken from './token'
const myToken = { ...antDToken } as Partial<AliasToken>

export const axColors = {
  primary: '#3F51B5',
  secondary: '#009688',
  tertiary: '#673AB7',

  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  success: '#4CAF50',

  body: '#bfbfbf',
  panel: '#f5f5f5',
  action: '#434343',
} as const
export const axFontFamily = `'Roboto', -apple-system, sans-serif`

myToken.colorPrimary = axColors.primary
myToken.fontFamily = axFontFamily

myToken.colorText = '#262626'
myToken.colorBgLayout = '#bfbfbf'

export const axTheme: ThemeConfig = {
  token: { ...myToken },
  components: {
    Layout: {
      headerHeight: 36,
      headerPadding: '0 6px',
      footerPadding: '0 36px',
      bodyBg: myToken.colorBgLayout,
      headerBg: myToken.colorBgLayout,
      footerBg: myToken.colorBgLayout,
      siderBg: myToken.colorBgLayout,
    },
    Splitter: {
      splitBarSize: 2,
    },
    Divider: {
      orientationMargin: 0,
      textPaddingInline: 0,
      verticalMarginInline: 0,
    },
  },
}
