import { Grid } from '@mui/material'
import CardPrinter from './CardPrinter'
import CardTestPrinter from './CardTestPrinter'

export default function SettingSectionPrinter({ printerList, printerHealthStatus, handleSelectPrinter }) {
  return printerList?.map((printer, index) => (
    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
      <Grid item xs={12} md={9}>
        <CardPrinter
          printer={printer}
          printerHealthStatus={printerHealthStatus}
          handleSelectPrinter={handleSelectPrinter}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardTestPrinter printer={printer} />
      </Grid>
    </Grid>
  ))
}
