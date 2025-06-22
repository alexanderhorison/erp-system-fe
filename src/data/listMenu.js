export const listMenu = [
  {
    title: 'Point of Sale',
    path: '/point-of-sale/',
    icon: 'tabler:clipboard-check',
    menuId: 27
  },
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
        title: 'Produk',
        path: '/master/products',
        menuId: 5,
        icon: 'tabler:box'
      },
      {
        title: 'Tipe Produk',
        path: '/master/types',
        menuId: 4,
        icon: 'tabler:packages'
      },
      {
        title: 'Satuan Produk',
        path: '/master/units',
        menuId: 12,
        icon: 'tabler:ruler'
      },
      {
        title: 'Kategori Produk',
        path: '/master/categories',
        menuId: 3,
        icon: 'tabler:tags'
      },
      {
        title: 'Gudang',
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
    title: 'Manajemen Stok',
    icon: 'tabler:stack',
    menuId: [8, 9, 16, 17, 18, 26],
    children: [
      {
        title: 'List Produk Gudang',
        path: '/product-warehouse/product',
        menuId: 8,
        icon: 'tabler:boxes'
      },
      {
        title: 'Penyesuaian Stok Produk Gudang',
        path: '/product-warehouse/warehouse',
        menuId: 9,
        icon: 'tabler:settings'
      },
      {
        title: 'Barang Masuk',
        path: '/adjustment/goods-in',
        menuId: 16,
        icon: 'tabler:truck'
      },
      {
        title: 'Barang Keluar',
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
        title: 'Barang Terhapus',
        path: '/deleted-product-warehouse',
        menuId: 26,
        icon: 'tabler:trash'
      }
    ]
  },
  {
    title: 'Stock Opname',
    path: '/stock-opname/',
    icon: 'tabler:clipboard-check',
    menuId: 15
  },
  {
    title: 'Surat Jalan',
    icon: 'tabler:file-invoice',
    menuId: [10, 11, 19],
    children: [
      {
        title: 'Surat Jalan',
        path: '/delivery-order',
        menuId: 10,
        icon: 'tabler:file'
      },
      {
        title: 'Penerimaan Surat Jalan',
        path: '/receive-order',
        menuId: 11,
        icon: 'tabler:file-check'
      },
      {
        title: 'Produk Outstanding',
        path: '/receipt-order-outstanding',
        menuId: 19,
        icon: 'tabler:alert-circle'
      }
    ]
  },
  {
    sectionTitle: 'Sales Order',
    menuId: [21, 22]
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
    menuId: [1, 2]
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
    menuId: [24],
    children: [
      {
        title: 'Purchase Order',
        path: '/purchase-order',
        menuId: 24
        // icon: 'tabler:receipt'
      }
    ]
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
        title: 'Mobil',
        // icon: 'tabler:car',
        path: '/master/car',
        menuId: 31
      },
      {
        title: 'Karyawan',
        // icon: 'tabler:users',
        path: '/master/employee',
        menuId: 32
      },
      {
        title: 'Cost Tak Terduga',
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
    sectionTitle: 'Aset',
    menuId: [34, 35, 36]
  },
  {
    title: 'Aset Lancar',
    icon: 'tabler:database',
    menuId: [34],
    children: [
      {
        title: 'Produk',
        path: '/asset/current',
        menuId: 34,
        icon: 'tabler:box'
      }
    ]
  },
  {
    title: 'Aset Tak Lancar',
    icon: 'tabler:database',
    menuId: [35, 36],
    children: [
      {
        title: 'Master Aset Tak Lancar',
        path: '/asset/master-non-current',
        menuId: 35,
        icon: 'tabler:box'
      },
      {
        title: 'Transaksi Aset Tak Lancar',
        path: '/asset/non-current',
        menuId: 36,
        icon: 'tabler:box'
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
    sectionTitle: 'Pengguna & Otoritas',
    menuId: [1, 2, 28]
  },
  {
    title: 'Printer Setting',
    icon: 'tabler:printer',
    path: '/settings/printer',
    menuId: 28
  },
  {
    title: 'Pengguna',
    icon: 'tabler:users',
    path: '/settings/user',
    menuId: 1
  },
  {
    title: 'Otoritas',
    icon: 'tabler:lock',
    path: '/settings/roles',
    menuId: 2
  }
]
