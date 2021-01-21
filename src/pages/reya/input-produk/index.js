import React from 'react'
import { Input, Form, Button, Card, Select, notification } from 'antd'
import * as kategori from 'services/kategori'
import * as product from 'services/product'
import { history } from 'index'

const { Option } = Select
class InputProduk extends React.Component {
  state = {
    data: [],
    loading: false,
    loadingSave: false,
  }

  componentDidMount() {
    this.fetchKategori()
  }

  fetchKategori = () => {
    this.setState({ loading: true })
    kategori.doSearchAllKategori().then(data => {
      console.log(data)
      this.setState({
        data: data.data_kategori,
        loading: false,
      })
    })
  }

  saveProduct = dataProduct => {
    this.setState({ loadingSave: true })
    product.doSaveProduct(dataProduct).then(data => {
      console.log(data)
      this.setState({ loadingSave: false })
      if (data.response_code === '00') {
        const path = '/reya/home-produk'
        history.push(path)
        notification.success({
          message: 'Simpan Produk berhasil!',
          description: 'Sudah berhasil meyimpan produk baru!',
        })
      } else {
        notification.error({
          message: 'Simpan Produk gagal!',
          description: 'Gagal menyimpan produk baru!',
        })
      }
    })
  }

  onFinish = values => {
    console.log(values)
    this.saveProduct(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  routeBack = () => {
    history.goBack()
  }

  render() {
    const { data, loading, loadingSave } = this.state
    return (
      <div>
        <Card title="New Product" size="small" loading={loading}>
          <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product">
                  <Input placeholder="Nama Product" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="kode_kategori" label="Nama Kategori">
                  <Select placeholder="Select a option and change input text above">
                    {data.map(k => (
                      <Option key={k.kode_kategori} value={k.kode_kategori}>
                        {k.kategori}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="harga" label="Harga">
                  <Input placeholder="Harga" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="satuan" label="Satuan Product">
                  <Input placeholder="Satuan Product" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    onClick={this.routeBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    htmlType="submit"
                    loading={loadingSave}
                  >
                    Save
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    )
  }
}

export default InputProduk
