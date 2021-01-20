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
      ],
    },
    {
      title: 'Data Product Faza',
      key: 'dataProductFaza',
      children: [
        {
          title: 'Input Product',
          key: 'inputProduct',
          url: '/input-product-faza',
        },
        {
          title: 'Reporting Product',
          key: 'reportingProduct',
          url: '/reporting-product-faza',
        },
      ],
    },
  ]
}

// git log --graph --oneline --decorate --all
