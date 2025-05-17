import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography, Card, CardContent, Alert, AlertTitle, Breadcrumbs } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// Import our cost components
import GeneralCostAndDeposit from './GeneralCostAndDeposit'
import EmployeeCostAndBonus from './EmployeeCostAndBonus'
import UnexpectedCost from './UnexpectedCost'
import SummaryCost from './SummaryCost'
import ButtonBack from '../common/ButtonBack'
import { useDispatch, useSelector } from 'react-redux'
import { addDailyCost, fetchDetailDailyCostByDate, updateDailyCost } from 'src/store/apps/daily-cost'

dayjs.locale('id')

// Define validation schema
const schema = yup.object({
  date: yup.date().required('Tanggal harus diisi'),
  notes: yup.string().optional(),
  status: yup.string().default('APPROVED').optional(),
  grandTotal: yup.number().default(0).optional(),
  totalCostGeneral: yup.number().default(0).optional(),
  totalCostEmployee: yup.number().default(0).optional(),
  totalCostUnexpected: yup.number().default(0).optional(),
  costGenerals: yup
    .array()
    .of(
      yup.object({
        deposit: yup.number().required('Jumlah harus diisi'),
        employeeId: yup.number().required('Driver harus diisi'),
        carsId: yup.number().required('Mobil harus diisi'),
        salesOrderId: yup.number().required()
      })
    )
    .optional(),
  costEmployees: yup
    .array()
    .of(
      yup.object({
        employeeId: yup.number().required('Karyawan harus dipilih'),
        salary: yup.number().required('Gaji harus diisi'),
        bonus: yup.number().default(0).optional()
      })
    )
    .optional(),
  costUnexpecteds: yup
    .array()
    .of(
      yup.object({
        categoryId: yup.number().required('ID kategori biaya tidak terduga harus diisi'),
        description: yup.string().required('Deskripsi harus diisi'),
        price: yup.number().required('Jumlah harus diisi')
      })
    )
    .optional()
})

export default function DailyCostForm({ mode = 'ADD', selectedDate, initialData = null }) {
  const router = useRouter()
  const dispatch = useDispatch()

  const { detailDailyCost, loadingDetailDailyCost } = useSelector(state => state.dailyCost)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with default values
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: selectedDate,
      notes: '',
      status: 'APPROVED',
      grandTotal: 0,
      totalCostGeneral: 0,
      totalCostEmployee: 0,
      totalCostUnexpected: 0,
      costGenerals: [],
      costEmployees: [],
      costUnexpecteds: []
    }
  })

  const formattedDate = dayjs(selectedDate).format('dddd, D MMMM YYYY')

  useEffect(() => {
    if (mode === 'EDIT' && detailDailyCost && !loadingDetailDailyCost) {
      const formattedData = {
        ...detailDailyCost,
        costGenerals: detailDailyCost.costGenerals?.map(item => ({
          salesOrderId: item.salesOrderId,
          deposit: item.depositBalance,
          employeeId: item.driverId,
          carsId: item.carsId,
          emoney: item.eMoneyBalance,
          lastEmoneyBalance: item.latestEMoneyBalance,
          remainingEmoney: item.remainingEMoneyBalance,
          tollCost: item.tollCost,
          fuelCost: item.fuelCost,
          travelMoney: item.transportAllowance,
          remainingDeposit: item.remainingDepositBalance
        })),
        costEmployees: detailDailyCost.costEmployees,
        costUnexpecteds: detailDailyCost.costUnexpecteds
      }

      methods.reset(formattedData)
    }
  }, [detailDailyCost, loadingDetailDailyCost])

  // Form submission handler
  const handleSubmit = methods.handleSubmit(async data => {
    let costGenerals = []
    let costEmployees = []
    let costUnexpecteds = []

    let totalCostGeneral = 0
    let totalCostEmployee = 0
    let totalCostUnexpected = 0

    // COST GENERAL
    if (data.costGenerals) {
      data.costGenerals.forEach(item => {
        const tollCost = +item?.tollCost || 0
        const fuelCost = +item?.fuelCost || 0
        const travelMoney = +item?.travelMoney || 0
        totalCostGeneral += tollCost + fuelCost + travelMoney
        costGenerals.push({
          salesOrderId: +item.salesOrderId,
          depositBalance: +item?.deposit || 0,
          driverId: +item?.employeeId,
          carsId: +item?.carsId,
          eMoneyBalance: +item?.eMoney || 0,
          latestEMoneyBalance: +item?.remainingEmoney || 0,
          remainingEMoneyBalance: +item?.remainingEmoney || 0,
          tollCost: +item?.tollCost || 0,
          fuelCost: +item?.fuelCost || 0,
          transportAllowance: +item?.travelMoney || 0,
          remainingDepositBalance: +item?.remainingDeposit || 0
        })
      })
    }

    // COST EMPLOYEE
    if (data.costEmployees) {
      data.costEmployees.forEach(item => {
        const salary = +item?.salary || 0
        const bonus = +item?.bonus || 0
        totalCostEmployee += salary + bonus
        costEmployees.push({
          employeeId: +item.employeeId,
          employeeName: item.employeeName,
          salary: +item?.salary || 0,
          bonus: +item?.bonus || 0
        })
      })
    }

    // COST UNEXPECTED
    if (data.costUnexpecteds) {
      data.costUnexpecteds.forEach(item => {
        const price = +item?.price || 0
        totalCostUnexpected += price
        costUnexpecteds.push({
          categoryId: +item.categoryId,
          description: item.description,
          price: +item?.price || 0
        })
      })
    }

    const sendData = {
      date: selectedDate,
      notes: data.notes,
      status: data.status,
      grandTotal: totalCostGeneral + totalCostEmployee + totalCostUnexpected,
      totalCostGeneral,
      totalCostEmployee,
      totalCostUnexpected,
      costGenerals,
      costEmployees,
      costUnexpecteds
    }

    setIsSubmitting(true)
    if (mode === 'ADD') {
      dispatch(addDailyCost({ data: sendData, setIsSubmitting, router }))
    } else if (mode === 'EDIT') {
      dispatch(updateDailyCost({ date: selectedDate, data: sendData, setIsSubmitting, router }))
    }
  })

  // Handle cancel and return to calendar
  const handleCancel = () => {
    router.push('/daily-cost-calendar')
  }

  useEffect(() => {
    if (mode === 'EDIT' && selectedDate) {
      dispatch(fetchDetailDailyCostByDate({ date: selectedDate }))
    }
  }, [])

  return (
    <FormProvider {...methods}>
      <Box sx={{ mb: 6 }}>
        <ButtonBack
          name={(mode === 'ADD' ? 'Add' : mode === 'EDIT' ? 'Edit' : 'View') + ' Daily Cost | ' + formattedDate}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <GeneralCostAndDeposit readOnly={mode === 'view'} />
          </Grid>
          <Grid item xs={12}>
            <EmployeeCostAndBonus readOnly={mode === 'view'} />
          </Grid>
          <Grid item xs={12}>
            <UnexpectedCost readOnly={mode === 'view'} />
          </Grid>
          <Grid item xs={12}>
            <SummaryCost />
          </Grid>

          {mode !== 'view' && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant='outlined' onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <Icon icon='tabler:loader' className='animate-spin' /> : null}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </form>
    </FormProvider>
  )
}
