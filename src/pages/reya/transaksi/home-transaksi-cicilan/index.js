import React from 'react'
import moment from 'moment'
import { Card, Space, Button, Table, Form, Input, DatePicker, Select } from 'antd'
import * as transaksi from 'services/transaksi'
import { history } from 'index'

const { Option } = Select

function routeDetailTransaksi(noTransaksi) {
  const path = '/reya/transaksi/transaksi-cicilan-detail'
  history.push({
    pathname: path,
    state: { noTransaksi },
  })
}

const columns = [
  {
    title: 'No Transaksi',
    dataIndex: 'noTransaksi',
    key: 'noTransaksi',
    width: '15%',
  },
  {
    title: 'Tgl Transaksi',
    dataIndex: 'tglTransaksi',
    key: 'tglTransaksi',
    width: '15%',
    render: tglTransaksi => moment(tglTransaksi).format('YYYY-MM-DD'),
  },
  {
    title: 'Id Pelanggan',
    dataIndex: 'customerId',
    key: 'customerId',
    width: '15%',
  },
  {
    title: 'No KTP',
    dataIndex: 'noKtp',
    key: 'noKtp',
    width: '10%',
  },
  {
    title: 'Nama Pelanggan',
    dataIndex: 'customerName',
    key: 'customerName',
    width: '10%',
  },
  {
    title: 'Produk',
    dataIndex: 'produkName',
    key: 'produkName',
    width: '10%',
  },
  {
    title: 'Tgl Jatuh Tempo',
    dataIndex: 'tglJatuhTempo',
    key: 'tglJatuhTempo',
    width: '10%',
    render: tglJatuhTempo => moment(tglJatuhTempo).format('YYYY-MM-DD'),
  },
  {
    title: 'Status Transaksi',
    dataIndex: 'statusTransaksi',
    key: 'statusTransaksi',
    width: '10%',
  },
  {
    title: 'Action',
    align: 'center',
    key: 'action',
    width: '5%',
    render: record => (
      <Space size="middle">
        <Button
          type="primary"
          shape="square"
          size="small"
          onClick={() => routeDetailTransaksi(record.noTransaksi)}
        >
          Detail
        </Button>
      </Space>
    ),
  },
]

class DataTransaksiCicilan extends React.Component {
  formRef = React.createRef()

  state = {
    data: [],
  }

  componentDidMount() {
    console.log('Component did mount!')
    this.fetchAll()
  }

  fetchAll = () => {
    transaksi.doSearchAllTransaksi().then(data => {
      console.log(data)
      this.setState({
        data: data.responseData,
      })
    })
  }

  fetch = dataTransaksi => {
    transaksi.doSearchTransaksi(dataTransaksi).then(data => {
      console.log(data)
      this.setState({
        data: data.responseData,
      })
    })
  }

  onFinish = values => {
    console.log(values)
    this.fetch(values)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  onReset = () => {
    this.formRef.current.resetFields()
  }

  onChangeDateBegin = (date, dateString) => {
    console.log(date, dateString)
    this.formRef.current.setFieldsValue({
      trxDateBegin: dateString,
    })
  }

  onChangeDateEnd = (date, dateString) => {
    console.log(date, dateString)
    this.formRef.current.setFieldsValue({
      trxDateEnd: date,
    })
  }

  onChangeRouteNew = () => {
    const path = '/reya/transaksi/transaksi-cicilan-input'
    history.push(path)
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <Card title="Cari Data Transaksi" size="small">
          <Form
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 20 }}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="produkId" label="Kode Produk">
                  <Input placeholder="Kode Produk" maxLength="15" />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input placeholder="Nama Produk" maxLength="30" />
                </Form.Item>
                <Form.Item name="trxDateBegin" label="Tanggal Transaksi">
                  <Space direction="vertical">
                    <DatePicker format="YYYY-MM-DD" onChange={this.onChangeDateBegin} />
                  </Space>
                </Form.Item>
                <Form.Item name="trxDateEnd" label="s/d">
                  <Space direction="vertical">
                    <DatePicker format="YYYY-MM-DD" onChange={this.onChangeDateEnd} />
                  </Space>
                </Form.Item>
                <Form.Item name="nomor_transaksi" label="Nomor Transaksi">
                  <Input placeholder="Nomor Transaksi" maxLength="13" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="statusTransaksi" label="Status Transaksi">
                  <Select placeholder="Select a option and change input text above">
                    <Option key="A" value="A">
                      AKTIF
                    </Option>
                    <Option key="JTC" value="JTC">
                      JATUH TEMPO CICILAN
                    </Option>
                    <Option key="TB" value="TB">
                      TERLAMBAT BAYAR
                    </Option>
                    <Option key="JTT" value="JTT">
                      JATUH TEMPO TRANSAKSI
                    </Option>
                    <Option key="L" value="L">
                      LUNAS
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item name="noKtp" label="Nomor KTP">
                  <Input placeholder="Nomor KTP" maxLength="50" />
                </Form.Item>
                <Form.Item name="customerId" label="Id Pelanggan">
                  <Input placeholder="Id Pelanggan" maxLength="10" />
                </Form.Item>
                <Form.Item name="customerName" label="Nama Pelanggan">
                  <Input placeholder="Nama Pelanggan" maxLength="30" />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5 mr-2" htmlType="submit">
                    Cari
                  </Button>
                  <Button type="primary" className="btn btn-light px-5 mr-2" onClick={this.onReset}>
                    Kosongkan
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5"
                    onClick={this.onChangeRouteNew}
                  >
                    Transaksi Baru
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <hr />
        <Card title="Hasil Pencarian" size="small">
          <Table
            columns={columns}
            rowKey={record => record.noTransaksi}
            dataSource={data}
            size="small"
          />
        </Card>
      </div>
    )
  }
}

export default DataTransaksiCicilan
