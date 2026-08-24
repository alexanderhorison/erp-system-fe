export const listMenu = [
  {
    title: 'Dashboard',
    icon: 'tabler:home',
    path: '/home',
    menuId: [40, 41, 42, 43],
    children: [
      {
        title: 'Inventory',
        path: '/home',
        icon: 'tabler:building-warehouse',
        menuId: 40
      },
      {
        title: 'Sales Order',
        path: '/dashboards/sales-order',
        icon: 'tabler:shopping-cart',
        menuId: 41
      },
      {
        title: 'Purchase Order',
        path: '/dashboards/purchase-order',
        icon: 'tabler:basket-dollar',
        menuId: 42
      },
      {
        title: 'Finance',
        path: '/dashboards/finance',
        icon: 'tabler:report-money',
        menuId: 43
      }
    ]
  },
  // {
  //   title: 'Point of Sale',
  //   path: '/point-of-sale/',
  //   icon: 'tabler:clipboard-check',
  //   menuId: 27
  // },
  {
    sectionTitle: 'Inventory',
    menuId: [4, 5, 12, 3, 6, 13]
  },
  {
    title: 'Data Inventory',
    icon: 'tabler:database',
    menuId: [4, 5, 12, 3, 6, 13],
    children: [
      {
        title: 'Products',
        path: '/master/products',
        menuId: 5,
        icon: 'tabler:box'
      },
      {
        title: 'Product Types',
        path: '/master/types',
        menuId: 4,
        icon: 'tabler:packages'
      },
      {
        title: 'Product Units',
        path: '/master/units',
        menuId: 12,
        icon: 'tabler:ruler'
      },
      {
        title: 'Product Categories',
        path: '/master/categories',
        menuId: 3,
        icon: 'tabler:tags'
      },
      {
        title: 'Warehouses',
        path: '/master/warehouses',
        menuId: 6,
        icon: 'tabler:building-warehouse'
      },
      {
        title: 'Company',
        path: '/master/company',
        menuId: 13,
        icon: 'tabler:building'
      }
    ]
  },
  {
    title: 'Stock Management',
    icon: 'tabler:stack',
    menuId: [8, 9, 16, 17, 18, 26],
    children: [
      {
        title: 'Warehouse Product List',
        path: '/product-warehouse/product',
        menuId: 8,
        icon: 'tabler:boxes'
      },
      {
        title: 'Warehouse Stock Adjustment',
        path: '/product-warehouse/warehouse',
        menuId: 9,
        icon: 'tabler:settings'
      },
      {
        title: 'Goods In',
        path: '/adjustment/goods-in',
        menuId: 16,
        icon: 'tabler:truck'
      },
      {
        title: 'Goods Out',
        path: '/adjustment/goods-out',
        menuId: 17,
        icon: 'tabler:truck-delivery'
      },
      {
        title: 'Internal Transfer',
        path: '/internal-transfer',
        menuId: 18,
        icon: 'tabler:arrow-autofit-left'
      },
      {
        title: 'Deleted Goods',
        path: '/deleted-product-warehouse',
        menuId: 26,
        icon: 'tabler:trash'
      }
    ]
  },
  {
    title: 'Loan Stock',
    path: '/loan-stock/',
    icon: 'tabler:truck-loading',
    menuId: 45
  },
  {
    title: 'Stock Opname',
    path: '/stock-opname/',
    icon: 'tabler:clipboard-check',
    menuId: 15
  },
  {
    title: 'Product Request',
    path: '/product-request/',
    icon: 'tabler:clipboard-text',
    menuId: 44
  },
  {
    title: 'Delivery Order',
    icon: 'tabler:file-invoice',
    menuId: [10, 11, 19],
    children: [
      {
        title: 'Delivery Order',
        path: '/delivery-order',
        menuId: 10,
        icon: 'tabler:file'
      },
      {
        title: 'Delivery Order Receipt',
        path: '/receive-order',
        menuId: 11,
        icon: 'tabler:file-check'
      },
      {
        title: 'Outstanding Products',
        path: '/receipt-order-outstanding',
        menuId: 19,
        icon: 'tabler:alert-circle'
      }
    ]
  },
  {
    sectionTitle: 'Sales Order',
    menuId: [21, 22, 23]
  },
  {
    title: 'Data Customer',
    path: '/master/customer',
    icon: 'tabler:user',
    menuId: [21, 22],
    children: [
      {
        title: 'Customer',
        path: '/master/customer',
        menuId: 21
        // icon: 'tabler:user'
      },
      {
        title: 'Rank',
        path: '/master/rank',
        menuId: 22
        // icon: 'tabler:ranking'
      }
    ]
  },
  {
    title: 'Sales Order',
    icon: 'tabler:shopping-cart',
    menuId: [23],
    children: [
      {
        title: 'Sales Order',
        path: '/sales-order',
        menuId: 23
        // icon: 'tabler:cart'
      }
    ]
  },
  {
    sectionTitle: 'Purchase Order',
    menuId: [24, 25]
  },
  {
    title: 'Data Vendor',
    path: '/master/vendor',
    icon: 'tabler:building-store',
    menudId: [24],
    children: [
      {
        title: 'Vendor',
        path: '/master/vendor',
        menuId: 24
        // icon: 'tabler:building-store'
      }
    ]
  },
  {
    title: 'Purchase Order',
    icon: 'tabler:shopping-bag',
    menuId: [25],
    children: [
      {
        title: 'Purchase Order',
        path: '/purchase-order',
        menuId: 25
        // icon: 'tabler:receipt'
      }
    ]
  },
  {
    sectionTitle: 'Point of Sale',
    menuId: [47]
  },
  {
    title: 'POS Transaction',
    path: '/pos-transaction/',
    icon: 'tabler:building-store',
    menuId: 47
  },
  {
    title: 'Shift',
    path: '/master/shift/',
    icon: 'tabler:clock',
    menuId: 48
  },
  {
    sectionTitle: 'Daily Cost',
    menuId: [29, 31, 32, 33]
  },
  {
    title: 'Master Data',
    path: '/master/car',
    icon: 'tabler:database',
    menudId: [31],
    children: [
      {
        title: 'Vehicles',
        // icon: 'tabler:car',
        path: '/master/car',
        menuId: 31
      },
      {
        title: 'Employees',
        // icon: 'tabler:users',
        path: '/master/employee',
        menuId: 32
      },
      {
        title: 'Unexpected Cost',
        // icon: 'tabler:cash',
        path: '/master/unexpected-cost-category',
        menuId: 29
      }
    ]
  },
  {
    title: 'Daily Cost Calendar',
    path: '/daily-cost-calendar/',
    icon: 'tabler:calendar',
    menuId: 33
  },
  {
    sectionTitle: 'Assets',
    menuId: [34, 35, 36]
  },
  {
    title: 'Monthly Current Assets',
    icon: 'tabler:calendar-month',
    menuId: [34],
    children: [
      {
        title: 'Monthly Current Assets',
        path: '/asset/current',
        menuId: 34,
        icon: 'tabler:circle'
      }
    ]
  },
  {
    title: 'Non-Current Assets',
    icon: 'tabler:calendar-month',
    menuId: [35, 36],
    children: [
      {
        title: 'Master Non-Current Assets',
        path: '/asset/master-non-current',
        menuId: 35,
        icon: 'tabler:circle'
      },
      {
        title: 'Monthly Non-Current Assets',
        path: '/asset/non-current',
        menuId: 36,
        icon: 'tabler:circle'
      }
    ]
  },
  {
    sectionTitle: 'Monthly Liabilities',
    menuId: [37, 38]
  },
  {
    title: 'Monthly Liabilities',
    icon: 'tabler:calendar-month',
    menuId: [37, 38],
    children: [
      {
        title: 'Short Term',
        path: '/liabilities/short-term',
        menuId: 37,
        icon: 'tabler:circle'
      },
      {
        title: 'Long Term',
        path: '/liabilities/long-term',
        menuId: 38,
        icon: 'tabler:circle'
      }
    ]
  },
  {
    sectionTitle: 'Monthly Equity',
    menuId: [39]
  },
  {
    title: 'Monthly Equity',
    icon: 'tabler:calendar-month',
    menuId: [39],
    children: [
      {
        title: 'Equity',
        path: '/equity',
        menuId: 39,
        icon: 'tabler:circle'
      }
    ]
  },
  {
    sectionTitle: 'Report',
    menuId: [30]
  },
  {
    title: 'Report',
    icon: 'tabler:file-report',
    path: '/report/',
    menuId: 30
  },
  {
    sectionTitle: 'Users & Permissions',
    menuId: [1, 2, 28, 45]
  },
  {
    title: 'Printer Setting',
    icon: 'tabler:printer',
    path: '/settings/printer',
    menuId: 28
  },
  {
    title: 'Users',
    icon: 'tabler:users',
    path: '/settings/user',
    menuId: 1
  },
  {
    title: 'Permissions',
    icon: 'tabler:lock',
    path: '/settings/roles',
    menuId: 2
  },
  {
    title: 'Configuration Setting',
    icon: 'tabler:lock',
    path: '/settings/configuration-setting',
    menuId: 45
  }
]
