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
      title: 'Gadai',
      key: 'gadai',
      icon: 'fe fe-gear',
      children: [
        {
          title: 'Data Gadai',
          key: 'dataGadai',
          url: '/gadai/data',
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
          title: 'Input Product',
          key: 'inputProduct',
          url: '/adit/data-produk',
        },
        {
          title: 'Reporting Produk',
          key: 'reportingProduk',
          url: '/adit/reporting-produk',
        },
      ],
    },
    {
      title: 'Produk Reya',
      key: 'produkReya',
      icon: 'fe fe-gear',
      children: [
        {
          title: 'Input Produk',
          key: 'inputProduk',
          url: '/reya/inputProduk',
        },
        {
          title: 'Reporting Produk',
          key: 'reportingProduk',
          url: '/reya/reportingProduk',
        },
      ],
    },
  ]
}

// git log --graph --oneline --decorate --all
