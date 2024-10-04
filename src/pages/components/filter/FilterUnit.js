import React, { useEffect, useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import Icon from 'src/@core/components/icon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterDataUnit } from 'src/store/apps/master/unit';

export default function FilterUnit({ data, handleChangeQuery }) {
  const dispatch = useDispatch();
  const { data: unitList } = useSelector((state) => state.unit);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (!unitList.length) {
      dispatch(fetchMasterDataUnit());
    }
  }, []);

  useEffect(() => {
    const initialUnit = unitList.find((item) => item.id === data.id);
    setSelectedUnit(initialUnit);
  }, [unitList, data]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectUnit = (unit) => {
    handleChangeQuery({
      key: 'id',
      value: unit.id,
    });
    setSelectedUnit(unit);
    handleCloseMenu();
  };

  return (
    <Box>
      {/* Unit Filter */}
      <Button
        size="small"
        variant="outlined"
        aria-haspopup="true"
        onClick={handleOpenMenu}
        sx={{ mr: 2, '& svg': { ml: 0.5 } }}
      >
        {selectedUnit?.name || 'Select Unit'}
        <Icon fontSize="1rem" icon="tabler:chevron-down" />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onBlur={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {unitList.map((item) => (
          <MenuItem key={item.id} onClick={() => handleSelectUnit(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}