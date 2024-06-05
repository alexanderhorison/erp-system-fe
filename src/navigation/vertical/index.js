import { UseAuth } from 'src/hooks/useAuth'

const navigation = () => {
  const auth = UseAuth()
  /**
   * Add menuId Based on Id in menuId database
   */
  const deploy = [
    {
      title: 'Master Data',
      icon: 'tabler:server-cog',
      children: [
        {
          title: 'Produk',
          path: '/master/products',
          menuId: 5
        },
        {
          title: 'Tipe Produk',
          path: '/master/types',
          menuId: 4
        },
        {
          title: 'Satuan Produk',
          path: '/master/units',
          menuId: 12
        },
        {
          title: 'Kategori Produk',
          path: '/master/categories',
          menuId: 3
        },
        {
          title: 'Gudang',
          path: '/master/warehouses',
          menuId: 6
        },
        // {
        //   title: 'Rumus Transformasi',
        //   path: '/master/transformation',
        //   menuId: 7
        // }
      ]
    },
    {
      title: 'Manajemen Stok',
      icon: 'tabler:server-cog',
      children: [
        {
          title: 'List Produk Gudang',
          path: '/product-warehouse/product',
          menuId: 8
        },
        {
          title: 'Penyesuaian Stok Produk Gudang',
          path: '/product-warehouse/warehouse',
          menuId: 9
        }
      ]
    },
    {
      title: 'Surat Jalan',
      icon: 'tabler:server-cog',
      children: [
        {
          title: 'Surat Jalan',
          path: '/delivery-order',
          menuId: 10
        },
        {
          title: 'Penerimaan Surat Jalan',
          path: '/receive-order',
          menuId: 11
        }
      ]
    },
    {
      sectionTitle: 'Pengguna & Otoritas',
      menuId: [1, 2]
    },
    {
      title: 'Pengguna',
      icon: 'tabler:user',
      path: '/settings/user',
      menuId: 1
    },
    {
      title: 'Otoritas',
      icon: 'tabler:settings',
      path: '/settings/roles',
      menuId: 2
    }
  ]
  const menu = [
    {
      title: 'Dashboards',
      icon: 'tabler:brand-tabler',
      badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          title: 'Analytics',
          path: '/dashboards/analytics'
        },
        {
          title: 'CRM',
          path: '/dashboards/crm'
        },
        {
          title: 'eCommerce',
          path: '/dashboards/ecommerce'
        }
      ]
    },
    {
      title: 'Master Data',
      icon: 'tabler:server-cog',
      children: [
        {
          title: 'Produk',
          path: '/master/products'
        },
        {
          title: 'Tipe Produk',
          path: '/master/types'
        },
        {
          title: 'Satuan Produk',
          path: '/master/units'
        },
        {
          title: 'Kategori Produk',
          path: '/master/categories',
          icon: 'tabler:brand-tabler'
        },
        {
          title: 'Gudang',
          path: '/master/warehouses'
        },
        // {
        //   title: 'Rumus Transformasi',
        //   path: '/master/transformation'
        // }
      ]
    },
    {
      sectionTitle: 'Produk Gudang'
    },
    {
      title: 'Produk',
      icon: 'tabler:list',
      children: [
        {
          title: 'Daftar Gudang',
          path: '/product-warehouse/warehouse'
        },
        {
          title: 'Daftar Produk',
          path: '/product-warehouse/product'
        }
      ]
    },
    {
      title: 'Surat Jalan',
      icon: 'tabler:server-cog',
      children: [
        {
          title: 'Surat Jalan',
          path: '/delivery-order',
          menuId: 10
        },
        {
          title: 'Penerimaan Surat Jalan',
          path: '/receive-order',
          menuId: 11
        }
      ]
    },
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Email',
      icon: 'tabler:mail',
      path: '/apps/email'
    },
    {
      title: 'Chat',
      icon: 'tabler:messages',
      path: '/apps/chat'
    },
    {
      title: 'Calendar',
      icon: 'tabler:calendar',
      path: '/apps/calendar'
    },
    {
      title: 'Invoice',
      icon: 'tabler:file-dollar',
      children: [
        {
          title: 'List',
          path: '/apps/invoice/list'
        },
        {
          title: 'Preview',
          path: '/apps/invoice/preview'
        },
        {
          title: 'Edit',
          path: '/apps/invoice/edit'
        },
        {
          title: 'Add',
          path: '/apps/invoice/add'
        }
      ]
    },
    {
      sectionTitle: 'Pengguna & Otoritas'
    },
    {
      title: 'Pengguna',
      icon: 'tabler:user',
      path: '/settings/user'
    },
    {
      title: 'Otoritas',
      icon: 'tabler:settings',
      path: '/settings/roles'
    },
    {
      title: 'Pages',
      icon: 'tabler:file',
      children: [
        {
          title: 'User Profile',
          children: [
            {
              title: 'Profile',
              path: '/pages/user-profile/profile'
            },
            {
              title: 'Teams',
              path: '/pages/user-profile/teams'
            },
            {
              title: 'Projects',
              path: '/pages/user-profile/projects'
            },
            {
              title: 'Connections',
              path: '/pages/user-profile/connections'
            }
          ]
        },
        {
          title: 'Account Settings',
          children: [
            {
              title: 'Account',
              path: '/pages/account-settings/account'
            },
            {
              title: 'Security',
              path: '/pages/account-settings/security'
            },
            {
              title: 'Billing',
              path: '/pages/account-settings/billing'
            },
            {
              title: 'Notifications',
              path: '/pages/account-settings/notifications'
            },
            {
              title: 'Connections',
              path: '/pages/account-settings/connections'
            }
          ]
        },
        {
          title: 'FAQ',
          path: '/pages/faq'
        },
        {
          title: 'Help Center',
          path: '/pages/help-center'
        },
        {
          title: 'Pricing',
          path: '/pages/pricing'
        },
        {
          title: 'Miscellaneous',
          children: [
            {
              openInNewTab: true,
              title: 'Coming Soon',
              path: '/pages/misc/coming-soon'
            },
            {
              openInNewTab: true,
              title: 'Under Maintenance',
              path: '/pages/misc/under-maintenance'
            },
            {
              openInNewTab: true,
              title: 'Page Not Found - 404',
              path: '/pages/misc/404-not-found'
            },
            {
              openInNewTab: true,
              title: 'Not Authorized - 401',
              path: '/pages/misc/401-not-authorized'
            },
            {
              openInNewTab: true,
              title: 'Server Error - 500',
              path: '/pages/misc/500-server-error'
            }
          ]
        }
      ]
    },
    {
      title: 'Auth Pages',
      icon: 'tabler:lock',
      children: [
        {
          title: 'Login',
          children: [
            {
              openInNewTab: true,
              title: 'Login v1',
              path: '/pages/auth/login-v1'
            },
            {
              openInNewTab: true,
              title: 'Login v2',
              path: '/pages/auth/login-v2'
            },
            {
              openInNewTab: true,
              title: 'Login With AppBar',
              path: '/pages/auth/login-with-appbar'
            }
          ]
        },
        {
          title: 'Register',
          children: [
            {
              openInNewTab: true,
              title: 'Register v1',
              path: '/pages/auth/register-v1'
            },
            {
              openInNewTab: true,
              title: 'Register v2',
              path: '/pages/auth/register-v2'
            },
            {
              openInNewTab: true,
              title: 'Register Multi-Steps',
              path: '/pages/auth/register-multi-steps'
            }
          ]
        },
        {
          title: 'Verify Email',
          children: [
            {
              openInNewTab: true,
              title: 'Verify Email v1',
              path: '/pages/auth/verify-email-v1'
            },
            {
              openInNewTab: true,
              title: 'Verify Email v2',
              path: '/pages/auth/verify-email-v2'
            }
          ]
        },
        {
          title: 'Forgot Password',
          children: [
            {
              openInNewTab: true,
              title: 'Forgot Password v1',
              path: '/pages/auth/forgot-password-v1'
            },
            {
              openInNewTab: true,
              title: 'Forgot Password v2',
              path: '/pages/auth/forgot-password-v2'
            }
          ]
        },
        {
          title: 'Reset Password',
          children: [
            {
              openInNewTab: true,
              title: 'Reset Password v1',
              path: '/pages/auth/reset-password-v1'
            },
            {
              openInNewTab: true,
              title: 'Reset Password v2',
              path: '/pages/auth/reset-password-v2'
            }
          ]
        },
        {
          title: 'Two Steps',
          children: [
            {
              openInNewTab: true,
              title: 'Two Steps v1',
              path: '/pages/auth/two-steps-v1'
            },
            {
              openInNewTab: true,
              title: 'Two Steps v2',
              path: '/pages/auth/two-steps-v2'
            }
          ]
        }
      ]
    },
    {
      title: 'Wizard Examples',
      icon: 'tabler:forms',
      children: [
        {
          title: 'Checkout',
          path: '/pages/wizard-examples/checkout'
        },
        {
          title: 'Property Listing',
          path: '/pages/wizard-examples/property-listing'
        },
        {
          title: 'Create Deal',
          path: '/pages/wizard-examples/create-deal'
        }
      ]
    },
    {
      icon: 'tabler:square',
      title: 'Dialog Examples',
      path: '/pages/dialog-examples'
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Typography',
      icon: 'tabler:typography',
      path: '/ui/typography'
    },
    {
      title: 'Icons',
      path: '/ui/icons',
      icon: 'tabler:brand-tabler'
    },
    {
      title: 'Cards',
      icon: 'tabler:id',
      children: [
        {
          title: 'Basic',
          path: '/ui/cards/basic'
        },
        {
          title: 'Advanced',
          path: '/ui/cards/advanced'
        },
        {
          title: 'Statistics',
          path: '/ui/cards/statistics'
        },
        {
          title: 'Widgets',
          path: '/ui/cards/widgets'
        },
        {
          title: 'Actions',
          path: '/ui/cards/actions'
        }
      ]
    },
    {
      badgeContent: '19',
      title: 'Components',
      icon: 'tabler:archive',
      badgeColor: 'primary',
      children: [
        {
          title: 'Accordion',
          path: '/components/accordion'
        },
        {
          title: 'Alerts',
          path: '/components/alerts'
        },
        {
          title: 'Avatars',
          path: '/components/avatars'
        },
        {
          title: 'Badges',
          path: '/components/badges'
        },
        {
          title: 'Buttons',
          path: '/components/buttons'
        },
        {
          title: 'Button Group',
          path: '/components/button-group'
        },
        {
          title: 'Chips',
          path: '/components/chips'
        },
        {
          title: 'Dialogs',
          path: '/components/dialogs'
        },
        {
          title: 'List',
          path: '/components/list'
        },
        {
          title: 'Menu',
          path: '/components/menu'
        },
        {
          title: 'Pagination',
          path: '/components/pagination'
        },
        {
          title: 'Progress',
          path: '/components/progress'
        },
        {
          title: 'Ratings',
          path: '/components/ratings'
        },
        {
          title: 'Snackbar',
          path: '/components/snackbar'
        },
        {
          title: 'Swiper',
          path: '/components/swiper'
        },
        {
          title: 'Tabs',
          path: '/components/tabs'
        },
        {
          title: 'Timeline',
          path: '/components/timeline'
        },
        {
          title: 'Toasts',
          path: '/components/toast'
        },
        {
          title: 'Tree View',
          path: '/components/tree-view'
        },
        {
          title: 'More',
          path: '/components/more'
        }
      ]
    },
    {
      sectionTitle: 'Forms & Tables'
    },
    {
      title: 'Form Elements',
      icon: 'tabler:toggle-left',
      children: [
        {
          title: 'Text Field',
          path: '/forms/form-elements/text-field'
        },
        {
          title: 'Select',
          path: '/forms/form-elements/select'
        },
        {
          title: 'Checkbox',
          path: '/forms/form-elements/checkbox'
        },
        {
          title: 'Radio',
          path: '/forms/form-elements/radio'
        },
        {
          title: 'Custom Inputs',
          path: '/forms/form-elements/custom-inputs'
        },
        {
          title: 'Textarea',
          path: '/forms/form-elements/textarea'
        },
        {
          title: 'Autocomplete',
          path: '/forms/form-elements/autocomplete'
        },
        {
          title: 'Date Pickers',
          path: '/forms/form-elements/pickers'
        },
        {
          title: 'Switch',
          path: '/forms/form-elements/switch'
        },
        {
          title: 'File Uploader',
          path: '/forms/form-elements/file-uploader'
        },
        {
          title: 'Editor',
          path: '/forms/form-elements/editor'
        },
        {
          title: 'Slider',
          path: '/forms/form-elements/slider'
        },
        {
          title: 'Input Mask',
          path: '/forms/form-elements/input-mask'
        }
      ]
    },
    {
      icon: 'tabler:layout-navbar',
      title: 'Form Layouts',
      path: '/forms/form-layouts'
    },
    {
      title: 'Form Validation',
      path: '/forms/form-validation',
      icon: 'tabler:checkbox'
    },
    {
      title: 'Form Wizard',
      path: '/forms/form-wizard',
      icon: 'tabler:text-wrap-disabled'
    },
    {
      title: 'Table',
      icon: 'tabler:table',
      path: '/tables/mui'
    },
    {
      title: 'Mui DataGrid',
      icon: 'tabler:layout-grid',
      path: '/tables/data-grid'
    },
    {
      sectionTitle: 'Charts & Misc'
    },
    {
      title: 'Charts',
      icon: 'tabler:chart-pie',
      children: [
        {
          title: 'Apex',
          path: '/charts/apex-charts'
        },
        {
          title: 'Recharts',
          path: '/charts/recharts'
        },
        {
          title: 'ChartJS',
          path: '/charts/chartjs'
        }
      ]
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      icon: 'tabler:shield',
      title: 'Access Control'
    },
    {
      title: 'Others',
      icon: 'tabler:dots',
      children: [
        {
          title: 'Menu Levels',
          children: [
            {
              title: 'Menu Level 2.1'
            },
            {
              title: 'Menu Level 2.2',
              children: [
                {
                  title: 'Menu Level 3.1'
                },
                {
                  title: 'Menu Level 3.2'
                }
              ]
            }
          ]
        },
        {
          title: 'Disabled Menu',
          disabled: true
        },
        {
          title: 'Raise Support',
          externalLink: true,
          openInNewTab: true,
          path: 'https://pixinvent.ticksy.com/'
        },
        {
          title: 'Documentation',
          externalLink: true,
          openInNewTab: true,
          path: 'https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
        }
      ]
    }
  ]

  const selectedMenu = []
  // default menu
  selectedMenu.push({
    title: 'Dashboard',
    icon: 'tabler:home',
    path: '/home'
  })

  if (process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'false') {
    deploy?.forEach(item => {
      if (item?.children && item?.children.length > 0) {
        const section = {
          title: item.title,
          icon: item.icon,
          children: []
        }
        item?.children.forEach(child => {
          if (auth?.user?.Role?.MenuId?.includes(child?.menuId)) {
            section.children.push(child)
          }
        })
        if (section.children.length > 0) {
          selectedMenu.push(section)
        }
      } else if (item?.hasOwnProperty('sectionTitle')) {
        let isFlag = false
        item?.menuId.forEach(number => {
          if (auth?.user?.Role?.MenuId?.includes(number) && !isFlag) {
            selectedMenu.push(item)
            isFlag = true
          }
        })
      } else if (auth?.user?.Role?.MenuId?.includes(item?.menuId)) {
        selectedMenu.push(item)
      }
    })
  }

  if (process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true') {
    return menu
  } else {
    return selectedMenu
  }
}

export default navigation
