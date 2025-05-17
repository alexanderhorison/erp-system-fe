import React, { useEffect, useMemo, useState } from "react";
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
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { priceFormatWIthCurrency } from "src/helpers/priceFormatter";
import Icon from 'src/@core/components/icon'
import "dayjs/locale/id";
import SettingDailyCost from "./SettingDailyCost";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { deleteDailyCost, fetchAllDailyCost } from "src/store/apps/daily-cost";
import { date } from "yup";
dayjs.locale("id");

export default function DailyCostCalendarView({ }) {
  const router = useRouter();
  const now = dayjs();
  const dispatch = useDispatch();
  const { control, watch } = useForm({
    defaultValues: {
      month: now.month(),
      year: now.year(),
    },
  });
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModalCalendar, setOpenModalCalendar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { allDailyCost: expenses } = useSelector((state) => state.dailyCost)

  const selectedMonth = watch("month");
  const selectedYear = watch("year");

  const expensesByDate = useMemo(() => {
    const grouped = {};
    expenses.forEach((expense) => {
      const date = dayjs(expense.date).format("YYYY-MM-DD");
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += expense.grandTotal;
    });
    return grouped;
  }, [expenses]);

  const daysInMonth = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).daysInMonth();
  const startDay = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).day();

  const handleDateClick = (event, dateStr, isFuture) => {
    if (isFuture) return;

    // Check if clicking the same date - toggle behavior
    if (selectedDate === dateStr && anchorEl) {
      // Close the popper if it's the same date
      setAnchorEl(null);
    } else {
      // Set new date and anchor if different date
      setSelectedDate(dateStr);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClickAway = (event) => {
    if (!event.target.closest('.date-card')) {
      setAnchorEl(null);
    }
  };

  const handleAction = (action) => {
    setAnchorEl(null);
    const formattedDate = dayjs(selectedDate).format('DD-MM-YYYY');
    if (action === 'VIEW') {
      router.push(`/daily-cost-calendar/view/${formattedDate}`);
    } else if (action === 'ADD') {
      router.push(`/daily-cost-calendar/add/${formattedDate}`);
    } else if (action === 'EDIT') {
      router.push(`/daily-cost-calendar/edit/${formattedDate}`);
    } else if (action === 'DELETE') {
      dispatch(deleteDailyCost({ date: selectedDate }))
    }
  };

  const renderDays = () => {
    const calendar = [];
    const totalBoxes = startDay + daysInMonth;

    // Format today's date for comparison
    const today = dayjs().format("YYYY-MM-DD");

    for (let i = 0; i < totalBoxes; i++) {
      const dayNumber = i - startDay + 1;
      const date = dayjs(`${selectedYear}-${selectedMonth + 1}-${dayNumber}`)
      const dateStr = date.format("YYYY-MM-DD");
      const isFuture = date.isAfter(now, 'day');

      // Check if this date is today
      const isToday = dateStr === today;

      calendar.push(
        <Grid item xs={12 / 7} key={i}>
          <Box
            onClick={(event) => {
              if (i >= startDay && !isFuture) {
                handleDateClick(event, dateStr, isFuture);
              }
            }}
            sx={{ cursor: i >= startDay && !isFuture ? "pointer" : "default" }}
            className="date-card"
          >
            <Card sx={{
              height: 80,
              backgroundColor: isToday ? "#e3f2fd" : "#f5f5f5",
              border: isToday ? "1px solid #2196f3" : "none",
              position: "relative"
            }}>
              {isToday && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2196f3"
                  }}
                />
              )}
              <CardContent sx={{ p: 1 }}>
                {i >= startDay && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? "#2196f3" : "text.primary"
                      }}
                    >
                      {dayjs(dateStr).format("dddd")}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? "#2196f3" : "text.primary"
                      }}
                    >
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

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(fetchAllDailyCost({ date: `${selectedMonth + 1}-01-${selectedYear}` }));
    }
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <Box>
        <Box display="flex" gap={2} mb={2} justifyContent={"space-between"}>
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
        <Grid container spacing={1}>
          {renderDays()}
        </Grid>
      </Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        placement="bottom-start"
        modifiers={[
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              boundary: document.body
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
            <Paper elevation={6} sx={{ mt: 1, width: 200 }}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <List sx={{ p: 1 }}>
                  {!expensesByDate[selectedDate] && (
                    <ListItem
                      onClick={() => handleAction('ADD')}
                      sx={{
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon icon="tabler:plus" fontSize={20} />
                      </ListItemIcon>
                      <ListItemText primary="Add" />
                    </ListItem>
                  )}
                  {expensesByDate[selectedDate] && (
                    <ListItem
                      onClick={() => handleAction('VIEW')}
                      sx={{
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon icon="tabler:eye" fontSize={20} />
                      </ListItemIcon>
                      <ListItemText primary="View" />
                    </ListItem>
                  )}
                  <ListItem
                    onClick={() => handleAction('EDIT')}
                    sx={{
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon icon="tabler:edit" fontSize={20} />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                  </ListItem>
                  <ListItem
                    onClick={() => handleAction('DELETE')}
                    sx={{
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon icon="tabler:trash" fontSize={20} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {openModalSetting && (
        <SettingDailyCost
          open={openModalSetting}
          onClose={() => setOpenModalSetting(false)}
        />)
      }
    </>
  );
}