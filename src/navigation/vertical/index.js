import { defaultMenuVuexy, listMenu, listMenu2, oldMenu } from 'src/data/listMenu'
import { UseAuth } from 'src/hooks/useAuth'

const navigation = () => {
  const auth = UseAuth()
  /**
   * Add menuId Based on Id in menuId database
  */

  // List Menu V1
  // const deploy = oldMenu

  // List Menu V2
  const deploy = listMenu
  // FOR DEVELOPMENT DEFAULT MENU VUEXY
  const menu = defaultMenuVuexy

  const selectedMenu = []
  // default menu
  selectedMenu.push({
    title: 'Dashboard',
    icon: 'tabler:home',
    path: '/home',
    children: [
      {
        title: "Inventory",
        path: "/home",
        menuId: 1
      },
      {
        title: "Sales Order",
        path: "/dashboard-sales-order",
        menuId: 1,
      },
      {
        title: "Purchase Order",
        path: "/dashboard-purchase-order",
        menuId: 1,
      }
    ]
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
          if (auth?.user?.menuId?.includes(child?.menuId)) {
            section.children.push(child)
          }
        })
        if (section.children.length > 0) {
          selectedMenu.push(section)
        }
      } else if (item?.hasOwnProperty('sectionTitle')) {
        let isFlag = false
        item?.menuId.forEach(number => {
          if (auth?.user?.menuId?.includes(number) && !isFlag) {
            selectedMenu.push(item)
            isFlag = true
          }
        })
      } else if (auth?.user?.menuId?.includes(item?.menuId)) {
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
