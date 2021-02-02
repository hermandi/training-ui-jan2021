import apiClientApp from 'services/axios-app'

export async function doGetCustomer() {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getCustomer', {})
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doGetCustomer2(dataCustomer) {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getCustomer', {
      customerId: dataCustomer.customerId,
      customerName: dataCustomer.customerName,
      noKtp: dataCustomer.noKtp,
      noHp: dataCustomer.noHp,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSearchAllTransaksi() {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getTransaksi', {})
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSearchTransaksi(dataTransaksi) {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getTransaksi', {
      produkId: dataTransaksi.produkId,
      produkName: dataTransaksi.produkName,
      trxDateBegin: dataTransaksi.trxDateBegin,
      trxDateEnd: dataTransaksi.trxDateEnd,
      statusTransaksi: dataTransaksi.statusTransaksi,
      noKtp: dataTransaksi.noKtp,
      customerId: dataTransaksi.customerId,
      customerName: dataTransaksi.customerName,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doDetailTransaksi(noTransaksi) {
  return apiClientApp
    .post('http://localhost:8080/transaksi/detailTransaksi', {
      noTransaksi,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doGetProduk() {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getProduk', {})
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doHitungTransaksi(dataTransaksi) {
  return apiClientApp
    .post('http://localhost:8080/transaksi/hitungTransaksi', {
      totalNilaiTaksiran: dataTransaksi.totalNilaiTaksiran,
      ltv: dataTransaksi.ltv,
      tipeAdminBuka: dataTransaksi.tipeAdminBuka,
      biayaAdminBuka: dataTransaksi.biayaAdminBuka,
      discBiayaAdm: dataTransaksi.discBiayaAdm,
      nilaiPencairan: dataTransaksi.nilaiPencairan,
      jangkaWaktu: dataTransaksi.jangkaWaktu,
      biayaJasaPenyimpanan: dataTransaksi.biayaJasaPenyimpanan,
      periodeJasaPenyimpanan: dataTransaksi.periodeJasaPenyimpanan,
      tipeAdminTutup: dataTransaksi.tipeAdminTutup,
      biayaAdminTutup: dataTransaksi.biayaAdminTutup,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSaveTrxCicTetap(
  dataBarang,
  productId,
  customerId,
  totalNilaiTaksiran,
  diskonAdmBuka,
  nilaiPencairanPelanggan,
) {
  return apiClientApp
    .post('http://localhost:8080/transaksi/simpanTransaksi', {
      actorId: 'Admin-1',
      transaksiBarang: dataBarang,
      productId,
      customerId,
      totalNilaiTaksiran,
      discBiayaAdm: diskonAdmBuka,
      nilaiPencairan: nilaiPencairanPelanggan,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doGetPembayaran(noTransaksi) {
  return apiClientApp
    .post('http://localhost:8080/tagihan/getPembayaran', {
      noTransaksi,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doHitungPembayaran(dataPembayaran) {
  return apiClientApp
    .post('http://localhost:8080/tagihan/hitungPembayaran', {
      totalTagihanYgDibayar: dataPembayaran.totalTagihanYgDibayar,
      diskonPembayaranPersen: dataPembayaran.diskonPembayaranPersen,
      biayaAdmTutupLunas: dataPembayaran.biayaAdmTutupLunas,
      totalPembayaran: dataPembayaran.totalPembayaran,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function doSavePembayaranCicTetap(
  noTransaksi,
  totalTagihanYgDibayar,
  diskonPembayaranPersen,
  totalPembayaran,
  metodePembayaran,
  buktiBayar,
  daftarPembayaran,
) {
  return apiClientApp
    .post('http://localhost:8080/tagihan/savePembayaran', {
      noTransaksi,
      totalTagihanYgDibayar,
      diskonPembayaranPersen,
      totalPembayaran,
      metodeBayar: metodePembayaran,
      buktiBayar,
      daftarPembayaran,
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
