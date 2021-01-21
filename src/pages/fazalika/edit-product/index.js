import React from 'react'
import { Input, Form, Button, Card, Select } from 'antd'
import * as kategori from 'services/kategori'
import * as product from 'services/product'
import { history } from 'index'

const { Option } = Select

class EditProduct extends React.Component {
  state = {
    kodeProduct: '',
    namaProduct: '',
    kodeKategori: '',
    harga: '',
    satuan: '',
    data: [],
    loadingCard: false,
    loadingSave: false,
  }

  componentDidMount() {
    console.log(history)
    this.setState(
      {
        loadingCard: true,
        kodeProduct: history.location.state.data,
      },
      () => this.fetchProduct(),
    )
    this.fetchKategori()
  }

  fetchKategori = () => {
    this.setState({ loadingCard: true })
    kategori.doSearchAllKategori().then(data => {
      console.log(data)
      this.setState({
        data: data.data_kategori,
        loadingCard: false,
      })
    })
  }

  fetchProduct = () => {
    const { kodeProduct } = this.state
    product.doGetProduct(kodeProduct).then(data => {
      if (data.response_code === '00') {
        this.setState({
          namaProduct: data.product.nama_product,
          harga: data.product.harga,
          satuan: data.product.satuan,
          kodeKategori: data.product.kodeKategori,
        })
      }
    })
  }

  saveProduct = dataProduct => {
    this.setState({ loadingSave: true })
    product.doSaveEdit(dataProduct).then(data => {
      console.log(data)
      this.setState({ loadingSave: false })
      if (data.response_code === '00') {
        history.goBack()
      }
    })
  }

  onChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onFinish = values => {
    console.log(values)
    // this.saveProduct(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  render() {
    const {
      kodeProduct,
      namaProduct,
      kodeKategori,
      harga,
      satuan,
      data,
      loadingCard,
      loadingSave,
    } = this.state
    return (
      <div>
        <Card title={<h2>Edit Data {kodeProduct}</h2>} size="small" loading={loadingCard}>
          <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product">
                  <Input value={namaProduct} onChange={e => this.onChangeInput(e)} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="nama_kategori" label="Nama Kategori">
                  <Select value={kodeKategori} onChange={e => this.onChangeInput(e)}>
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
                <Form.Item label="Harga">
                  <Input value={harga} onChange={e => this.onChangeInput(e)} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Satuan Product">
                  <Input value={satuan} onChange={e => this.onChangeInput(e)} />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    htmlType="submit"
                    loading={loadingSave}
                  >
                    Save Editing
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

export default EditProduct
