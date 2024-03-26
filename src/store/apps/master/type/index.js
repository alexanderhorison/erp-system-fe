import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchMasterDataType = createAsyncThunk('appMasterType/fetchData', async params => {
  const response = await axios.get('http://localhost:5000/master/type/all', {
    params
  })

  return response.data
})

export const addMasterDataPorduct = createAsyncThunk('appMasterType/addType', async (data, { getState, dispatch }) => {
  console.log(data)
  const response = await axios({
    method: 'post',
    url: process.env.REACT_APP_BASE_URL + 'master/type/',
    headers: {},
    data: {
      foo: 'bar' // This is the body part
    }
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete Type
export const deleteMasterDataType = createAsyncThunk('appType/deleteType', async (id, { getState, dispatch }) => {
  const response = await axios.delete(`http://localhost:5000/master/type/${id}`)
  dispatch(fetchData(getState().user.params))
  toast.success('Successfully toasted!')

  return response.data
})

export const appMasterTypeSlice = createSlice({
  name: 'appMasterType',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMasterDataType.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appMasterTypeSlice.reducer
