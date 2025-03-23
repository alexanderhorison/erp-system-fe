import { Card, Typography } from "@mui/material";
import LiveClock from "../common/LiveClock";
import { Box } from "@mui/system";

export default function DetailUserPos({ user, warehouse, setOpenSetting }) {

  return (
    <Card
      sx={{
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <Typography sx={{ py: '0.25rem', fontWeight: 500, color: "text.secondary" }}>
        {user?.userName}
      </Typography>
      <Box onClick={setOpenSetting} >
        <Typography
          sx={{ py: '0.25rem', fontWeight: 500, color: warehouse?.warehouseName ? "text.secondary" : "red" }}
        >
          {warehouse?.warehouseName || "*Gudang Belum Dipilih"}
        </Typography>
      </Box>
      <Typography sx={{ py: '0.25rem', fontSize: 13, color: "text.secondary" }}>
        <LiveClock utcOffset={7} />
      </Typography>
    </Card>
  )
}

