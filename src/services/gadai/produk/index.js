import apiClientApp from 'services/axios-app'

export async function doGetListProduk(data) {
  return apiClientApp
    .post('/produk/doGetListProduk', {
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

export default doGetListProduk
