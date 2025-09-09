import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalConfirmationDelete, swalError, swalToastError } from 'src/helpers/swalFunction'

const label = 'karyawan'

// GET ALL EMPLOYEE
export const fetchMasterDataEmployee = createAsyncThunk(
  'appMasterEmployee/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/employee/all',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL EMPLOYEE
export const fetchMasterDataEmployeeDetail = createAsyncThunk(
  'appMasterEmployee/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/employee/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD EMPLOYEE
export const addMasterDataEmployee = createAsyncThunk(
  'appMasterEmployee/addEmployee',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Karyawan',
        name: 'Karyawan',
        title: 'Anda akan menambahkan karyawan?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/master/employee/create',
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataEmployee())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT EMPLOYEE
export const editMasterDataEmployee = createAsyncThunk(
  'appMasterEmployee/editEmployee',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Karyawan',
        name: 'Karyawan',
        title: 'Anda akan mengubah karyawan?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/master/employee/' + id,
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataEmployee())
          dispatch(fetchMasterDataEmployeeDetail(id))
        }
      })
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE EMPLOYEE
export const deleteMasterDataEmployee = createAsyncThunk(
  'appEmployee/deleteEmployee',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/employee/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataEmployee())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DEBT TRANSACTION EMPLOYEE
export const fetchEmployeeDebt = createAsyncThunk(
  'appMasterEmployee/fetchEmployeeDebt',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/employee/debt/' + id,
        params
      })
      return response?.data || []
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// POST DEBT TRANSACTION EMPLOYEE
export const fetchAddEmployeeDebt = createAsyncThunk(
  'appMasterEmployee/fetchAddEmployeeDebt',
  async ({ id, data, setOpen, type }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Kasbon',
        name: 'Kasbon',
        title: `Anda akan menambahkan ${type === 'PEMINJAMAN' ? 'peminjaman' : 'pembayaran'} kasbon?`,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/master/employee/debt/' + id,
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchEmployeeDebt({ id }))
          dispatch(fetchMasterDataEmployeeDetail(id))
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// DELETE DEBT TRANSACTION EMPLOYEE
export const deleteEmployeeDebt = createAsyncThunk(
  'appMasterEmployee/deleteEmployeeDebt',
  async ({ id, employeeId, date }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label: 'Kasbon',
        name: 'Kasbon',
        title: `Anda akan menghapus kasbon tanggal ${date}?`,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/employee/debt/' + id
          })
        },
        dispatchRequest: () => {
          dispatch(fetchEmployeeDebt({ id: employeeId }))
          dispatch(fetchMasterDataEmployeeDetail(employeeId))
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER EMPLOYEE
export const appMasterEmployeeSlice = createSlice({
  name: 'appMasterEmployee',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      nama: '',
      phone: '',
      address: '',
      dob: null,
      sex: '',
      role: '',
      status: '',
      salary: '',
      bonus: '',
      is_active: true
    },
    defaultValue: {
      id: '',
      nama: '',
      phone: '',
      address: '',
      dob: null,
      sex: 'Laki-laki',
      role: '',
      status: '',
      salary: '',
      bonus: '',
      is_active: true
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: [],

    employeeDebt: [],
    loadingEmployeeDebt: false,
    errorEmployeeDebt: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataEmployee.pending, state => {
        state.loading = true
      })
      .addCase(fetchMasterDataEmployee.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataEmployeeDetail.pending, state => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataEmployeeDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataEmployeeDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })

      .addCase(fetchEmployeeDebt.pending, state => {
        state.loadingEmployeeDebt = true
      })
      .addCase(fetchEmployeeDebt.fulfilled, (state, action) => {
        state.employeeDebt = action.payload.data
        state.loadingEmployeeDebt = false
        state.errorEmployeeDebt = false
      })
      .addCase(fetchEmployeeDebt.rejected, (state, action) => {
        state.loadingEmployeeDebt = false
        state.errorEmployeeDebt = action.error.message
      })
  }
})

export default appMasterEmployeeSlice.reducer
