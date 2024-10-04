import { Typography } from "@mui/material";
import { Box } from "@mui/system";


export default function BoxCode({
  value,
  isClickable = false,
  url,
}) {

  const user = JSON.parse(localStorage.getItem("userData"));

  if (!value) {
    return null
  }

  const code = value?.split(':')[1] || "-";
  const message = value?.split(':')[0] || "-";

  if (user.roleId === 1) {
    isClickable = true
  }


  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', '& svg': { color: 'success.main' } }}>
      <Typography
        variant='body2'
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
          color: 'text.primary',
        }}
      >
        {`${message}:` || "-"}
      </Typography>
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
        {code || "-"}
      </Typography>
    </Box>
  )
}