import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Grid,
  Box,
  Avatar
} from "@mui/material";
import { useState } from "react";
import Icon from "src/@core/components/icon";
import CompanyInfoModal from "src/views/settings/configuration-setting/CompanyInfoModal";

export default function CompanyInfoCard({ companyInfo, onUpdate }) {
  const [openModal, setOpenModal] = useState(false);

  const handleEdit = () => {
    if (companyInfo) {
      setOpenModal(true);
    }
  };

  const companyData = companyInfo?.value_json ? companyInfo.value_json : companyInfo;

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6">
              Company Information
            </Typography>
          }
          action={
            <IconButton
              onClick={handleEdit}
              sx={{ color: 'primary.main' }}
            >
              <Icon icon='mdi:pencil' />
            </IconButton>
          }
        />
        <CardContent>
          <Grid container spacing={4}>
            {companyData?.logoUrl && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mb={3}>
                  <Avatar
                    src={companyData?.logoUrl}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '2px solid',
                      borderColor: 'divider'
                    }}
                    variant="rounded"
                  >
                    <Icon icon="mdi:office-building" fontSize={40} />
                  </Avatar>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Company Name
                </Typography>
                <Typography variant="body1">
                  {companyData?.companyName || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  PT Name
                </Typography>
                <Typography variant="body1">
                  {companyData?.ptName || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Approval SO & PO
                </Typography>
                <Typography variant="body1">
                  {companyData?.ownerName || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Approval SO & PO Title
                </Typography>
                <Typography variant="body1">
                  {companyData?.ownerTitle || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  City
                </Typography>
                <Typography variant="body1">
                  {companyData?.city || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {companyData?.phoneNumber || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  PPN
                </Typography>
                <Typography variant="body1">
                  {companyData?.ppn || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Bank Information
                </Typography>
                <Typography variant="body1">
                  {companyData?.bank || '-'}
                </Typography>
              </Box>
            </Grid>


            <Grid item xs={12} sm={6}>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">
                  {companyData?.address || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {openModal && (
        <CompanyInfoModal
          open={openModal}
          setOpen={setOpenModal}
          companyInfo={companyInfo}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
