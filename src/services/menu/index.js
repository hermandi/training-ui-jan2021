export default async function getMenuData() {
  return [
    {
      title: 'Dashboards',
      key: 'dashboards',
      icon: 'fe fe-home',
      url: '/dashboard',
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
          title: 'Home Produk',
          key: 'homeProdukReya',
          url: '/reya/home-produk',
        },
        {
          title: 'Home Produk - TEST',
          key: 'homeProdukTestReya',
          url: '/reya/home-produk-test',
        },
        {
          title: 'Customer',
          key: 'customerReya',
          url: '/reya/customer',
        },
        {
          title: 'Input Produk',
          key: 'inputProdukReya',
          url: '/reya/input-produk',
        },
        {
          title: 'Reporting Produk',
          key: 'reportingProdukReya',
          url: '/reya/reporting-produk',
        },
      ],
    },
    {
      title: 'Transaksi',
      key: 'transaksi',
      icon: 'fe fe-gear',
      children: [
        {
          title: 'Transaksi Cicilan',
          key: 'transaksiCicilan',
          url: '/reya/transaksi/transaksi-cicilan',
        },
      ],
    },
  ]
}

// git log --graph --oneline --decorate --all
