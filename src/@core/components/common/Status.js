
import { useMemo } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

export default function Status(props) {
  const color = useMemo(() => {
    switch (props.status) {
      case 'PENDING':
        return 'info'
      case 'APPROVED':
        return 'success'
      case 'REJECTED':
        return 'error'
      case 'DRAFT':
        return 'warning'
      default:
        return 'primary'
    }
  }, [props.status]
  )

  return (
    <CustomChip
      rounded
      size='small'
      skin='light'
      color={color}
      label={props.status || '-'}
      sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
    />
  )
}