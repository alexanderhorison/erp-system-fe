import { Typography } from "@mui/material";
import { Box } from "@mui/system";


export default function BoxCode({
  value,
  isClickable = false,
  url,
}) {

  if (!value) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
      <Typography
        variant='body2'
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
          color: 'text.primary',
          '& svg': { color: 'success.main' },
          ':hover': {
            cursor: isClickable ? 'pointer' : 'default',
            color: isClickable ? 'blue' : 'text.primary',
          },
        }}
        onClick={isClickable ? () => {
          window.open(url, '_blank');
        } : undefined}
      >
        {value || "-"}
      </Typography>
    </Box>
  )
}