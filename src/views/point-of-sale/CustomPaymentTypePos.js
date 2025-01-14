// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'
import React from 'react'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

export default function CustomPaymentTypePos(props) {
  // ** Props
  const { data, icon, name, selected, gridProps, iconProps, handleChange, color = 'primary', iconWidth, iconHeight } = props
  const { title, value, content } = data

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          onClick={() => handleChange(value)}
          sx={{
            p: 2,
            gap: 1,
            height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'center',
            flexDirection: 'column',
            border: theme => `1px solid ${theme.palette.divider}`,
            ...(selected === value
              ? {
                borderColor: `${color}.main`,
                '& svg': { color: theme => `${theme.palette.primary.main} !important` }
              }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          {
            icon ? (
              React.cloneElement(icon, { width: iconWidth, height: iconHeight, })
            ) : (
              <></>
            )
          }
          {title ? (
            typeof title === 'string' ? (
              <Typography variant='h6' sx={{ ...(content ? { mb: 2 } : { my: 'auto' }) }}>
                {title}
              </Typography>
            ) : (
              title
            )
          ) : null}
          {content ? (
            typeof content === 'string' ? (
              <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
                {content}
              </Typography>
            ) : (
              content
            )
          ) : null}
          <Radio
            name={name}
            size='small'
            color={color}
            value={value}
            onChange={handleChange}
            checked={selected === value}
          // sx={{ mb: -2, ...(!icon && !title && !content && { mt: -2 }) }}
          />
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}
