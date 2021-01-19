export default async function getMenuData() {
  return [
    {
      title: 'Dashboards',
      key: 'dashboards',
      icon: 'fe fe-home',
      url: '/dashboard',
    },
    {
      title: 'Product',
      key: 'product',
      icon: 'fe fe-gear',
      children: [
        {
          title: 'Data Product',
          key: 'dataProduct',
          url: '/data-product',
        },
        {
          title: 'Edit Product',
          key: 'editProduct',
          url: '/edit-product',
        },
      ],
    },
    {
      title: 'Setting',
      key: 'setting',
      icon: 'fe fe-gear',
      url: '/setting',
    },
    {
      title: 'Gadai',
      key: 'gadai',
      icon: 'fe fe-home',
      children: [
        {
          title: 'Data Gadai',
          key: 'dataGadai',
          url: '/gadai/data',
        },
      ],
    },
  ]
}
