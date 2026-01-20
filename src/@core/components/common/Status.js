import { useMemo } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

export default function Status(props) {
  const color = useMemo(() => {
    if (props?.color) {
      return props?.color
    }
    switch (props?.status) {
      case 'VOID':
        return 'error'
      case 'PENDING':
        return 'info'
      case 'APPROVED':
      case 'PAID':
        return 'success'
      case 'REJECTED':
        return 'error'
      case 'DRAFT':
        return 'warning'
      default:
        return 'primary'
    }
  }, [props?.status])

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
