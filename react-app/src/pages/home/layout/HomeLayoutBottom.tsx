import { Flex, Layout } from 'antd'
import { HOME_FRAME } from './home-frame.ts'

// Thin bottom bar — its height sets the frame thickness the empty left/right rails match.
export const HomeLayoutBottom = () => {
  return (
    <Layout.Footer>
      <Flex align="center" justify="space-between" gap="small" style={{ height: HOME_FRAME }}>
        &nbsp;
      </Flex>
    </Layout.Footer>
  )
}
