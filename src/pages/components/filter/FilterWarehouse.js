import React, { useEffect, useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import Icon from 'src/@core/components/icon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse';

export default function FilterWarehouse({ data, handleChangeQuery }) {
  const dispatch = useDispatch();
  const { data: warehouseList } = useSelector((state) => state.warehouse);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    if (!warehouseList.length) {
      dispatch(fetchMasterDataWarehouse());
    }
  }, []);

  useEffect(() => {
    const initialWarehouse = warehouseList.find((item) => item.id === data.warehouseId);
    setSelectedWarehouse(initialWarehouse);
  }, [warehouseList, data.warehouseId]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectWarehouse = (warehouse) => {
    handleChangeQuery({
      key: 'warehouseId',
      value: warehouse.id,
    });
    setSelectedWarehouse(warehouse);
    handleCloseMenu();
  };

  return (
    <Box>
      {/* Warehouse Filter */}
      <Button
        size="small"
        variant="outlined"
        aria-haspopup="true"
        onClick={handleOpenMenu}
        sx={{ mr: 2, '& svg': { ml: 0.5 } }}
      >
        {selectedWarehouse?.name || 'Select Warehouse'}
        <Icon fontSize="1rem" icon="tabler:chevron-down" />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {warehouseList.map((item) => (
          <MenuItem key={item.id} onClick={() => handleSelectWarehouse(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}