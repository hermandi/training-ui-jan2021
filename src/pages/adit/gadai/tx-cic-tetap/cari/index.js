import { Card, Form, Input, InputNumber, Select, DatePicker, Button, Table, Space } from 'antd'
import React, { Component } from 'react'
import * as txCicilanTetapService from 'services/gadai/transaksi/cicilan-tetap'
import { history } from 'index'

const { Option } = Select
const { RangePicker } = DatePicker

class CariTransaksiCicTetap extends Component {
  cariDataRef = React.createRef()

  state = {
    loadingSearch: false,
    actorId: 'user1',
    dataHasilPencarian: [],
  }

  cariDataTransaksi = value => {
    const { actorId } = this.state
    this.setState({ loadingSearch: true })

    let trxDateBegin
    let trxDateEnd

    if (value.trxDate !== undefined) {
      trxDateBegin = value.trxDate[0].format('YYYY-MM-DD')
      trxDateEnd = value.trxDate[1].format('YYYY-MM-DD')
    }

    if (value.noTransaksi == null) {
      value.noTransaksi = undefined
    }

    const dataCari = {
      produkId: value.produkId,
      produkName: value.produkName,
      trxDateBegin,
      trxDateEnd,
      statusTrans: value.statusTrans,
      noKtp: value.noKtp,
      custId: value.custId,
      custName: value.custName,
      noTransaksi: value.noTransaksi,
      actorId,
    }
    console.log(dataCari)

    txCicilanTetapService.doSearchTransCicTetap(dataCari).then(result => {
      console.log(result)
      this.setState({ loadingSearch: false })
      if (result.responseCode === '00') {
        const data = result.responseData
        data.forEach(element => {
          element.tglTransaksi = element.tglTransaksi.slice(0, 10)
          element.tglJatuhTempo = element.tglJatuhTempo.slice(0, 10)
        })
        this.setState({ dataHasilPencarian: data })
      }
    })
  }

  onKosongkanFormCariData = () => {
    this.cariDataRef.current.resetFields()
  }

  onActionDetail = record => {
    console.log(record.noTransaksi)
    const path = '/adit/gadai/transaksi/cicilan-tetap/detail'
    const { noTransaksi } = record
    history.push(path, { noTransaksi })
  }

  render() {
    const { loadingSearch, dataHasilPencarian } = this.state

    const tableColumns = [
      {
        title: 'No Transaksi',
        dataIndex: 'noTransaksi',
        key: 'noTransaksi',
      },
      {
        title: 'Tgl Transaksi',
        dataIndex: 'tglTransaksi',
        key: 'tglTranskasi',
      },
      {
        title: 'ID Pelanggan',
        dataIndex: 'customerId',
        key: 'idPelanggan',
      },
      {
        title: 'Nomor KTP',
        dataIndex: 'noKtp',
        key: 'noKtp',
      },
      {
        title: 'Nama Pelanggan',
        dataIndex: 'customerName',
        key: 'namaPelanggan',
      },
      {
        title: 'Produk',
        dataIndex: 'produkName',
        key: 'produk',
      },
      {
        title: 'Tgl Jatuh Tempo',
        dataIndex: 'tglJatuhTempo',
        key: 'tglJatuhTempo',
      },
      {
        title: 'Status Transaksi',
        dataIndex: 'statusTransaksi',
        key: 'statusTransaksi',
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <Space size="middle">
            <Button type="primary" onClick={() => this.onActionDetail(record)} size="small">
              Detail
            </Button>
          </Space>
        ),
      },
    ]

    const statusTransaksiList = [
      'AKTIF',
      'JATUH TEMPO CICILAN',
      'TERLAMBAT BAYAR',
      'JATUH TEMPO TRANSAKSI',
      'LUNAS',
    ]
    return (
      <div>
        <h3>Transaksi Cicilan Tetap</h3>
        <Card title="Cari Data Transaksi" size="small">
          <Form layout="vertical" ref={this.cariDataRef} onFinish={this.cariDataTransaksi}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="produkId" label="Kode Produk">
                  <Input placeholder="Kode Produk" />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input placeholder="Nama Produk" />
                </Form.Item>
                <Form.Item name="trxDate" label="Tanggal Transaksi">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input placeholder="Nomor Transaksi" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="statusTrans" label="Status Transaksi">
                  <Select placeholder="Select a option and change input text above">
                    {statusTransaksiList.map(status => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="noKtp" label="Nomor KTP">
                  <InputNumber placeholder="Nomor KTP" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="custId" label="ID Pelanggan">
                  <Input placeholder="Nama Pelanggan" />
                </Form.Item>
                <Form.Item name="custName" label="Nama Pelanggan">
                  <Input placeholder="Nama Pelanggan" />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    htmlType="submit"
                    loading={loadingSearch}
                  >
                    Cari
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    onClick={this.onKosongkanFormCariData}
                  >
                    Kosongkan
                  </Button>
                  <Button
                    type="primary"
                    className="btn btn-light px-5 mr-2"
                    onClick={() => history.push('/adit/gadai/transaksi/cicilan-tetap/baru')}
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
            size="small"
            columns={tableColumns}
            dataSource={dataHasilPencarian}
            rowKey={record => record.noTransaksi}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
            }}
          />
        </Card>
      </div>
    )
  }
}

export default CariTransaksiCicTetap
