import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { priceFormatWIthCurrency } from "src/helpers/priceFormatter";
import Icon from 'src/@core/components/icon'
import "dayjs/locale/id";
import SettingDailyCost from "./SettingDailyCost";
import ModalActionCalendar from "./ModalActionCalendar";
dayjs.locale("id");

export default function DailyCostCalendarView({ expenses }) {
  const now = dayjs();
  const { control, watch } = useForm({
    defaultValues: {
      month: now.month(),
      year: now.year(),
    },
  });
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModalCalendar, setOpenModalCalendar] = useState(false);

  const selectedMonth = watch("month");
  const selectedYear = watch("year");

  // Group expenses by date
  const expensesByDate = useMemo(() => {
    const grouped = {};
    expenses.forEach((expense) => {
      const date = dayjs(expense.date).format("YYYY-MM-DD");
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += expense.amount;
    });
    return grouped;
  }, [expenses]);

  const daysInMonth = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).daysInMonth();
  const startDay = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).day(); // 0 = Sunday

  const renderDays = () => {
    const calendar = [];
    const totalBoxes = startDay + daysInMonth;

    for (let i = 0; i < totalBoxes; i++) {
      const dayNumber = i - startDay + 1;
      const date = dayjs(`${selectedYear}-${selectedMonth + 1}-${dayNumber}`)
      const dateStr = date.format("YYYY-MM-DD");
      const isFuture = date.isAfter(now, 'day');

      calendar.push(
        <Grid item xs={12 / 7} key={i}>
          <Box
            onClick={() => {
              if (i >= startDay && !isFuture) {
                setSelectedDate(dateStr);
                setOpenModalCalendar(true);
              }
            }}
            sx={{ cursor: i >= startDay && !isFuture ? "pointer" : "default" }}
          >
            <Card sx={{ height: 80, backgroundColor: "#f5f5f5" }}>
              <CardContent sx={{ p: 1 }}>
                {i >= startDay && (
                  <>
                    <Typography variant="subtitle2">
                      {dayjs(dateStr).format("dddd")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {dayNumber}
                    </Typography>
                  </>
                )}
                {i >= startDay && expensesByDate[dateStr] && (
                  <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                    {priceFormatWIthCurrency(expensesByDate[dateStr])}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      );
    }

    return calendar;
  };

  return (
    <>
      <Box>
        {/* Filters */}
        <Box display="flex" gap={2} mb={2} justifyContent={"space-between"}>
          {/* Month Controller */}
          <Box display="flex" gap={2}>

            <FormControl>
              <InputLabel id="month-label">Month</InputLabel>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="month-label" label="Month">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <MenuItem key={i} value={i}>
                        {dayjs().month(i).format("MMMM")}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Year Controller */}
            <FormControl>
              <InputLabel id="year-label">Year</InputLabel>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="year-label" label="Year">
                    {Array.from({ length: now.year() - 2025 + 6 }, (_, i) => {
                      const year = 2025 + i;
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpenModalSetting(true)}>
              <Icon icon='tabler:settings' />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Grid container spacing={1}>
          {renderDays()}
        </Grid>
      </Box>
      {openModalSetting && (
        <SettingDailyCost
          open={openModalSetting}
          onClose={() => setOpenModalSetting(false)}
        />)
      }
      {openModalCalendar && (
        <ModalActionCalendar
          open={openModalCalendar}
          onClose={() => setOpenModalCalendar(false)}
          selectedDate={selectedDate}
          expensesByDate={expensesByDate}
        />
      )
      }
    </>
  );
}