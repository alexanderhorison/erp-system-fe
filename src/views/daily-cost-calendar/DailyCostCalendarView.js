import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
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
import { deleteDailyCost, fetchAllDailyCost, saveFilterMonthYear } from "src/store/apps/daily-cost";

// ** Shared Components
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

dayjs.locale("id");

export default function DailyCostCalendarView({ }) {
  const router = useRouter();
  const now = dayjs();
  const dispatch = useDispatch();
  const { allDailyCost: expenses, month: dailyCostMonth, year: dailyCostYear } = useSelector((state) => state.dailyCost)

  const { loadingDelete } = useSelector((state) => state.dailyCost)

  const { control, watch } = useForm({
    defaultValues: {
      month: dailyCostMonth,
      year: dailyCostYear,
    },
  });
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModalCalendar, setOpenModalCalendar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const open = Boolean(anchorEl);

  const selectedMonth = watch("month");
  const selectedYear = watch("year");

  const expensesByDate = useMemo(() => {
    const grouped = {};
    expenses.forEach((expense) => {
      const date = dayjs(expense.date).format("YYYY-MM-DD");
      if (!grouped[date]) grouped[date] = {
        grandTotal: 0,
      };
      grouped[date] = {
        ...expense,
        grandTotal: grouped[date].grandTotal + expense.grandTotal,
      };
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
      setOpenConfirmDelete(true);
    }
  };

  // ** Confirmation is owned by `ConfirmDialog`; the thunk performs the request
  // without prompting again (see docs/REVAMP_BASELINE.md §4).
  const handleConfirmDelete = () => {
    dispatch(deleteDailyCost({ date: selectedDate }));
    setOpenConfirmDelete(false);
  };

  useEffect(() => {
    dispatch(saveFilterMonthYear({ month: selectedMonth, year: selectedYear }));
  }, [selectedMonth, selectedYear]);

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
      const isEmpty = expensesByDate[dateStr]?.status === "EMPTY";
      // Check if this date is today
      const isToday = dateStr === today;
      const isLastColumn = (i + 1) % 7 === 0;
      const isLastRow = i >= totalBoxes - 7;

      calendar.push(
        <Box
          key={i}
          onClick={(event) => {
            if (i >= startDay && !isFuture) {
              handleDateClick(event, dateStr, isFuture);
            }
          }}
          className="date-card"
          sx={{
            height: 84,
            p: 2,
            position: 'relative',
            cursor: i >= startDay && !isFuture ? 'pointer' : 'default',
            borderRight: isLastColumn ? 'none' : `1px solid ${colors.border}`,
            borderBottom: isLastRow ? 'none' : `1px solid ${colors.border}`
          }}
        >
          {isEmpty && !isToday && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: statusTokens.warning.fg
              }}
            />
          )}
          {i >= startDay && !isFuture && (
            <Icon
              icon='tabler:dots-vertical'
              fontSize='1rem'
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                color: colors.mutedForeground
              }}
            />
          )}
          {i >= startDay && (
            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
              {isToday ? (
                <Box
                  component='span'
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: stone[800],
                    color: colors.primaryForeground,
                    fontWeight: 600
                  }}
                >
                  {dayNumber}
                </Box>
              ) : (
                dayNumber
              )}
            </Typography>
          )}
          {i >= startDay && expensesByDate[dateStr] && (
            <Typography
              sx={{
                mt: 2,
                fontSize: '0.75rem',
                fontWeight: 500,
                color: colors.foreground
              }}
            >
              {expensesByDate[dateStr]?.status === 'APPROVED' &&
                priceFormatWIthCurrency(expensesByDate[dateStr]?.grandTotal)}
              {expensesByDate[dateStr]?.status === 'EMPTY' &&
                `Jumlah SO: ${expensesByDate[dateStr]?.totalSo}`}
            </Typography>
          )}
        </Box>
      );
    }

    return calendar;
  };

  useEffect(() => {
    if (selectedMonth !== undefined && selectedYear) {
      const formattedDate = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).format('YYYY-MM-DD');
      dispatch(fetchAllDailyCost({ date: formattedDate }));
    }
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <Box
        sx={{
          p: 4,
          borderRadius: `${radii.lg}px`,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.xs,
          backgroundColor: colors.background
        }}
      >
        <Box display="flex" gap={2} mb={4} justifyContent={"space-between"} flexWrap="wrap">
          <Box display="flex" gap={2}>
            <FormControl size='small'>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    sx={{ borderRadius: `${radii.full}px`, minWidth: 140 }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <MenuItem key={i} value={i}>
                        {dayjs().month(i).format("MMMM")}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl size='small'>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    sx={{ borderRadius: `${radii.full}px`, minWidth: 100 }}
                  >
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
            <IconButton
              onClick={() => setOpenModalSetting(true)}
              sx={{
                borderRadius: `${radii.full}px`,
                border: `1px solid ${colors.border3}`,
                boxShadow: shadows.xs,
                color: colors.foreground
              }}
            >
              <Icon icon='tabler:settings' fontSize='1.125rem' />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: `${radii.md}px`,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${colors.border}` }}>
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, index) => (
              <Typography
                key={day}
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: colors.foreground,
                  p: 2,
                  borderRight: index === 6 ? 'none' : `1px solid ${colors.border}`
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{renderDays()}</Box>
        </Box>
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
            <Paper
              sx={{
                mt: 1,
                width: 180,
                borderRadius: `${radii.lg}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.lg
              }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <List sx={{ p: 1 }}>
                  {expensesByDate[selectedDate]?.status !== "APPROVED" && (
                    <ListItem
                      onClick={() => handleAction('ADD')}
                      sx={{
                        borderRadius: `${radii.md}px`,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: stone[50]
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: colors.mutedForeground }}>
                        <Icon icon="tabler:plus" fontSize='1.125rem' />
                      </ListItemIcon>
                      <ListItemText primary="Add" primaryTypographyProps={{ fontSize: '0.875rem', color: colors.foreground }} />
                    </ListItem>
                  )}
                  {expensesByDate[selectedDate]?.status === "APPROVED" && (
                    <ListItem
                      onClick={() => handleAction('VIEW')}
                      sx={{
                        borderRadius: `${radii.md}px`,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: stone[50]
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: colors.mutedForeground }}>
                        <Icon icon="tabler:eye" fontSize='1.125rem' />
                      </ListItemIcon>
                      <ListItemText primary="View" primaryTypographyProps={{ fontSize: '0.875rem', color: colors.foreground }} />
                    </ListItem>
                  )}
                  {
                    expensesByDate[selectedDate]?.status === "APPROVED" && (
                      <ListItem
                        onClick={() => handleAction('EDIT')}
                        sx={{
                          borderRadius: `${radii.md}px`,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: stone[50]
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: colors.mutedForeground }}>
                          <Icon icon="tabler:edit" fontSize='1.125rem' />
                        </ListItemIcon>
                        <ListItemText primary="Edit" primaryTypographyProps={{ fontSize: '0.875rem', color: colors.foreground }} />
                      </ListItem>
                    )
                  }
                  {
                    expensesByDate[selectedDate]?.status === "APPROVED" && (
                      <ListItem
                        onClick={() => handleAction('DELETE')}
                        sx={{
                          borderRadius: `${radii.md}px`,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: statusTokens.danger.bg
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: colors.destructive }}>
                          <Icon icon="tabler:trash" fontSize='1.125rem' />
                        </ListItemIcon>
                        <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: '0.875rem', color: colors.destructive }} />
                      </ListItem>
                    )
                  }
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
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title='Hapus Daily Cost'
        itemName={selectedDate ? dayjs(selectedDate).format('DD MMMM YYYY') : undefined}
        loading={loadingDelete}
      />
    </>
  );
}