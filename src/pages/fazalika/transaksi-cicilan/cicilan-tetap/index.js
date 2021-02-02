import React, { Component } from 'react'
import { Card, Form, Table, Input, Select, Button, DatePicker, Space } from 'antd'
import { withRouter } from 'react-router-dom'
import { history } from 'index'
import * as trx from 'services/transaction'


const { Option } = Select
const { RangePicker } = DatePicker

class CicilanTetap extends Component {
  columns = [
    {
      title: "No. Transaksi",
      dataIndex: 'noTransaksi',
      key: 'noTransaksi',
    },
    {
      title: "Tgl. Transaksi",
      dataIndex: 'tglTransaksi',
      key: 'tglTransaksi',
    },
    {
      title: "ID Pelanggan",
      dataIndex: 'customerId',
      key: 'idPelanggan',
    },
    {
      title: "No. KTP",
      dataIndex: 'noKtp',
      key: 'noKtp',
    },
    {
      title: "Nama Pelanggan",
      dataIndex: 'customerName',
      key: 'namaPelanggan',
    },
    {
      title: "Produk",
      dataIndex: 'produkName',
      key: 'produk',
    },
    {
      title: "Tgl Jatuh Tempo",
      dataIndex: 'tglJatuhTempo',
      key: 'tglJatuhTempo',
    },
    {
      title: "Status Transaksi",
      dataIndex: 'statusTransaksi',
      key: 'statusTransaksi',
    },
    {
      title: "Action",
      render: record => (
        <Space size="middle">
          <Button onClick={()=>this.detail(record.noTransaksi)}>
            Detail
          </Button>
        </Space>
      )
    }
  ]
  
  formRef = React.createRef()

  state = {
    data: [],
    loadingSave: false,
    pagination:{
      current: 1,
      pageSize: 20,
    }
  }

  detail = noTransaksi => {
    const path = "/cicilan-tetap/detail"
    history.push({pathname:path, state:{data:{"noTransaksi":noTransaksi}}})
  }

  onReset = () => {
    this.formRef.current.resetFields();
  }

  cari = (searchParameter) => {
    trx.doSearchTrx(searchParameter).then(dataResponse => {
      this.setState({
        data: dataResponse
      })
    })
  }

  toAddTxn = () => {
    const path = "/cicilan-tetap/new"
    history.push(path)
  }

  onFinish = values => {
    console.log(values)
    const searchParameter = {}
    for(let x = 0; x < Object.keys(values).length; x+=1){
      if(values[Object.keys(values)[x]] !== undefined){
        if(Object.keys(values)[x] === 'tglTransaksi'){
          searchParameter.trxDateBegin = values.tglTransaksi[0].format("yyyy-MM-DD")
          searchParameter.trxDateEnd = values.tglTransaksi[1].format("yyyy-MM-DD")
        } else {
          searchParameter[Object.keys(values)[x]] = values[Object.keys(values)[x]]
        }
      }
    }
    console.log(searchParameter)
    this.cari(searchParameter)
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  
  render() {
    const { data, loadingSave, pagination } = this.state
    return (
      <div>
        <Card title="Transaksi Cicilan Tetap" size="small">
          <Card title="Cari Data Transaksi" size="small">
            <Form
              layout="vertical"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-md-6">
                  <Form.Item name="productId" label="Kode Produk">
                    <Input />
                  </Form.Item>
                  <Form.Item name="productName" label="Nama Produk">
                    <Input />
                  </Form.Item>
                  <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                    <RangePicker />
                  </Form.Item>
                  <Form.Item name="noTransaksi" label="Nomor Transaksi">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="statusTransaksi" label="Status Transaksi">
                    <Select placeholder="Pilih Status Transaksi">
                      <Option value="AKTIF">AKTIF</Option>
                      <Option value="JATUH TEMPO CICILAN">JATUH TEMPO CICILAN</Option>
                      <Option value="TERLAMBAR BAYAR">TERLAMBAR BAYAR</Option>
                      <Option value="JATUH TEMPO TRANSAKSI">JATUH TEMPO TRANSAKSI</Option>
                      <Option value="LUNAS">LUNAS</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="noKtp" label="Nomor KTP">
                    <Input />
                  </Form.Item>
                  <Form.Item name="customerId" label="ID Pelanggan">
                    <Input />
                  </Form.Item>
                  <Form.Item name="customerName" label="Nama Pelanggan">
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
                      htmlType="submit"
                      loading={loadingSave}
                    >
                      Cari
                    </Button>
                    <Button
                      type="primary"
                      className="btn btn-light px-5 mr-2"
                      htmlType="button"
                      onClick={this.onReset}
                    >
                      Kosongkan
                    </Button>
                    <Button
                      type="primary"
                      className="btn btn-light px-5 mr-2"
                      htmlType="button"
                      onClick={this.toAddTxn}
                    >
                      Transaksi Baru
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
          <br />
          <Card title="Hasil Pencarian" size="small">
            <Table 
              columns={this.columns}
              rowKey={record => record.noTransaksi}
              pagination={pagination}
              dataSource={data}
            />
          </Card>
        </Card>
      </div>
    )
  }
}

export default withRouter(CicilanTetap)
