import apiClientApp from 'services/axios-app'

export async function doGetTransaksi() {
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

export default doGetTransaksi
