import { useState } from 'react'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

const ToolbarInvoice = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <HeaderedCard title='Action'>
      <DownloadButton url={'delivery-order'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
    </HeaderedCard>
  )
}

export default ToolbarInvoice
