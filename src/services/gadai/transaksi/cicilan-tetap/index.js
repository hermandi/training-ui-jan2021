import apiClientApp from 'services/axios-app'

export async function doHitungTrxCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doHitungTrxCicTetap', {
      produkId: data.productId,
      totalNilaiTaksiran: data.totalNilaiTaksiran,
      nilaiPencairanPelanggan: data.nilaiPencairanPelanggan,
      diskonAdmBuka: data.diskonAdmBuka,
      actorId: data.actorId,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSaveTrxCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doSaveTrxCicTetap', {
      produkId: data.productId,
      totalNilaiTaksiran: data.totalNilaiTaksiran,
      nilaiPencairanPelanggan: data.nilaiPencairanPelanggan,
      diskonAdmBuka: data.diskonAdmBuka,
      custId: data.custId,
      daftarBarangGadai: data.daftarBarangGadai,
      actorId: data.actorId,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSearchTransCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doSearchTransCicTetap', {
      produkId: data.produkId,
      produkName: data.produkName,
      trxDateBegin: data.trxDateBegin,
      trxDateEnd: data.trxDateEnd,
      statusTrans: data.statusTrans,
      noKtp: data.noKtp,
      custId: data.custId,
      custName: data.custName,
      noTransaksi: data.noTransaksi,
      actorId: data.actorId,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doGetDetailCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doGetDetailCicTetap', {
      noTransaksi: data.noTransaksi,
      actorId: data.actorId,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
