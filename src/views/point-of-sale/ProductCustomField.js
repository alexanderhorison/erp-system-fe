import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormInputText from '../common/Form/FormInputText';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { priceFormatWithZero } from 'src/helpers/priceFormatter';
import FormInputNumberPos from '../common/FormPos/FormInputNumberPos';
import { autoSavePos } from 'src/helpers/pos/autoSavePos';

const saveToLocalStorage = (data) => localStorage.setItem('listProductPos', JSON.stringify(data))

export default function ProductCustomField({
  append,
  fields,
}) {

  const {
    control,
    watch,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      title: "Custom Amount",
      quantity: 1,
      price: 0,
      productName: "Custom Amount",
    }
  })

  const handleAppend = () => {
    let value = getValues();
    const subTotal = value.quantity * value.price
    value = { ...value, productName: value.title, isCustom: true, subTotal, warehouseProductId: null };
    append(value);
    saveToLocalStorage([...fields, value])
    autoSavePos()
    reset();
  };

  const handleButtonClick = (value) => {
    const currentPrice = watch('price');
    if (value === 'C') {
      setValue('price', 0);
    } else if (value === 'Del') {
      const newPrice = currentPrice.toString().slice(0, -1);
      setValue('price', newPrice ? parseInt(newPrice, 10) : 0);
    } else {
      const newPrice = `${currentPrice}${value}`;
      setValue('price', parseInt(newPrice, 10));
    }
  };

  return (
    <Box sx={{
      margin: 'auto',
      // border: '1px solid #ccc'
    }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <FormInputText
            control={control}
            errors={errors}
            placeholder='Custom Amount'
            name="title"
            label="Judul"
          />
        </Grid>
        <Grid item xs={6}>
          <FormInputNumberPos
            control={control}
            errors={errors}
            placeholder='Quantity'
            name="quantity"
            min={1}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Typography variant="h3">
          Rp. {priceFormatWithZero(watch('price'))}
        </Typography>
      </Box>
      {/* HERE THE NUMBER */}
      <Grid container spacing={1} sx={{ mt: 2 }}>
        {[1, 2, 3, 0, 4, 5, 6, `00`, 7, 8, 9, `000`].map((value, index) => (
          <Grid item xs={3} key={index}>
            <Button
              variant="outlined"
              onClick={() => handleButtonClick(value)}
              sx={{ width: '100%', height: 85, borderRadius: 1 }}
            >
              {value}
            </Button>
          </Grid>
        ))}
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleButtonClick('C')}
            sx={{ width: '100%', height: 50 }}
          >
            C
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => handleButtonClick('Del')}
            sx={{ width: '100%', height: 50 }}
          >
            Del
          </Button>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={handleAppend}
        sx={{ mt: 2, width: '100%' }}
      >
        Tambahkan
      </Button>
    </Box>
  );
}