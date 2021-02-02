import apiGadaiApp from 'services/axios-app'

export async function doSearchTrx(searchParameter){
    return apiGadaiApp
      .post('/doSearchTransCicTetap', searchParameter)
      .then(response => {
        if (response) {
          console.log(response)
          return response.data
        }
        return false
      })
      .catch(err => console.log(err))
}

export async function doGetDetailTrx(searchParameter) {
    return apiGadaiApp
      .post('/doGetDetailCicTetap', searchParameter)
      .then(response => {
        console.log(response)
        if (response) {
          return response.data
        }
        return false
      })
      .catch(err => console.log(err))
}

export async function doCountTrx(productId, searchParameter, nilaiTaksiran) {
    return apiGadaiApp
      .post('/doHitungTrxCicTetap', 
      {
        "productId": productId,
        "totalNilaiTaksiran": nilaiTaksiran,
        "nilaiPencairan": searchParameter.nilai_pencairan_pelanggan,
        "discBiayaAdmin": searchParameter.diskon_adm_buka,
        "actorId":"31"
      })
      .then(response => {
        if (response) {
          return response.data
        }
        return false
      })
      .catch(err => console.log(err))
}

export async function doSaveTrx(productIdParam, totalNilaiTaksiran, nilaiPencairan, discBiayaAdmin, customerId, daftarBarangParam) {
  return apiGadaiApp
    .post('/doSaveTrxCicTetap', 
    {
      "productId": productIdParam,
      "totalNilaiTaksiran": totalNilaiTaksiran,
      "nilaiPencairan": parseInt(nilaiPencairan, 10),
      "discBiayaAdmin": parseInt(discBiayaAdmin, 10),
      "customerId": parseInt(customerId, 10),
      "daftarBarang": daftarBarangParam,
      "actorId": "78"
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSearchPelanggan(searchParameter) {
    return apiGadaiApp
      .post('/doSearchPelanggan', searchParameter)
      .then(response => {
        if (response) {
          return response.data
        }
        return false
      })
      .catch(err => console.log(err))
}

export async function doGetProduk(searchParameter) {
  return apiGadaiApp
    .post('/doGetListProduk', searchParameter)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function loadPayment(loadParameter) {
  console.log(loadParameter)
  return apiGadaiApp
    .post('/doLoadPembayaranCicilan', loadParameter)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function countPayment(countParameter) {
  return apiGadaiApp
    .post('/doHitungPembayaranTrxCicTetap', countParameter)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function savePayment(countParameter) {
  console.log(countParameter)
  return apiGadaiApp
    .post('/doSavePembayaranTrxCicTetap', countParameter)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}