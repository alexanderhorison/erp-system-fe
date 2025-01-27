import { Card, Menu, MenuItem, Typography } from "@mui/material";
import LiveClock from "../common/LiveClock";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterDataWarehouse } from "src/store/apps/master/warehouse";
import { Box } from "@mui/system";

export default function DetailUserPos({ user, warehouse, setWarehouse }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: warehouseList } = useSelector((state) => state.warehouse);

  const handleSelectWarehouse = (data) => {
    setAnchorEl(null)
    localStorage.setItem('warehousePos', JSON.stringify({ warehouseId: data.id, warehouseName: data.name }))
    setWarehouse({
      warehouseId: data.id,
      warehouseName: data.name
    })
  }

  const handleOpenMenu = (event) => {
    if (user?.warehouseId) return
    if (!warehouseList.length) {
      dispatch(fetchMasterDataWarehouse({}));
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
      <Box onClick={(e) => handleOpenMenu(e)}>
        <Typography
          sx={{ py: '0.25rem', fontWeight: 500, color: "text.secondary" }}
        // aria-haspopup="true"
        >
          {warehouse?.warehouseName || "Pilih Gudang"}
        </Typography>
      </Box>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onBlur={() => handleCloseMenu()}
      >
        {warehouseList.map((item) => (
          <MenuItem key={item.id} sx={{ bgcolor: warehouse?.warehouseId === item.id ? 'action.selected' : '' }} onClick={() => handleSelectWarehouse(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
      <Typography sx={{ py: '0.25rem', fontSize: 13, color: "text.secondary" }}>
        <LiveClock utcOffset={7} />
      </Typography>
    </Card>
  )
}

