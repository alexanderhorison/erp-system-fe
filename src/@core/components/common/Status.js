import StatusChip from 'src/views/common/StatusChip'
import { formatStatusLabel } from 'src/helpers/formatStatusLabel'

// ** Tone per document status. Anything not listed (including unknown statuses)
// renders as the plain outlined pill, the same as an inactive master record.
const STATUS_TONE = {
  APPROVED: 'success',
  PAID: 'success',
  PENDING: 'info',
  DRAFT: 'warning',
  REJECTED: 'danger',
  VOID: 'danger'
}

// ** The `color` prop predates the pill and still takes MUI palette names.
const COLOR_TONE = { success: 'success', error: 'danger', warning: 'warning', info: 'info' }

export default function Status(props) {
  const tone = props?.color ? COLOR_TONE[props.color] : STATUS_TONE[props?.status]

  return <StatusChip tone={tone} label={props?.status ? formatStatusLabel(props.status) : '-'} />
}
