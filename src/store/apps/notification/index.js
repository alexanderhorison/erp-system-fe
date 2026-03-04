import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'

// GET PENDING COUNTS (once on load)
export const fetchNotificationCounts = createAsyncThunk(
  'notification/fetchNotificationCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({ method: 'GET', url: '/notification' })
      return response.data
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

const initialState = {
  pendingCounts: {},
  loading: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotificationCounts.pending, state => {
        state.loading = true
      })
      .addCase(fetchNotificationCounts.fulfilled, (state, action) => {
        state.loading = false
        state.pendingCounts = action.payload?.data ?? {}
      })
      .addCase(fetchNotificationCounts.rejected, state => {
        state.loading = false
        state.pendingCounts = {}
      })
  }
})

export default notificationSlice.reducer
