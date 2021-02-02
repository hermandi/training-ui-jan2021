import React from 'react'
import moment from 'moment'
import {
  Card,
  Modal,
  Table,
  Input,
  Form,
  Button,
  Space,
  Checkbox,
  InputNumber,
  notification,
  Select,
  Upload,
} from 'antd'
import * as transaksi from 'services/transaksi'
import { withRouter } from 'react-router'
import { history } from 'index'
import DetailTransaksiCicilan from '../detail-transaksi-cicilan'

const { Option } = Select

class PembayaranTransaksiCicilan extends React.Component {
  formTransaksi = React.createRef()

  formBayar = React.createRef()

  state = {
    totalTagihanYgDibayar: 0,
    diskonPembayaranPersen: 0,
    totalPembayaran: 0,
    metodePembayaran: '',
    buktiBayar: '',
    noTransaksi: '',
    dataTagihan: [],
    daftarPembayaran: [],
    pembayaranButton: true,
    buktiButton: true,
    modalVisible: false,
  }

  columnsDenda = [
    {
      title: 'Cic Ke',
      dataIndex: 'cicilanKe',
      key: 'cicilanKe',
      width: '15%',
    },
    {
      title: 'Tgl Aktif',
      dataIndex: 'tglAktif',
      key: 'tglAktif',
      width: '15%',
    },
    {
      title: 'Tgl Jatuh Tempo',
      dataIndex: 'tglJatuhTempo',
      key: 'tglJatuhTempo',
      width: '15%',
    },
    {
      title: 'Pokok',
      dataIndex: 'pokok',
      key: 'pokok',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Biaya Jasa Penyimpanan',
      dataIndex: 'totalBiayaJp',
      key: 'totalBiayaJp',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Denda',
      dataIndex: 'denda',
      key: 'denda',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Total',
      key: 'total',
      align: 'right',
      width: '15%',
      render: record => (
        <Space size="middle">{record.denda + record.pokok + record.totalBiayaJp}</Space>
      ),
    },
    {
      title: 'Status Tagihan',
      dataIndex: 'statusCic',
      key: 'statusCic',
      width: '15%',
    },
    {
      title: 'Action',
      align: 'center',
      key: 'action',
      width: '5%',
      render: record => (
        <Space size="middle">
          <Checkbox
            onChange={() => this.onClickTagihan(record)}
            disabled={this.disabledTagihan(record)}
          />
        </Space>
      ),
    },
  ]

  componentDidMount() {
    this.setState({ noTransaksi: history.location.state.noTransaksi })
    this.fetchPembayaran(history.location.state.noTransaksi)
  }

  fetchPembayaran = noTransaksi => {
    transaksi.doGetPembayaran(noTransaksi).then(data => {
      const dataTagihan = data.responseData.tagihan

      this.setState({
        dataTagihan,
      })

      this.formTransaksi.current.setFieldsValue({
        noTransaksi: data.responseData.detailTransaksi.noTransaksi,
        customerId: data.responseData.detailTransaksi.customerId,
        customerName: data.responseData.detailTransaksi.customerName,
        noKtp: data.responseData.detailTransaksi.noKtp,
        noHp: data.responseData.detailTransaksi.noHp,
        tglPembayaran: moment().format('YYY-MM-DD'),
        tglTransaksi: moment(data.responseData.detailTransaksi.tglTransaksi).format('YYYY-MM-DD'),
        productId: data.responseData.detailTransaksi.productId,
        produkName: data.responseData.detailTransaksi.produkName,
        produkDesc: data.responseData.detailTransaksi.produkDesc,
      })
    })
  }

  onClickTagihan = record => {
    const { daftarPembayaran, totalTagihanYgDibayar } = this.state
    let totalTagihan = 0
    let data = daftarPembayaran
    const dataLen = daftarPembayaran.length
    if (dataLen < 1) {
      totalTagihan = totalTagihanYgDibayar + (record.denda + record.pokok + record.totalBiayaJp)
      data = [{ cicilanKe: record.cicilanKe }]
    } else {
      const obj = daftarPembayaran.find(o => o.cicilanKe === record.cicilanKe)
      if (obj === undefined) {
        totalTagihan = totalTagihanYgDibayar + (record.denda + record.pokok + record.totalBiayaJp)
        const dataBaru = { cicilanKe: record.cicilanKe }
        data.push(dataBaru)
      } else {
        totalTagihan = totalTagihanYgDibayar - (record.denda + record.pokok + record.totalBiayaJp)
        data = data.filter(pembayaran => pembayaran.cicilanKe !== record.cicilanKe)
      }
    }
    this.setState({ daftarPembayaran: data, totalTagihanYgDibayar: totalTagihan })
    this.formBayar.current.setFieldsValue({
      totalTagihanYgDibayar: totalTagihan,
    })
  }

