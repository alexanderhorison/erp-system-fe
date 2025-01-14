import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import Icon from 'src/@core/components/icon';

export default function MenuPos({ data = [], onChange, value, trigger }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(value);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange(item)
    handleCloseMenu();
    trigger()
  };

  return (
    <Box>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        aria-haspopup="true"
        onClick={handleOpenMenu}
        sx={{ mr: 2, '& svg': { ml: 0.5 } }}
      >
        {selectedItem?.name}
        <Icon fontSize="1rem" icon="tabler:chevron-down" />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onBlur={handleCloseMenu}
      >
        {data.map((item) => (
          <MenuItem sx={{ minWidth: 300 }} key={item?.code} onClick={() => handleSelect(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}