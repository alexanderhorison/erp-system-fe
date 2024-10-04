import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function LoadingSpinner({
  loading,
  size = 100,
}) {
  return (
    <>
      {
        loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={size} />
          </Box>
        )
      }
    </>
  )
}