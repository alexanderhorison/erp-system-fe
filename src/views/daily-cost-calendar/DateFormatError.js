import React from 'react';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from 'next/link';
import Icon from 'src/@core/components/icon';

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

export default function DateFormatError({ format }) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    }}>
      <Box
        sx={{
          p: 6,
          maxWidth: 460,
          textAlign: 'center',
          borderRadius: `${radii.lg}px`,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.xs,
          backgroundColor: colors.background
        }}
      >
        <Icon icon="tabler:calendar-x" fontSize={48} color={colors.destructive} />

        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.foreground, mt: 4, mb: 2 }}>
          Invalid Date Format
        </Typography>

        <Typography sx={{ fontSize: '0.875rem', color: colors.foreground, mb: 2 }}>
          The date in the URL doesn't match the required format: <strong>{format}</strong>
        </Typography>

        <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground, mb: 5 }}>
          Please make sure the date is properly formatted and try again.
        </Typography>

        <Link href="/daily-cost-calendar" passHref legacyBehavior>
          <Button variant="contained" startIcon={<Icon icon="tabler:calendar" fontSize='1rem' />}>
            Return to Calendar
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
