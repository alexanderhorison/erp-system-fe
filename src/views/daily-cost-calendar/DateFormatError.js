import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';

export default function DateFormatError({ format }) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    }}>
      <Card sx={{ p: 5, maxWidth: 500, textAlign: 'center' }}>
        <Icon icon="tabler:calendar-x" fontSize={60} color="error" />

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Invalid Date Format
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          The date in the URL doesn't match the required format: <strong>{format}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
          Please make sure the date is properly formatted and try again.
        </Typography>

        <Link href="/daily-cost-calendar" passHref>
          <Button variant="contained" startIcon={<Icon icon="tabler:calendar" />}>
            Return to Calendar
          </Button>
        </Link>
      </Card>
    </Box>
  );
}