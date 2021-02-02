import React, { Component } from 'react'
import { Input, Form, Button, Card, Select, InputNumber, notification, Modal } from 'antd'
import * as kategoriService from 'services/kategori'
import * as productService from 'services/product'
import { history } from 'index'

const { Option } = Select

class EditProduct extends Component {
  formRef = React.createRef()

  state = {
    dataKategori: [],
    loadingEdit: false,
    loadingCard: true,
    loadingDelete: false,
    kodeProduct: '',
    namaProduct: '',
    kodeKategori: '',
    harga: 0,
    satuan: '',
  }

  componentDidMount() {
    this.setState(
      {
        kodeProduct: history.location.state.kodeProduct,
      },
      () => {
        this.fetchProduct()
        this.fetchKategori()
      },
    )
  }

  fetchKategori = () => {
    kategoriService.doSearchAllKategori().then(data => {
      console.log(data)
      this.setState({
        dataKategori: data.data_kategori,
      })
    })
  }

  fetchProduct = () => {
    const { kodeProduct } = this.state
    productService.doGetProduct(kodeProduct).then(data => {
      const { product } = data
      console.log(data.product)
      this.setState(
        {
          namaProduct: product.nama_product,
          kodeKategori: product.kode_kategori,
          harga: product.harga,
          satuan: product.satuan,
          loadingCard: false,
        },
        () => {
          const { namaProduct, kodeKategori, harga, satuan } = this.state
          this.formRef.current.setFieldsValue({
            nama_product: namaProduct,
            harga,
            satuan,
            kode_kategori: kodeKategori,
          })
        },
      )
    })
  }

  editProduct = dataProduct => {
    this.setState({ loadingEdit: true })
    const { kodeProduct } = this.state
    dataProduct.kode_product = kodeProduct
    productService.doEditProduct(dataProduct).then(data => {
      console.log(data)
      this.setState({ loadingEdit: false })
      if (data.response_code === '00') {
        history.push('/adit/home-product')
        notification.success({
          message: 'Edit Product Success',
        })
      } else {
        this.setState({ loadingEdit: false })
        notification.error({
          message: 'Edit Product Fail',
        })
      }
    })
  }

  onFinish = values => {
    this.editProduct(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  onClickDelete = () => {
    const { kodeProduct } = this.state
    const modalTitle = 'Delete Product ID '
    Modal.confirm({
      title: modalTitle.concat(kodeProduct),
      content: 'Anda yakin ingin menghapus product ini?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: this.deleteProduct,
    })
  }

  deleteProduct = () => {
    const { kodeProduct } = this.state
    this.setState({ loadingDelete: true })
    productService.doDeleteProduct(kodeProduct).then(data => {
      console.log(data)
      this.setState({ loadingEdit: false })
      if (data.response_code === '00') {
        history.push('/adit/home-product')
        notification.success({
          message: 'Delete Product Success',
        })
      } else {
        this.setState({ loadingEdit: false })
        notification.error({
          message: 'Delete Product Fail',
        })
      }
    })
  }

  render() {
    const {
      dataKategori,
      loadingCard,
      loadingEdit,
      loadingDelete,
      kodeProduct,
      namaProduct,
    } = this.state

    return (
      <div>
        <Card
          title={`Edit Product ${kodeProduct}/${namaProduct}`}
          size="small"
          loading={loadingCard}
        >
          <Form
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="nama_product" label="Nama Product">
                  <Input placeholder="Nama Product" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="kode_kategori" label="Nama Kategori">
                  <Select placeholder="Select a option and change input text above">
                    {dataKategori.map(k => (
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
                  <InputNumber style={{ width: '100%' }} placeholder="Harga" />
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
                    loading={loadingEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    loading={loadingDelete}
                    onClick={this.onClickDelete}
                  >
                    Delete
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    onClick={() => history.push('/adit/home-product')}
                  >
                    Go Back
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
