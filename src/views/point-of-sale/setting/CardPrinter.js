import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Icon from 'src/@core/components/icon'

export default function CardPrinter({ printer, handleSelectPrinter }) {
  let selected = localStorage.getItem('printerPos') ? JSON.parse(localStorage.getItem('printerPos')) : null;
  const { printerStatus } = useSelector(state => state.printer);

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        bgcolor: printer.id === selected?.id ? '#d6bdab' : 'background.paper'
      }}
      onClick={() => handleSelectPrinter(printer)}
    >
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">{printer.value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {printer.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              IP: {printer.value_json.ip}
            </Typography>
          </Grid>
          <Grid item>
            {printer.id === selected?.id && (!printerStatus.loading && printerStatus.connected && (
              <Icon icon={"tabler:checks"} width={24} height={24} />
            ))}
            {printer.id === selected?.id && (!printerStatus.loading && !printerStatus.connected && (
              <Icon icon={"tabler:plug-connected-x"} width={24} height={24} />
            ))}
            {printer.id === selected?.id && (printerStatus.loading && !printerStatus.connected && (
              <CircularProgress />
            ))}

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
