import { enumActions } from 'src/helpers/enumActions'

/**
 * roleMenuGroups
 * -------------------------------------------------------------------------------------
 * Declarative menu-access tree for the role add/edit page (Figma: "Menu Akses"
 * card grid). Extracted from the previous inline `MenuTitle`/`MenuItem` markup
 * in the role detail page — same groups, same `menuId`s, same Bahasa labels,
 * just structured as data so the page can render it as a grid of collapsible
 * cards instead of three fixed columns of lists.
 *
 * Each group is one card. A group with `sections` renders its items under
 * sub-headings (e.g. Inventory's "Data Inventory" / "Management Stock");
 * a group with a flat `items` array renders them directly.
 */
export const roleMenuGroups = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: 'tabler:layout-dashboard',
    items: [
      { name: 'Inventory', menuId: 40 },
      { name: 'Sales Order', menuId: 41 },
      { name: 'Purchase Order', menuId: 42 },
      { name: 'Finance', menuId: 43 }
    ]
  },
  {
    key: 'inventory',
    title: 'Inventory',
    icon: 'tabler:building-warehouse',
    items: [
      { name: 'Stock Opname', menuId: 15 },
      { name: 'Product Request', menuId: 44 },
      { name: 'Loan Stock', menuId: 45 }
    ],
    sections: [
      {
        title: 'Data Inventory',
        items: [
          { name: 'Produk', menuId: 5 },
          { name: 'Tipe Produk', menuId: 4 },
          { name: 'Satuan Produk', menuId: 12 },
          { name: 'Kategori Produk', menuId: 3 },
          { name: 'Gudang', menuId: 6 },
          { name: 'Company', menuId: 13 }
        ]
      },
      {
        title: 'Management Stock',
        items: [
          { name: 'List Produk Gudang', menuId: 8 },
          { name: 'Penyesuaian Stok Produk', menuId: 9 },
          { name: 'Barang Masuk', menuId: 16 },
          { name: 'Barang Keluar', menuId: 17 },
          { name: 'Internal Transfer', menuId: 18 },
          { name: 'Barang Terhapus', menuId: 26 }
        ]
      },
      {
        title: 'Surat Jalan',
        items: [
          { name: 'Surat Jalan', menuId: 10 },
          { name: 'Penerimaan Surat Jalan', menuId: 11 },
          { name: 'Produk Outstanding', menuId: 19 }
        ]
      }
    ]
  },
  {
    key: 'sales-order',
    title: 'Sales Order',
    icon: 'tabler:shopping-cart',
    sections: [
      {
        title: 'Data Customer',
        items: [
          { name: 'Customer', menuId: 21 },
          { name: 'Rank', menuId: 22 }
        ]
      },
      {
        title: 'Sales Order',
        items: [{ name: 'Sales Order', menuId: 23 }]
      }
    ]
  },
  {
    key: 'purchase-order',
    title: 'Purchase Order',
    icon: 'tabler:building',
    sections: [
      {
        title: 'Data Vendor',
        items: [{ name: 'Vendor', menuId: 24 }]
      },
      {
        title: 'Purchase Order',
        items: [{ name: 'Purchase Order', menuId: 25 }]
      }
    ]
  },
  {
    key: 'daily-cost-calendar',
    title: 'Daily Cost Calendar',
    icon: 'tabler:calendar-stats',
    items: [{ name: 'Daily Cost Calendar', menuId: 33 }]
  },
  {
    key: 'asset',
    title: 'Asset',
    icon: 'tabler:wallet',
    items: [
      { name: 'Aset Lancar Bulanan', menuId: 34 },
      { name: 'Master Aset Tidak Lancar', menuId: 35 },
      { name: 'Aset Tidak Lancar Bulanan', menuId: 36 }
    ]
  },
  {
    key: 'liabilitas-bulanan',
    title: 'Liabilitas Bulanan',
    icon: 'tabler:scale',
    items: [
      { name: 'Jangka Pendek Bulanan', menuId: 37 },
      { name: 'Jangka Panjang Bulanan', menuId: 38 }
    ]
  },
  {
    key: 'ekuitas-bulanan',
    title: 'Ekuitas Bulanan',
    icon: 'tabler:coin',
    items: [{ name: 'Ekuitas Bulanan', menuId: 39 }]
  },
  {
    key: 'pengguna-otoritas',
    title: 'Pengguna & Otoritas',
    icon: 'tabler:shield-lock',
    items: [
      { name: 'Pengguna', menuId: 1 },
      { name: 'Otoritas', menuId: 2 },
      { name: 'Printer Setting', menuId: 28 },
      { name: 'Configuration Setting', menuId: 45 }
    ]
  },
  {
    key: 'master',
    title: 'Master',
    icon: 'tabler:database',
    items: [
      { name: 'Category Cost Tak Terduga', menuId: 29 },
      { name: 'Karyawan', menuId: 32 },
      { name: 'Mobil', menuId: 31 }
    ]
  },
  {
    key: 'report',
    title: 'Report',
    icon: 'tabler:file-report',
    items: [{ name: 'Report', menuId: 30 }]
  },
  {
    key: 'point-of-sale',
    title: 'Point Of Sale',
    icon: 'tabler:clipboard-check',
    items: [
      { name: 'Point Of Sale', menuId: 27, actions: [enumActions.EDIT_POS_BASE_PRICE] },
      { name: 'POS Transaction', menuId: 47 },
      { name: 'Shift', menuId: 48 }
    ]
  }
]

// ** Flattened list of every selectable menu item across all groups/sections —
// used to compute the page-level "n dari total akses menu dipilih" count.
export const allRoleMenuItems = roleMenuGroups.flatMap(group => [
  ...(group.items || []),
  ...(group.sections || []).flatMap(section => section.items)
])
