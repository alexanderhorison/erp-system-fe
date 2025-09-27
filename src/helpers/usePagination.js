import { useState, useCallback, useRef } from 'react'

export const usePagination = (
  fetchDataAction,
  dispatch,
  initialFilters = { orderBy: 'createdAt', orderType: 'DESC' },
  initialPaginationModel = { page: 0, pageSize: 10 }
) => {
  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState(initialPaginationModel)
  const [filters, setFilters] = useState(initialFilters)

  // Use refs to track current values without causing re-renders
  const searchTextRef = useRef(searchText)
  const paginationModelRef = useRef(paginationModel)
  const filtersRef = useRef(filters)

  // Update refs when state changes
  searchTextRef.current = searchText
  paginationModelRef.current = paginationModel
  filtersRef.current = filters

  // Centralized fetch function to avoid duplication
  const fetchData = useCallback(
    (
      customParams = {},
      currentSearchText,
      currentFilters,
      currentPaginationModel
    ) => {
      // Use current refs if parameters not provided
      const activeSearchText = currentSearchText !== undefined ? currentSearchText : searchTextRef.current
      const activeFilters = currentFilters || filtersRef.current
      const activePaginationModel = currentPaginationModel || paginationModelRef.current

      // Build base params
      const baseParams = {
        page: 1,
        limit: activePaginationModel.pageSize,
        paginate: true
      }

      // Add search if exists
      if (activeSearchText) {
        baseParams.search = activeSearchText
      }

      // Add filters - include orderBy and orderType, exclude empty values
      Object.keys(activeFilters).forEach(key => {
        const value = activeFilters[key]
        if (value !== '' && value !== null && value !== undefined) {
          baseParams[key] = value
        }
      })

      // Merge with custom params (which may override filters)
      const params = {
        ...baseParams,
        ...customParams
      }

      dispatch(fetchDataAction(params))
    },
    [dispatch, fetchDataAction]
  )

  // Debounced search function with proper cleanup
  const timeoutRef = useRef()

  const debouncedSearch = useCallback((searchValue) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      // Reset to page 1 when searching
      setPaginationModel(prev => ({ ...prev, page: 0 }))
      fetchData({ search: searchValue, page: 1 }, searchValue)
    }, 500)
  }, [fetchData])

  const cancelDebouncedSearch = useCallback(() => {
    clearTimeout(timeoutRef.current)
  }, [])

  const handleSearch = useCallback((searchValue) => {
    setSearchText(searchValue)

    if (searchValue === '') {
      // Cancel any pending debounced search
      cancelDebouncedSearch()

      // Reset pagination first
      setPaginationModel(prev => ({ ...prev, page: 0 }))

      // Clear search immediately - use refs for current values
      fetchData({ page: 1 }, '')
    } else {
      debouncedSearch(searchValue)
    }
  }, [fetchData, debouncedSearch, cancelDebouncedSearch])

  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPaginationModel(newPaginationModel)

    fetchData(
      {
        page: newPaginationModel.page + 1, // Backend expects 1-based pagination
        limit: newPaginationModel.pageSize
      },
      searchTextRef.current,
      filtersRef.current,
      newPaginationModel
    )
  }, [fetchData])

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value, customFilterParams = null) => {
    // Create new filters, but remove empty values to avoid backend validation errors
    const currentFilters = filtersRef.current
    const newFilters = { ...currentFilters }

    if (value === '' || value === null || value === undefined) {
      // Remove the filter if value is empty
      delete newFilters[filterType]
    } else {
      // Set the filter value
      newFilters[filterType] = value
    }

    setFilters(newFilters)

    // Reset to page 1 when filtering
    setPaginationModel(prev => ({ ...prev, page: 0 }))

    // Use custom filter params if provided, otherwise use the new filters
    const filterParams = customFilterParams || newFilters

    fetchData(
      {
        page: 1,
        ...filterParams
      },
      searchTextRef.current,
      newFilters
    )
  }, [fetchData])

  // Handle sorting
  const handleSortModelChange = useCallback((sortModel, allowedOrderBy = []) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      const orderBy = allowedOrderBy.includes(field) ? field : (allowedOrderBy[0] || 'createdAt')
      const orderType = sort.toUpperCase()

      const newFilters = {
        ...filtersRef.current,
        orderBy,
        orderType
      }

      setFilters(newFilters)

      fetchData(
        {
          page: 1,
          orderBy,
          orderType
        },
        searchTextRef.current,
        newFilters
      )
    }
  }, [fetchData])

  // Initial fetch function - use refs to avoid dependency issues
  const initialFiltersRef = useRef(initialFilters)
  const initialPaginationModelRef = useRef(initialPaginationModel)

  const initialFetch = useCallback((customParams = {}) => {
    const params = {
      page: 1,
      limit: initialPaginationModelRef.current.pageSize,
      ...initialFiltersRef.current,
      paginate: true,
      ...customParams
    }
    dispatch(fetchDataAction(params))
  }, [dispatch, fetchDataAction])

  return {
    // State
    searchText,
    paginationModel,
    filters,
    setSearchText,
    setPaginationModel,
    setFilters,

    // Handlers
    handleSearch,
    handlePaginationChange,
    handleFilterChange,
    handleSortModelChange,

    // Utility functions
    fetchData,
    initialFetch
  }
}

export const createFilterParams = (filterType, value) => {
  switch (filterType) {
    case 'boolean':
      return value !== '' ? { status: value === 'true' } : {}
    case 'status':
      return value !== '' ? { status: value } : {}
    default:
      return value !== '' ? { [filterType]: value } : {}
  }
}