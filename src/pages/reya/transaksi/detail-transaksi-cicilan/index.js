import React from 'react'
import moment from 'moment'
import * as transaksi from 'services/transaksi'
import { Card, Form, Input, InputNumber, Button, Table } from 'antd'
import { withRouter } from 'react-router'
import { history } from 'index'

class DetailTransaksiCicilan extends React.Component {
  formRef = React.createRef()

  columnsBarangGadai = [
    {
      title: 'No',
      dataIndex: 'noBarang',
      key: 'noBarang',
      width: '15%',
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      key: 'namaBarang',
      width: '15%',
    },
    {
      title: 'Kondisi',
      dataIndex: 'deskripsiBarang',
      key: 'deskripsiBarang',
      width: '15%',
    },
    {
      title: 'Jlh Barang',
      dataIndex: 'jlhBrg',
      key: 'jlhBrg',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Harga Per Satuan',
      dataIndex: 'harga',
      key: 'harga',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: '15%',
    },
  ]

  constructor(props) {
    super(props)
    const pr = this.props
    console.log(this.props)
    if (pr.isModal === 1) {
      console.log('Ini Modal!')
    }
  }

  state = {
    noTransaksi: '',
    dataBarang: [],
    buttonVisible: '',
    loadingData: false,
  }

  componentDidMount() {
    const { isModal } = this.props
    console.log(isModal)
    if (isModal === 1) {
      this.setState({ noTransaksi: history.location.state.noTransaksi, buttonVisible: 'none' })
    } else {
      this.setState({ noTransaksi: history.location.state.noTransaksi })
    }
    this.fetchTransaksi(history.location.state.noTransaksi)
  }

  fetchTransaksi = noTransaksi => {
    this.setState({ loadingData: true })
    transaksi.doDetailTransaksi(noTransaksi).then(data => {
      console.log(data.responseData)
      const biayaJPperPeriode =
        data.responseData.dataTransaksi.totalBiayaJp / data.responseData.dataTransaksi.jangkaWaktu
      this.setState({
        dataBarang: data.responseData.dataBarang,
        loadingData: false,
      })
      this.formRef.current.setFieldsValue({
        noTransaksi: data.responseData.dataTransaksi.noTransaksi,
        customerId: data.responseData.dataTransaksi.customerId,
        productId: data.responseData.dataTransaksi.productId,
        tglTransaksi: moment(data.responseData.dataTransaksi.tglTransaksi).format('YYYY-MM-DD'),
        tglJatuhTempo: moment(data.responseData.dataTransaksi.tglJatuhTempo).format('YYYY-MM-DD'),
        totalNilaiTaksiran: data.responseData.dataTransaksi.totalNilaiTaksiran,
        ltv: data.responseData.dataTransaksi.ltv,
        maksPinjaman: data.responseData.dataTransaksi.maksPinjaman,
        nilaiPencairan: data.responseData.dataTransaksi.nilaiPencairan,
        biayaAdminBuka: data.responseData.dataTransaksi.biayaAdminBuka,
        discBiayaAdm: data.responseData.dataTransaksi.discBiayaAdm,
        biayaAdmAkhir: data.responseData.dataTransaksi.biayaAdmAkhir,
        totalPinjaman: data.responseData.dataTransaksi.totalPinjaman,
        biayaJasaPenyimpanan: data.responseData.dataTransaksi.biayaJasaPenyimpanan,
        biayaJPperPeriode,
        periodeJasaPenyimpanan: data.responseData.dataTransaksi.periodeJasaPenyimpanan,
        totalBiayaJp: data.responseData.dataTransaksi.totalBiayaJp,
        biayaAdminTutup: data.responseData.dataTransaksi.biayaAdminTutup,
        totalPengembalian: data.responseData.dataTransaksi.totalPengembalian,
      })
    })
  }

  routePembayaran = noTransaksi => {
    const path = '/reya/transaksi/transaksi-cicilan-pembayaran'
    history.push({
      pathname: path,
      state: { noTransaksi },
    })
  }

  render() {
    const { noTransaksi, dataBarang, loadingData, buttonVisible } = this.state
    return (
      <div>
        <Card title="Detail Barang" size="small" loading={loadingData}>
          <Table
            columns={this.columnsBarangGadai}
            rowKey={record => record.noBarang}
            pagination={{ defaultPageSize: 5 }}
            dataSource={dataBarang}
            scroll={{ x: 400 }}
            size="small"
          />
        </Card>
        <Card title="Detail Transaksi" size="small" loading={loadingData}>
          <Form
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
            labelCol={{ span: 8 }}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="productId" label="Id Produk">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="totalNilaiTaksiran" label="Total Nilai Taksiran">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="ltv" label="LTV % ">
                  <InputNumber
                    style={{ width: '25%' }}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="maksPinjaman" label="Maksimal Nilai Pinjaman">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="nilaiPencairan" label="Nilai Pencairan Pelanggan">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="biayaAdminBuka" label="Biaya Admin Buka">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="discBiayaAdm" label="Diskon Adm. Buka">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="biayaAdmAkhir" label="Biaya Admin Akhir">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalPinjaman" label="Total Nilai Pinjaman">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="customerId" label="Id Customer">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="tglJatuhTempo" label="Tanggal Jatuh Tempo">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="biayaJasaPenyimpanan" label="Biaya Jasa Penyimpanan">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="per">
                  <Form.Item name="periodeJasaPenyimpanan" noStyle>
                    <InputNumber
                      style={{ width: '15%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled
                    />
                  </Form.Item>
                  <span> Bulan </span>
                </Form.Item>
                <Form.Item name="biayaJPperPeriode" label="Biaya Jasa Penyimpanan / Periode">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalBiayaJp" label="Total Biaya Jasa Penyimpanan">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalPengembalian" label="Total Pengembalian">
                  <InputNumber
                    style={{ width: '50%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item />
              </div>
            </div>
          </Form>
        </Card>
        <Button
          type="primary"
          className="btn btn-light px-5"
          style={{ float: 'right', display: buttonVisible }}
          onClick={() => this.routePembayaran(noTransaksi)}
        >
          Pembayaran
        </Button>
        <Button
          name=""
          className="btn btn-light px-5"
          style={{ display: buttonVisible }}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
      </div>
    )
  }
}

export default withRouter(DetailTransaksiCicilan)
