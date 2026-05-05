import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/context'
import styles from './Home.module.scss'

export const Home = observer(function Home() {
  const { counter } = useStore()

  return (
    <Box className={styles.root}>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" className={styles.count}>
        Count: {counter.count}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={counter.increment}>
          Increment
        </Button>
        <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={counter.reset}>
          Reset
        </Button>
      </Stack>
    </Box>
  )
})
