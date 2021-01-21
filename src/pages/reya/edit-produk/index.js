import React from 'react'
import { Input, Form, Button, Card, Select, notification, InputNumber, Popconfirm } from 'antd'
import * as kategori from 'services/kategori'
import * as product from 'services/product'
import { history } from 'index'
import { withRouter } from 'react-router'

const { Option } = Select
class EditProduk extends React.Component {
  formRef = React.createRef()

  state = {
    kodeProduct: '',
    data: [],
    loading: false,
    loadingSave: false,
  }

  componentDidMount() {
    this.setState({ kodeProduct: history.location.state.kodeProduct, loading: true }, () => {
      this.fetchProduk(history.location.state.kodeProduct)
      this.fetchKategori()
    })
  }

  fetchProduk = kode => {
    product.doGetProduct(kode).then(data => {
      if (data.response_code === '00') {
        this.setState(
          {
            loading: false,
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

  editProduct = dataProduct => {
    this.setState({ loadingSave: true })
    product.doEditProduct(dataProduct).then(data => {
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
          message: 'Edit Produk gagal!',
          description: data.response_desc,
        })
      }
    })
  }

  onFinish = values => {
    console.log(values)
    this.editProduct(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  onChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.values,
    })
  }

  routeBack = () => {
    history.goBack()
  }

  confirmPop = () => {
    notification.success({
      message: 'Berhasil menghapus produk!',
      description: 'Produk sudah berhasil dihapus!',
    })
  }

  cancelPop = () => {
    notification.error({
      message: 'Tidak menghapus data!',
      description: 'Produk dipilih tidak dihapus!',
    })
  }

  render() {
    const { kodeProduct, data, loading, loadingSave } = this.state
    const title = 'Edit Produk - '
    const titleKode = title.concat(kodeProduct)
    return (
      <div>
        <Card title={titleKode} size="small" loading={loading}>
          <Form
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <div className="row">
              <Form.Item name="kode_product" label="Kode Product" hidden="true">
                <Input />
              </Form.Item>
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
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="satuan" label="Satuan Product">
                  <Input />
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
                  <Popconfirm
                    title="Yakin menghapus produk ini?"
                    onConfirm={this.confirmPop}
                    onCancel={this.cancelPop}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" className="btn btn-light px-5 mr-2">
                      Hapus Produk
                    </Button>
                  </Popconfirm>
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
