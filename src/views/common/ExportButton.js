import { Button, CircularProgress } from "@mui/material";
import Icon from "src/@core/components/icon";

export default function ExportButton({ handleExport, title, loading }) {
  return (
    <Button
      sx={{ '& svg': { mr: 2 } }}
      variant="contained"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={18} sx={{ mr: 2, color: "inherit" }} />
      ) : (
        <Icon fontSize="1.125rem" icon="tabler:download" />
      )}
      {title}
    </Button>
  );
}