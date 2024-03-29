import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'src/configs/axios'

export const fetchMasterDataUnit = createAsyncThunk('appMasterUnit/fetchData', async params => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/unit/all'
    })
    return response.data
  } catch (error) {
    toast.error(error.response.data.message)
  }
})

export const fetchMasterDataUnitDetail = createAsyncThunk('appMasterUnit/fetchDataDetail', async id => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/unit/' + id
    })
    return response.data
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
})

// ADD UNIT
export const addMasterDataUnit = createAsyncThunk('appMasterUnit/addUnit', async (data, { getState, dispatch }) => {
  try {
    await axios({
      method: 'post',
      url: '/master/unit/create',
      headers: {},
      data
    })
    dispatch(fetchMasterDataUnit())
    toast.success('Sukses Menambahkan Unit')
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
})

// EDIT UNIT
export const editMasterDataUnit = createAsyncThunk(
  'appMasterUnit/editUnit',
  async ({ id, data }, { getState, dispatch }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/unit/' + id,
        data: data
      })
      dispatch(fetchMasterDataUnit())
      toast.success('Sukses Merubah Unit')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
)

// DELETE UNIT
export const deleteMasterDataUnit = createAsyncThunk('appUnit/deleteUnit', async (id, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: '/master/unit/' + id
    })
    dispatch(fetchMasterDataUnit())
    toast.success('Sukses Menghapus Unit')
    return response.data
  } catch (error) {
    toast.error(error.response.data.message)
  }
})

export const appMasterUnitSlice = createSlice({
  name: 'appMasterUnit',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: ''
    },
    defaultValue: {
      id: '',
      name: '',
      description: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataUnit.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataUnit.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataUnit.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataUnitDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataUnitDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataUnitDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterUnitSlice.reducer
