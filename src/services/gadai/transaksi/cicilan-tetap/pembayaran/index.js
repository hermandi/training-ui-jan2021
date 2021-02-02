import apiClientApp from 'services/axios-app'

export async function doLoadPembayaranCicilan(data) {
  return apiClientApp
    .post('/txCicilanTetap/doLoadPembayaranCicilan', {
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

export async function doHitungPembayaranTrxCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doHitungPembayaranTrxCicTetap', {
      noTransaksi: data.noTransaksi,
      totalTagihanYgDibayar: data.totalTagihanYgDibayar,
      biayaAdminTutup: data.biayaAdminTutup,
      diskonPembayaran: data.diskonPembayaran || 0,
      totalPembayaranPelanggan: data.totalPembayaranPelanggan || 0,
      metodePembayaran: data.metodePembayaran,
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

export async function doSavePembayaranTrxCicTetap(data) {
  return apiClientApp
    .post('/txCicilanTetap/doSavePembayaranTrxCicTetap', {
      noTransaksi: data.noTransaksi,
      totalTagihanYgDibayar: data.totalTagihanYgDibayar,
      biayaAdminTutup: data.biayaAdminTutup,
      diskonPembayaran: data.diskonPembayaran || 0,
      totalPembayaranPelanggan: data.totalPembayaranPelanggan || 0,
      metodePembayaran: data.metodePembayaran,
      buktiBayar: data.buktiBayar,
      daftarPembayaran: data.daftarPembayaran,
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
