import { Card, Grid, Typography, Box, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchCompanyInfo,
} from "src/store/apps/config/configCompany";
import CompanyInfoCard from "src/views/settings/configuration-setting/CompanyInfoCard";

export default function ConfigurationSetting() {
  const dispatch = useDispatch();

  const { loadingCompanyInfo: loading, errorCompanyInfo: error, companyInfo } = useSelector(state => state.companyConfig);

  // Fetch company info on mount
  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchCompanyInfo());
  };

  if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    )
  }

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ p: 4 }}>
            <Typography color="error" align="center">
              Error loading configuration settings: {error}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography paddingY={3} fontSize={20}>
          Configuration Settings
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CompanyInfoCard
          companyInfo={companyInfo}
          onUpdate={refetch}
        />
      </Grid>
    </Grid>
  )
}
