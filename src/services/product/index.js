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

export async function doEditProduct(dataProduk) {
  return apiClientApp
    .post('/product/edit', {
      kode_product: dataProduk.kode_product,
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

export async function doDeleteProduct(kodeProduct) {
  return apiClientApp
    .post('/product/delete', {
      kode_product: kodeProduct,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
