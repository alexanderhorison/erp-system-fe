import { Controller } from "react-hook-form";
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  IconButton,
  Card,
  CardContent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Icon from "src/@core/components/icon";
import { useState } from "react";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FormFileUpload({
  name,
  control,
  label,
  required = false,
  loading = false,
  accept = "image/*",
  currentImageUrl = null,
  errors
}) {
  const [preview, setPreview] = useState(currentImageUrl);

  const handleFileChange = (file, onChange) => {
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update form value
      onChange(file);
    }
  };

  const handleRemove = (onChange) => {
    setPreview(null);
    onChange(null);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {label} {required && '*'}
          </Typography>
          
          <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
            <CardContent>
              {preview ? (
                <Box>
                  <Avatar
                    src={preview}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      border: '2px solid',
                      borderColor: 'divider'
                    }}
                    variant="rounded"
                  >
                    <Icon icon="mdi:image" fontSize={40} />
                  </Avatar>
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Icon icon="mdi:upload" />}
                      disabled={loading}
                    >
                      Change
                      <VisuallyHiddenInput
                        type="file"
                        accept={accept}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange(file, onChange);
                          }
                        }}
                      />
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(onChange)}
                      disabled={loading}
                      color="error"
                    >
                      <Icon icon="mdi:delete" />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Icon 
                    icon="mdi:cloud-upload" 
                    fontSize={60} 
                    color="action.disabled"
                  />
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Upload company logo
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<Icon icon="mdi:upload" />}
                    disabled={loading}
                  >
                    Browse Files
                    <VisuallyHiddenInput
                      type="file"
                      accept={accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(file, onChange);
                        }
                      }}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {errors?.[name] && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors[name].message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}