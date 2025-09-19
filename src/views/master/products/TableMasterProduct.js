import { Box, Card, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import TableHeaderMasterProduct from './TableHeaderMasterProduct'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import {
  deleteMasterDataProduct,
  fetchMasterDataProduct,
  fetchMasterDataProductDetail
} from 'src/store/apps/master/product'
import ModalAddMasterProduct from './ModalAddMasterProduct'
import { useRouter } from 'next/router'
import { fetchMasterDataType } from 'src/store/apps/master/type'
import { fetchDataMasterCategory } from 'src/store/apps/master/category'
import FilterProduct from 'src/pages/components/filter/FilterProduct'
import { fetchMasterDataCompany } from 'src/store/apps/master/company'

const RowOptions = ({ id, name }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleDelete = () => {
    dispatch(deleteMasterDataProduct({ id, name }))
  }

  const handleEdit = () => {
    dispatch(fetchMasterDataProductDetail(id))
    setOpenModalEdit(true)
  }

  const handlePageTransformation = () => {
    router.push(`/master/products/${id}`)
  }

  return (
    <>
      {openModalEdit && (
        <ModalAddMasterProduct open={openModalEdit} setOpen={setOpenModalEdit} typeModal={'EDIT'} id={id} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: -3 }}>
        <IconButton onClick={handlePageTransformation}>
          <Icon icon='tabler:eye' />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    </>
  )
}

const defaultFilter = {
  categoryId: '',
  typeId: '',
  companyId: ''
}

export default function TableMasterProduct({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [openModalAdd, setOpenModalAdd] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  // Combined filters including sorting (like Sales Order)
  const [filters, setFilters] = useState({
    orderBy: 'name',
    orderType: 'ASC'
  })

  const { data, loading, pagination } = useSelector(state => state.masterProduct)
  const { data: categoryData } = useSelector(state => state.category)
  const { data: typeData } = useSelector(state => state.type)
  const { data: companyData } = useSelector(state => state.company)

  const [filterInput, setFilterInput] = useState(defaultFilter)

  // Debounced search function with proper cleanup
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      const fn = (searchValue) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          // Reset to page 1 when searching
          setPaginationModel(prev => ({ ...prev, page: 0 }))

          const params = {
            search: searchValue,
            page: 1,
            limit: paginationModel.pageSize,
            orderBy: filters.orderBy,
            orderType: filters.orderType,
            ...filterInput
          }

          dispatch(fetchMasterDataProduct(params))
        }, 500)
      }

      // Add cancel function to clear timeout
      fn.cancel = () => {
        clearTimeout(timeoutId)
      }

      return fn
    })(),
    [dispatch, paginationModel.pageSize, filters, filterInput]
  )

  const handleSearch = searchValue => {
    setSearchText(searchValue)

    if (searchValue === '') {
      // Cancel any pending debounced search
      debouncedSearch.cancel()

      // Reset pagination first
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      // Clear search immediately
      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        orderBy: filters.orderBy,
        orderType: filters.orderType,
        ...filterInput
      }
      dispatch(fetchMasterDataProduct(params))
    } else {
      debouncedSearch(searchValue)
    }
  }

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    const params = {
      page: newPaginationModel.page + 1, // Backend expects 1-based pagination
      limit: newPaginationModel.pageSize,
      ...(searchText && { search: searchText }),
      orderBy: filters.orderBy,
      orderType: filters.orderType,
      ...filterInput
    }

    dispatch(fetchMasterDataProduct(params))
  }

  // Handle sorting
  const handleSortModelChange = (sortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = field === 'name' ? 'name' :
        field === 'category' ? 'category' :
          field === 'type' ? 'type' :
            field === 'company' ? 'company' : 'name'
      const orderType = sort.toUpperCase()

      setFilters(prev => ({
        ...prev,
        orderBy,
        orderType
      }))

      // Reset to page 1 when sorting
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        ...(searchText && { search: searchText }),
        orderBy,
        orderType,
        ...filterInput
      }

      dispatch(fetchMasterDataProduct(params))
    }
  }

  const updatedUrl = useCallback(
    params => {
      const { categoryId, typeId, companyId } = params
      router.push(
        {
          pathname: router.pathname,
          query: {
            categoryId: categoryId || '',
            typeId: typeId || '',
            companyId: companyId || ''
          }
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  useEffect(() => {
    const query = router.query
    const initialFilter = {
      categoryId: query.categoryId || '',
      typeId: query.typeId || '',
      companyId: query.companyId || ''
    }
    setFilterInput(initialFilter)
    
    const params = {
      page: 1,
      limit: 25,
      orderBy: filters.orderBy,
      orderType: filters.orderType,
      ...initialFilter
    }
    dispatch(fetchMasterDataProduct(params))
    dispatch(fetchMasterDataType())
    dispatch(fetchDataMasterCategory())
    dispatch(fetchMasterDataCompany())
  }, [dispatch, router.query]) // Removed sortFilters dependencies

  const clearAllFilter = useCallback(
    val => {
      setSearchText('')
      setPaginationModel(prev => ({ ...prev, page: 0 }))
      setFilterInput(defaultFilter)
      
      const params = {
        page: 1,
        limit: paginationModel.pageSize,
        orderBy: filters.orderBy,
        orderType: filters.orderType
      }
      dispatch(fetchMasterDataProduct(params))
      
      updatedUrl({
        categoryId: '',
        typeId: '',
        companyId: ''
      })
    },
    [dispatch, updatedUrl, paginationModel.pageSize, filters]
  )

  const submitFilter = useCallback(() => {
    setPaginationModel(prev => ({ ...prev, page: 0 }))
    
    const params = {
      page: 1,
      limit: paginationModel.pageSize,
      ...(searchText && { search: searchText }),
      orderBy: filters.orderBy,
      orderType: filters.orderType,
      ...filterInput
    }
    
    if (filterInput.categoryId || filterInput.typeId || filterInput.companyId) {
      updatedUrl({
        categoryId: filterInput.categoryId,
        typeId: filterInput.typeId,
        companyId: filterInput.companyId
      })
    }
    
    dispatch(fetchMasterDataProduct(params))
  }, [dispatch, filterInput, updatedUrl, paginationModel.pageSize, searchText, filters])

  const handleFilterInput = useCallback(
    e => {
      const { value, name } = e.target
      setFilterInput({ ...filterInput, [name]: value })
    },
    [filterInput]
  )

  return (
    <Card>
      {openModalAdd && <ModalAddMasterProduct open={openModalAdd} setOpen={setOpenModalAdd} typeModal={'ADD'} />}
      <CardHeader title='Pencarian' />
      <FilterProduct
        filterInput={filterInput}
        handleFilterInput={handleFilterInput}
        clearAllFilter={clearAllFilter}
        submitFilter={submitFilter}
        category={categoryData}
        type={typeData}
        company={companyData}
      />
      <Divider sx={{ marginBottom: '1rem' }} />
      <DataGrid
        autoHeight
        loading={loading}
        rows={data || []}
        rowCount={pagination?.total || 0}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortModelChange}
        columns={[
          {
            flex: 0.2,
            minWidth: 200,
            field: 'name',
            headerName: 'Nama Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.name}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'category',
            headerName: 'Kategori',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.category}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'type',
            headerName: 'Tipe',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.type}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'company',
            headerName: 'Perusahaan',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.company}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 110,
            field: 'description',
            headerName: 'Dekripsi Produk',
            renderCell: params => {
              return (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {params.row.description || '-'}
                </Typography>
              )
            }
          },
          {
            flex: 0.1,
            minWidth: 120,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => <RowOptions id={row.id} name={row.name} />
          }
        ]}
        pageSizeOptions={[5, 10, 25, 50]}
        slots={{ toolbar: TableHeaderMasterProduct }}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            placeholder: 'Cari produk, kategori atau tipe',
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            openModalAdd: setOpenModalAdd
          }
        }}
      />
    </Card>
  )
}