  disabledTagihan = record => {
    if (record.statusCic === 'BELUM AKTIF' || record.statusCic === 'DIBAYAR') {
      return true
    }
    return false
  }

  onHitung = values => {
    this.hitungPembayaran(values)
  }

  onDetailOpen = () => {
    this.setState({ modalVisible: true })
  }

  onDetailClose = () => {
    this.setState({ modalVisible: false })
  }

  hitungPembayaran = dataPembayaran => {
    let pembayaranLunas = true
    transaksi.doHitungPembayaran(dataPembayaran).then(data => {
      if (data.responseCode === '00') {
        if (data.responseData.kembalian >= 0) {
          pembayaranLunas = false
        }
        this.setState({
          diskonPembayaranPersen: data.responseData.diskonPembayaranPersen,
          totalPembayaran: data.responseData.totalPembayaran,
          pembayaranButton: pembayaranLunas,
        })
        this.formBayar.current.setFieldsValue({
          diskonPembayaran: data.responseData.diskonPembayaran,
          totalTagihanAkhir: data.responseData.totalTagihanAkhir,
          kembalian: data.responseData.kembalian,
        })
        notification.success({
          message: 'Hitung berhasil!',
          description: 'Berhasil melakukan perhitungan!',
        })
      } else {
        notification.error({
          message: 'Hitung gagal!',
          description: 'Gagal melakukan perhitungan, harap hubungi teknisi',
        })
      }
    })
  }

  checkBukti = values => {
    if (values === 'TRANSFER') {
      this.setState({ buktiButton: false, metodePembayaran: values, pembayaranButton: true })
    } else {
      this.setState({ buktiButton: true, metodePembayaran: values, buktiBayar: '' })
    }
  }

  removeBukti = () => {
    this.setState({ buktiBayar: '', pembayaranButton: true })
  }

