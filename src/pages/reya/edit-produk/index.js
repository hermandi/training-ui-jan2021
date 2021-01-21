import React from 'react'
import { Input, Form, Button, Card, Select } from 'antd'
import * as kategori from 'services/kategori'
import * as product from 'services/product'
import { history } from 'index'
import { withRouter } from 'react-router'

const { Option } = Select
class EditProduk extends React.Component {
  state = {
    kodeProduk: '',
    namaProduk: '',
    kodeKategori: '',
    harga: '',
    satuan: '',
    data: [],
    loading: false,
    loadingSave: false,
  }

  componentDidMount() {
    console.log(history)
    this.setState(
      {
        loading: true,
        kodeProduk: history.location.state.kodeProduct,
      },
      () => this.fetchProduk(),
    )

    this.fetchKategori()
  }

  fetchProduk = () => {
    this.setState({ loading: true })
    const { kodeProduk } = this.state
    product.doGetProduct(kodeProduk).then(data => {
      console.log(data)
      if (data.response_code === '00') {
        this.setState({
          kodeKategori: data.product.kode_kategori,
          namaProduk: data.product.nama_product,
          harga: data.product.harga,
          satuan: data.product.satuan,
          loading: false,
        })
      }
    })
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

  render() {
    const {
      kodeProduk,
      namaProduk,
      kodeKategori,
      harga,
      satuan,
      data,
      loading,
      loadingSave,
    } = this.state
    const title = 'Edit Produk - '
    const titleKode = title.concat(kodeProduk)

    return (
      <div>
        <Card title={titleKode} size="small" loading={loading}>
          <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product" initialValue={namaProduk}>
                  <Input placeholder="Nama Product" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="kode_kategori" label="Nama Kategori" initialValue={kodeKategori}>
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
                <Form.Item name="harga" label="Harga" initialValue={harga}>
                  <Input placeholder="Harga" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="satuan" label="Satuan Product" initialValue={satuan}>
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

export default withRouter(EditProduk)
