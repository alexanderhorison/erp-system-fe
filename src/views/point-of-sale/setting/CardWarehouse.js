import { Card, CardContent, Typography } from '@mui/material'

export default function CardWarehouse({ warehouse, handleSelectWarehouse }) {
  const selected = localStorage.getItem('warehousePos') ? JSON.parse(localStorage.getItem('warehousePos')) : null
  return (
    <Card
      sx={{
        mb: 2,
        bgcolor:
          selected?.warehouseId === warehouse.id
            ? `${process.env.NEXT_PUBLIC_ENVIRONTMENT == 'development' ? '#E3F2FD' : '#d6bdab'}`
            : 'background.paper',
        cursor: 'pointer'
      }}
      onClick={() => handleSelectWarehouse(warehouse)}
    >
      <CardContent>
        <Typography variant='h6'>{warehouse.name}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Lokasi: {warehouse.location}
        </Typography>
        <Typography variant='body2' color={warehouse.status === 'active' ? 'green' : 'red'}>
          Status: {warehouse.status}
        </Typography>
      </CardContent>
    </Card>
  )
}
