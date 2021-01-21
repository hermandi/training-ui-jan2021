import apiClientApp from 'services/axios-app'

export async function doSearchProduct(namaProduct, page, pageSize, sortBy) {
  return apiClientApp
    .post('/product/search', {
      nama_product: namaProduct,
      page,
      page_size: pageSize,
      sort_by: sortBy,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSaveProduct(product) {
  return apiClientApp
    .post('/product/save', {
      nama_product: product.nama_product,
      kode_kategori: product.kode_kategori,
      satuan: product.satuan,
      harga: product.harga,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
