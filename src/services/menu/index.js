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
          url: '/product',
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
      title: 'Data Product Adit',
      key: 'dataProductAdit',
      children: [
        {
          title: 'Data Product',
          key: 'dataProductAdit',
          url: '/adit/home-product',
        },
        {
          title: 'Input Product',
          key: 'inputProductAdit',
          url: '/adit/input-product',
        },
        {
          title: 'Reporting Product',
          key: 'reportingProductAdit',
          url: '/adit/reporting-product',
        },
      ],
    },
    {
      title: 'Transaksi Cicilan Tetap',
      key: 'transaksiCicilanTetap',
      url: '/adit/gadai/transaksi/cicilan-tetap/cari',
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
