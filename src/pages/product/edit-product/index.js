import React, { Component } from 'react'
import { history } from 'index'
import { Card, Input, Form, Select } from 'antd'
import * as serviceProduct from 'services/product'
import * as kategori from 'services/kategori'

const { Option } = Select

class EditProduct extends Component {
  state = {
    kodeProduct: '',
    namaProduct: '',
    data: [],
    loadingCard: false,
  }

  componentDidMount() {
    console.log(history)
    this.setState(
      {
        loadingCard: true,
        kodeProduct: history.location.state.kodeProduct,
      },
      () => this.fetchProduct(),
    )
    this.fetchKategori()
  }

  fetchKategori = () => {
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
    serviceProduct.doGetProduct(kodeProduct).then(data => {
      if (data.response_code === '00') {
        this.setState({
          namaProduct: data.product.nama_product,
        })
      }
    })
  }

  onChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.values,
    })
  }

  onFinish = values => {
    console.log(values)
  }

  onFinishFailed = values => {
    console.log(values)
  }

  onChangeInput = e => {
    console.log(e)
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    const { namaProduct, data, loadingCard } = this.state
    return (
      <div>
        <Card title="New Product" size="small" loading={loadingCard}>
          <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <h1>{namaProduct}</h1>
            <div className="row">
              <div className="col-md-6">
                <Form.Item>
                  <Input value={namaProduct} onChange={e => this.onChangeInput(e)} />
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
          </Form>
        </Card>
      </div>
    )
  }
}

export default EditProduct
