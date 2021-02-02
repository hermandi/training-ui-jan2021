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
          title: 'Home',
          key: 'home',
          url: '/home-faza',
        },
        {
          title: 'Reporting Product',
          key: 'reportingProduct',
          url: '/reporting-product-faza',
        },
      ],
    },
    {
      title: 'Transaksi Cicilan',
      key: 'transaksiCicilan',
      icon: 'fe fe-gear',
      children: [
        {
          title: 'Cicilan Tetap',
          key: 'inputProduk',
          url: '/cicilan-tetap',
        },
        {
          title: 'Cicilan Fleksibel',
          key: 'reportingProduk',
          url: '/cicilan-fleksibel',
        },
      ],
    },
  ]
}

// git log --graph --oneline --decorate --all
