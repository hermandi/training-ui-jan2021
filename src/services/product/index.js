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

export async function doSaveProduct(dataProduk) {
  return apiClientApp
    .post('/product/save', {
      nama_product: dataProduk.nama_product,
      kode_kategori: dataProduk.kode_kategori,
      satuan: dataProduk.satuan,
      harga: dataProduk.harga,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doGetProduct(kodeProduct) {
  return apiClientApp
    .get('/product/get-product', { params: { kode_product: kodeProduct } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
