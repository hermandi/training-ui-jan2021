import apiClientApp from 'services/axios-app'

export async function doGetTransaksi() {
  return apiClientApp
    .post('http://localhost:8080/transaksi/getCustomer', {})
    .then(response => {
      console.log(response)
      if (response) {
        return response.responseData
      }
      return false
    })
    .catch(err => console.log(err))
}

export default doGetTransaksi