  requestBukti = ({ onSuccess, onError, file }) => {
    const isJpg = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2
    if (isLt2M && isJpg) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = e => {
        this.setState({ buktiBayar: e.target.result, pembayaranButton: false })
        notification.success({
          message: 'Berhasil mengupload file!',
          description: 'File berhasil diupload!',
        })
        setTimeout(() => {
          onSuccess('Ok')
        }, 0)
      }
    } else {
      notification.error({
        message: 'Gagal mengupload file!',
        description: 'Ukuran file melebihi 2MB / File bukan jpeg!',
      })
      setTimeout(() => {
        onError('Failed')
      }, 0)
      this.setState({ pembayaranButton: true })
    }
  }

  onUploadBukti = info => {
    const { buktiBayar } = this.state
    console.log(info.file)
    console.log(buktiBayar)
  }

  saveTransaksi = () => {
    const {
      noTransaksi,
      totalTagihanYgDibayar,
      diskonPembayaranPersen,
      totalPembayaran,
      metodePembayaran,
      buktiBayar,
      daftarPembayaran,
    } = this.state
    console.log(diskonPembayaranPersen)
    transaksi
      .doSavePembayaranCicTetap(
        noTransaksi,
        totalTagihanYgDibayar,
        diskonPembayaranPersen,
        totalPembayaran,
        metodePembayaran,
        buktiBayar,
        daftarPembayaran,
      )
      .then(data => {
        console.log(data)
        if (data.responseCode === '00') {
          this.fetchPembayaran(noTransaksi)
          notification.success({
            message: 'Proses Pembayaran berhasil!',
            description: 'Sudah berhasil meyimpan transaksi baru!',
          })
        } else {
          notification.error({
            message: 'Proses Pembayaran gagal!',
            description: data.responseMessage,
          })
        }
      })
  }

  render() {
    const {
      totalTagihanYgDibayar,
      diskonPembayaranPersen,
      totalPembayaran,
      dataTagihan,
      pembayaranButton,
      buktiButton,
      modalVisible,
    } = this.state
    return (
      <div>
        <Card title="Informasi Transaksi" size="small">
          <Form layout="horizontal" ref={this.formTransaksi} labelCol={{ span: 8 }}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="customerId" label="ID Pelanggan">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="customerName" label="Nama Pelanggan">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="noKtp" label="No KTP">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="noHp" label="Nomor HP">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item />
                <Form.Item>
                  <Button type="primary" className="btn btn-light px-5" onClick={this.onDetailOpen}>
                    Lihat Detail Transaksi
                  </Button>
                  <Modal
                    title="Detail Transaksi"
                    visible={modalVisible}
                    onOk={this.onDetailClose}
                    onCancel={this.onDetailClose}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    width={1500}
                  >
                    <DetailTransaksiCicilan isModal={1} />
                  </Modal>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="tglPembayaran" label="Tgl Pembayaran">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="tglTransaksi" label="Tgl Transaksi">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="productId" label="Produk Transaksi">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
                <Form.Item name="produkDesc" label="Keterangan Produk">
                  <Input style={{ color: 'black', width: '50%' }} disabled />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <Card title="Daftar Tagihan Pelanggan" size="small">
          <Table
            columns={this.columnsDenda}
            rowKey={record => record.cicilanKe}
            pagination={{ defaultPageSize: 5 }}
            dataSource={dataTagihan}
            scroll={{ x: 400 }}
            size="small"
          />
        </Card>
        <Card title="Data Pembayaran" size="small">
          <Form
            layout="horizontal"
            onFinish={this.onHitung}
            ref={this.formBayar}
            labelCol={{ span: 12 }}
          >
            <div className="row">
              <div className="col-md-6" />
              <div className="col-md-6">
                <Form.Item
                  name="totalTagihanYgDibayar"
                  label="Total Tagihan yang ingin dibayar"
                  initialValue={totalTagihanYgDibayar}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="biayaAdmTutupLunas"
                  label="Biaya Admin Tutup (Khusus Pelunasan)"
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="diskonPembayaranPersen"
                  label="Potongan / Diskon Pembayaran (%)"
                  initialValue={diskonPembayaranPersen}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Form.Item
                  name="diskonPembayaran"
                  label="Diskon Pembayaran ( Rp )"
                  initialValue={diskonPembayaranPersen}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="totalTagihanAkhir" label="Total Tagihan Akhir" initialValue={0}>
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="totalPembayaran"
                  label="Total Pembayaran dari Pelanggan"
                  initialValue={totalPembayaran}
                >
                  <InputNumber
                    style={{ width: '50%' }}
                    min={0}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Form.Item name="metodePembayaran" label="Metode Pembayaran">
                  <Select
                    placeholder="Pilih metode pembayaran"
                    style={{ width: '75%' }}
                    onChange={value => this.checkBukti(value)}
                  >
                    <Option key="C" value="CASH">
                      CASH
                    </Option>
                    <Option key="T" value="TRANSFER">
                      TRANSFER
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item name="kembalian" label="Kembalian" initialValue={0}>
                  <InputNumber
                    style={{ width: '50%' }}
                    max={999999999999999}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled
                  />
                </Form.Item>
                <Form.Item>
                  <Upload
                    name="buktiTransfer"
                    listType="picture"
                    maxCount={1}
                    customRequest={this.requestBukti}
                    onChange={this.onUploadBukti}
                    onRemove={this.removeBukti}
                    accept="image/jpeg"
                  >
                    <Button disabled={buktiButton}>Upload Bukti Pembayaran</Button>
                  </Upload>
                </Form.Item>
              </div>
              <Button className="btn btn-light px-5 mr-2" onClick={() => history.goBack()}>
                Kembali
              </Button>
              <Button type="primary" className="btn btn-light mr-2" htmlType="submit">
                Hitung
              </Button>
              <Button
                type="primary"
                className="btn btn-light px-5"
                onClick={() => this.saveTransaksi()}
                disabled={pembayaranButton}
              >
                Proses Pembayaran
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    )
  }
}

export default withRouter(PembayaranTransaksiCicilan)
