import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Shared Components
import DownloadButton from 'src/views/components/buttons/ButtonDownload'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const ToolbarReceive = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card elevation={0} sx={surfaceCardSx}>
      <CardContent>
        <DownloadButton url={'delivery-order-receive'} id={id} setIsLoading={setIsLoading} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}

export default ToolbarReceive
