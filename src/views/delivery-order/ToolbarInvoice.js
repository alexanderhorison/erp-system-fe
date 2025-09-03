// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DownloadButton from 'src/views/components/buttons/ButtonDownload'
import { useState } from 'react'

const ToolbarInvoice = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card>
      <CardContent>
        <DownloadButton url={'delivery-order'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}

export default ToolbarInvoice
