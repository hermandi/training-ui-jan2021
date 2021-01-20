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
    {
      title: 'Data Produk Adit',
      key: 'dataProdukAdit',
      children: [
        {
          title: 'Input Produk',
          key: 'inputProduk',
          url: '/adit/data-produk',
        },
        {
          title: 'Reporting Produk',
          key: 'reportingProduk',
          url: '/adit/reporting-produk',
        },
      ],
    },
  ]
}

// git log --graph --oneline --decorate --all
