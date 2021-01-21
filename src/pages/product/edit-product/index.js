import React, { Component } from 'react'
import { history } from 'index'
import { Button, Card, Input, Form, Select, InputNumber } from 'antd'
import * as serviceProduct from 'services/product'
import * as kategori from 'services/kategori'
import { withRouter } from 'react-router-dom'

const { Option } = Select

class EditProduct extends Component {
  formRef = React.createRef()

  state = {
    data: [],
    loadingCard: false,
    loadingSave: false,
  }

  componentDidMount() {
    this.setState(
      {
        loadingCard: true,
      },
      () => {
        this.fetchProduct(history.location.state.kodeProduct)
        this.fetchKategori()
      },
    )
  }

  fetchKategori = () => {
    kategori.doSearchAllKategori().then(data => {
      this.setState({
        data: data.data_kategori,
        loadingCard: false,
      })
    })
  }

  fetchProduct = kode => {
    serviceProduct.doGetProduct(kode).then(data => {
      if (data.response_code === '00') {
        this.setState(
          {
            loadingCard: false,
          },
          () => {
            this.formRef.current.setFieldsValue({
              nama_product: data.product.nama_product,
              harga: data.product.harga,
              satuan: data.product.satuan,
              kode_kategori: data.product.kode_kategori,
              kode_product: data.product.kode_product,
            })
          },
        )
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

  onFinishFailed = errorInfo => {
    console.log(errorInfo)
  }

  render() {
    const { data, loadingCard, loadingSave } = this.state
    return (
      <div>
        <Card title="Edit Product" size="small" loading={loadingCard}>
          <Form
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product">
                  <Input />
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
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Harga"
                  />
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

export default withRouter(EditProduct)
