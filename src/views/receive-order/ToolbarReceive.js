import { useState } from 'react'

// ** Shared Components
import HeaderedCard from 'src/views/common/HeaderedCard'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

const ToolbarReceive = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <HeaderedCard title='Action'>
      <DownloadButton url={'delivery-order-receive'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
    </HeaderedCard>
  )
}

export default ToolbarReceive
