const { Button, CircularProgress } = require('@mui/material')
import Icon from 'src/@core/components/icon'
import { handlePrintDownload } from 'src/helpers/generatePdfFormData'

const DownloadButton = ({ url, id, isLoading, setIsLoading }) => {
  return (
    <Button
      fullWidth
      sx={{ mb: 2 }}
      variant='contained'
      onClick={() => {
        handlePrintDownload({ url, id, setIsLoading })
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} color='inherit' />
      ) : (
        <>
          <Icon fontSize='1.125rem' icon='tabler:download' />
          Unduh
        </>
      )}
    </Button>
  )
}
export default DownloadButton
