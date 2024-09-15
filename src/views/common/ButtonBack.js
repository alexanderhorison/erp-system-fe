import { Grid, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Icon from 'src/@core/components/icon'

export default function ButtonBack({ name = 'Kembali', paddingY = 3 }) {
  const router = useRouter()
  const goBack = () => {
    router.back()
  }

  return (
    <Grid item xs={12} paddingY={paddingY}>
      <Typography fontSize={20}>
        <IconButton onClick={goBack}>
          <Icon icon='tabler:arrow-left' />
        </IconButton>
        {name}
      </Typography>
    </Grid>
  )
}