import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import CustomAutocomplete from 'src/@core/components/mui/autocomplete';
import CustomTextField from 'src/@core/components/mui/text-field';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ENUM, exportReport } from 'src/store/apps/export';
import { useDispatch } from 'react-redux';

const ReportPage = () => {
    const schema = yup.object({
        reportType: yup.string().required('Tipe Report harus ada'),
        month: yup.number().typeError('Bulan harus ada').required('Bulan harus ada'),
        year: yup.number().typeError('Tahun harus ada').required('Tahun harus ada')
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const dispatch = useDispatch()


    const typeReport = [
        { id: 1, label: 'Sales Order', value: ENUM.SALES_ORDER },
        // { label: 'Sales Invoice', value: 'sales-invoice' },
        // { label: 'Purchase Order', value: 'purchase-order' },
    ]
    const month = [
        { id: 1, label: 'January', value: 1 },
        { id: 2, label: 'February', value: 2 },
        { id: 3, label: 'March', value: 3 },
        { id: 4, label: 'April', value: 4 },
        { id: 5, label: 'May', value: 5 },
        { id: 6, label: 'June', value: 6 },
        { id: 7, label: 'July', value: 7 },
        { id: 8, label: 'August', value: 8 },
        { id: 9, label: 'September', value: 9 },
        { id: 10, label: 'October', value: 10 },
        { id: 11, label: 'November', value: 11 },
        { id: 12, label: 'December', value: 12 }
    ]

    const onSubmit = data => {
        dispatch(exportReport(data))
    };

    const startYear = 2025
    const currentYear = new Date().getFullYear()

    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', paddingY: 3 }}>
                    <Typography fontSize={20}>Export Report</Typography>
                </Box>
                <Grid container spacing={6}>
                    {/* left Card */}
                    <Grid item xs={12} md={12}>
                        <Card>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={12}>
                                            <Controller
                                                name="reportType"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomAutocomplete
                                                        options={typeReport}
                                                        id='autocomplete-report-type'
                                                        getOptionLabel={option => option.label || ''}
                                                        onChange={(event, newValue) => {
                                                            onChange(+newValue?.id || '')
                                                            setValue('reportType', newValue?.value || '')
                                                        }}
                                                        renderInput={params => (
                                                            <CustomTextField
                                                                {...params}
                                                                error={Boolean(errors?.reportType)}
                                                                {...(errors?.reportType && {
                                                                    helperText: errors?.reportType.message
                                                                })}
                                                                label='Tipe Report'
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={6} sx={{ marginTop: 1 }}>
                                        <Grid item xs={12} md={12}>
                                            <Controller
                                                name="month"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomAutocomplete
                                                        options={month}
                                                        id='autocomplete-month'
                                                        getOptionLabel={option => option.label || ''}
                                                        onChange={(event, newValue) => {
                                                            onChange(+newValue?.id || '')
                                                        }}
                                                        renderInput={params => (
                                                            <CustomTextField
                                                                {...params}
                                                                error={Boolean(errors?.month)}
                                                                {...(errors?.month && {
                                                                    helperText: errors?.month.message
                                                                })}
                                                                label='Bulan'
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={6} sx={{ marginTop: 1 }}>
                                        <Grid item xs={12} md={12}>
                                            <Controller
                                                name="year"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomAutocomplete
                                                        options={years.map(y => ({ id: y, label: y.toString(), value: y }))}
                                                        id='autocomplete-year'
                                                        getOptionLabel={option => option.label || ''}
                                                        onChange={(event, newValue) => {
                                                            onChange(+newValue?.id || '')
                                                        }}
                                                        renderInput={params => (
                                                            <CustomTextField
                                                                {...params}
                                                                error={Boolean(errors?.year)}
                                                                {...(errors?.year && {
                                                                    helperText: errors?.year.message
                                                                })}
                                                                label='Tahun'
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        display='flex'
                                        justifyContent='flex-end'
                                        gap={6}
                                    >
                                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                            Export Report
                                        </Button>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ReportPage;