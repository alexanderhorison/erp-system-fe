// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Design Tokens
import { colors, radii, stone } from 'src/configs/designTokens'

// ** One payment option: icon, name and description, with a radio at the top right.
export default function CustomPaymentTypePos(props) {
  // ** Props
  const { data, icon, name, selected, gridProps, handleChange, color = 'primary' } = props
  const { title, value, description } = data

  const isSelected = selected === value

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          onClick={() => handleChange(value)}
          sx={{
            p: 3,
            gap: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'relative',
            borderRadius: `${radii['3xl']}px`,
            border: `1px solid ${isSelected ? colors.foreground : colors.border}`,
            backgroundColor: isSelected ? stone[50] : colors.background,
            transition: 'border-color 0.15s',
            '&:hover': { borderColor: isSelected ? colors.foreground : colors.border3 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: `1px solid ${colors.border}`,
                color: colors.foreground
              }}
            >
              {icon}
            </Box>
            <Radio
              name={name}
              size='small'
              color={color}
              value={value}
              onChange={handleChange}
              checked={isSelected}
              sx={{ p: 0 }}
            />
          </Box>
          <Box>
            {title && (
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground }}>{title}</Typography>
            )}
            {description && (
              <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>{description}</Typography>
            )}
          </Box>
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}
