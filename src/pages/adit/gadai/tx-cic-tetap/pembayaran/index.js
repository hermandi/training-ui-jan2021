import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Select,
  Divider,
  notification,
  Upload,
  Modal,
  InputNumber,
} from 'antd'
import React, { Component } from 'react'
import { history } from 'index'
import * as pembayaranCicTetapService from 'services/gadai/transaksi/cicilan-tetap/pembayaran'
import DetailTransaksiCicTetap from '../detail'

const { Option } = Select

class PembayaranCicilanTetap extends Component {
  infTransaksiRef = React.createRef()

  dataPembayaranRef = React.createRef()

  state = {
    modalDetailVisible: false,
    loadingSave: false,
    simpanDisable: true,
    hitungDisable: false,

    daftarCicilan: [],
    cicilanSelectedRowKeys: [],

    cicilanSelectedRow: [],
    dataPembayaran: [],

    lengthStatusTagihanDibayar: 0,
    biayaAdminTutup: 0,
    buktiPembayaranBase64: '',
    actorId: 'user1', // hard code userId
  }

  constructor(props) {
    super(props)
    this.loadPembayaranCicilanTetap()
  }

  inputMonetaryFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  inputMonetaryParser = value => value.replace(/\$\s?|(,*)/g, '')

  loadPembayaranCicilanTetap = () => {
    const { actorId } = this.state

    pembayaranCicTetapService
      .doLoadPembayaranCicilan({
        noTransaksi: history.location.state.noTransaksi,
        actorId,
      })
      .then(result => {
        console.log(result)

        const data = result.responseData
        this.infTransaksiRef.current.setFieldsValue({
          custId: data.custId,
          custName: data.custName,
          noKtp: data.noKtp,
          noHp: data.noHp,
          tglTransaksi: data.tglTransaksi,
          noTransaksi: data.noTransaksi,
          produkId: data.produkId,
          produkName: data.produkName,
          produkDesc: data.produkDesc,
        })

        let lengthStatusTagihanDibayar = 0
        data.daftarCicilan.forEach(element => {
          if (element.statusCic === 'DIBAYAR') {
            lengthStatusTagihanDibayar += 1
          }
        })

        this.setState({
          daftarCicilan: data.daftarCicilan.sort((a, b) => a.cicilanKe - b.cicilanKe),
          lengthStatusTagihanDibayar,
          biayaAdminTutup: data.biayaAdminTutup,
        })
      })
  }

  onCicilanSelectChange = (selectedRowKeys, selectedRows) => {
    const { daftarCicilan, lengthStatusTagihanDibayar, biayaAdminTutup } = this.state
    this.setState({ cicilanSelectedRowKeys: selectedRowKeys })

    let totalTagihanYgDibayar = 0
    selectedRows.forEach(element => {
      totalTagihanYgDibayar += element.totalTagihan
    })

    let biayaTutup = 0
    if (selectedRowKeys.length + lengthStatusTagihanDibayar === daftarCicilan.length) {
      biayaTutup = biayaAdminTutup
    }

    this.setState({ cicilanSelectedRow: selectedRows })

    this.dataPembayaranRef.current.setFieldsValue({
      totalTagihanYgDibayar: this.inputMonetaryFormatter(totalTagihanYgDibayar),
      biayaAdminTutup: this.inputMonetaryFormatter(biayaTutup),
    })
  }

  hitungDataPembayaran = value => {
    const { actorId } = this.state

    pembayaranCicTetapService
      .doHitungPembayaranTrxCicTetap({
        noTransaksi: history.location.state.noTransaksi,
        totalTagihanYgDibayar: this.inputMonetaryParser(value.totalTagihanYgDibayar || '0'),
        biayaAdminTutup: this.inputMonetaryParser(value.biayaAdminTutup || '0'),
        diskonPembayaran: value.diskonPembayaran,
        totalPembayaranPelanggan: value.totalPembayaranPelanggan,
        metodePembayaran: value.metodePembayaran,
        actorId,
      })
      .then(result => {
        console.log(result)
        if (result.responseCode === '00') {
          const data = result.responseData
          this.setState({ dataPembayaran: data })
          this.dataPembayaranRef.current.setFieldsValue({
            totalTagihanYgDibayar: this.inputMonetaryFormatter(data.totalTagihanYgDibayar),
            biayaAdminTutup: this.inputMonetaryFormatter(data.biayaAdminTutup),
            diskonPembayaran: data.diskonPembayaran,
            diskonPembayaranRp: this.inputMonetaryFormatter(data.diskonPembayaranRp),
            totalTagihanAkhir: this.inputMonetaryFormatter(data.totalTagihanAkhir),
            totalPembayaranPelanggan: data.totalPembayaranPelanggan,
            metodePembayaran: data.metodePembayaran,
            kembalian: this.inputMonetaryFormatter(data.kembalian),
          })

          if (data.kembalian > 0) {
            this.setState({ simpanDisable: false })
          }
        } else {
          notification.error({
            message: 'Hitung Gagal',
            description: result.responseDescription,
          })
        }
      })
  }

  uploadBuktiPembayaran = option => {
    // customRequest
    console.log(option)
    let error = false
    if (option.file.type !== 'image/jpeg') {
      notification.error({
        message: 'Upload File Gagal',
        description: 'Format file tidak sesuai',
      })
      error = true
    } else if (option.file.size / 1024 / 1024 > 2) {
      notification.error({
        message: 'Upload File Gagal',
        description: 'Ukuran file lebih dari 2 MB',
      })
      error = true
    }

    if (error) {
      option.onError()
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(option.file)
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '')
        if (encoded.length % 4 > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4))
        }
        console.log(encoded)
        this.setState({ buktiPembayaranBase64: encoded })
        option.onSuccess()
      }
      reader.onerror = () => option.onError()
    }
  }

  setModalDetailVisible = visible => {
    this.setState({ modalDetailVisible: visible })
  }

  onClickProsesPembayaran = () => {
    const { cicilanSelectedRow, dataPembayaran, buktiPembayaranBase64 } = this.state
    this.setState({ loadingSave: true })

    if (dataPembayaran.metodePembayaran === 'TRANSFER' && buktiPembayaranBase64.length === 0) {
      notification.error({
        message: 'Proses Pembayaran Gagal',
        description: 'Metode Pembayaran Transfer membutuhkan bukti pembayaran',
      })
      this.setState({ loadingSave: false })
    } else {
      const data = dataPembayaran
      if (buktiPembayaranBase64.length > 0) {
        data.buktiBayar = buktiPembayaranBase64
      }
      data.daftarPembayaran = cicilanSelectedRow
      console.log(data)

      pembayaranCicTetapService.doSavePembayaranTrxCicTetap(data).then(result => {
        this.setState({ loadingSave: false })
        console.log(result)
        if (result.responseCode === '00') {
          notification.success({
            message: result.responseMessage,
            description: result.responseData.pembayaranId,
            duration: 0,
          })
          this.setState({ simpanDisable: true, hitungDisable: true })
        } else {
          notification.error({
            message: result.responseMessage,
            description: result.responseDescription,
          })
        }
      })
    }
  }

  render() {
    const {
      modalDetailVisible,
      loadingSave,
      simpanDisable,
      hitungDisable,
      daftarCicilan,
      cicilanSelectedRowKeys,
    } = this.state

    const tabelCicilanColumns = [
      {
        title: 'Cicilan Ke',
        key: 'cicilanKe',
        dataIndex: 'cicilanKe',
        width: '10%',
      },
      {
        title: 'Tgl Aktif Cicilan',
        key: 'tglAkTifCicilan',
        dataIndex: 'tglAktif',
      },
      {
        title: 'Pokok',
        key: 'pokok',
        dataIndex: 'pokok',
      },
      {
        title: 'Biaya Jasa Peny.',
        key: 'biayaJasaPeny',
        dataIndex: 'bunga',
      },
      {
        title: 'Denda',
        key: 'denda',
        dataIndex: 'denda',
      },
      {
        title: 'Total Tagihan',
        key: 'totalTagihan',
        dataIndex: 'totalTagihan',
      },
      {
        title: 'Status Tagihan',
        key: 'statusTagihan',
        dataIndex: 'statusCic',
      },
    ]

    const cicilanRowSelection = {
      cicilanSelectedRowKeys,
      onChange: this.onCicilanSelectChange,
      // hideSelectAll: true,
      getCheckboxProps: record => ({
        disabled: record.statusCic === 'BELUM AKTIF' || record.statusCic === 'DIBAYAR',
      }),
    }

    const inputReadonlyStyle = {
      backgroundColor: 'rgb(230, 230, 230)',
      width: '100%',
    }

    const dataPembayaranLayout = {
      labelCol: { span: 14 },
      wrapperCol: { span: 26 },
    }

    return (
      <div>
        <Modal
          visible={modalDetailVisible}
          width={1000}
          onCancel={() => this.setModalDetailVisible(false)}
          footer={[
            <Button
              className="btn btn-primary px-5"
              key="ok"
              onClick={() => this.setModalDetailVisible(false)}
            >
              OK
            </Button>,
          ]}
        >
          <DetailTransaksiCicTetap footerHide="true" />
        </Modal>

        <h3>Transaksi Cicilan Tetap - Pembayaran</h3>
        <Card size="small" title="Informasi Transaksi">
          <Form layout="vertical" ref={this.infTransaksiRef}>
            <div className="row">
              <div className="col-lg-6">
                <Form.Item name="custId" label="ID Pelanggan">
                  <Input placeholder="ID Pelanggan" style={{ ...inputReadonlyStyle }} readOnly />
                </Form.Item>
                <Form.Item name="custName" label="Nama Pelanggan">
                  <Input placeholder="Nama Pelanggan" style={{ ...inputReadonlyStyle }} readOnly />
                </Form.Item>
                <Form.Item name="noKtp" label="Nomor KTP">
                  <Input placeholder="Nomor KTP" style={{ ...inputReadonlyStyle }} readOnly />
                </Form.Item>
                <Form.Item name="noHp" label="Nomor HP">
                  <Input placeholder="Nomor HP" style={{ ...inputReadonlyStyle }} readOnly />
                </Form.Item>
                <Button
                  className="btn btn-secondary mt-4"
                  style={{ width: '100%' }}
                  onClick={() => this.setModalDetailVisible(true)}
                >
                  Lihat Detail Transaksi
                </Button>
              </div>
              <div className="col-lg-6">
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input
                    placeholder="Tanggal Transaksi"
                    style={{ ...inputReadonlyStyle }}
                    readOnly
                  />
                </Form.Item>
                <Form.Item name="noTransaksi" label="No Transaksi">
                  <Input placeholder="No Transaksi" style={{ ...inputReadonlyStyle }} readOnly />
                </Form.Item>
                <Form.Item name="produkId" label="Produk Transaksi">
                  <Input placeholder="Produk Transaksi" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input placeholder="Nama Produk" style={inputReadonlyStyle} readOnly />
                </Form.Item>
                <Form.Item name="produkDesc" label="Keterangan Produk">
                  <Input.TextArea
                    placeholder="Keterangan Produk"
                    rows="1"
                    style={inputReadonlyStyle}
                    readOnly
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
        <br />
        <Card size="small" title="Daftar Tagihan Pelanggan">
          <Table
            columns={tabelCicilanColumns}
            size="small"
            dataSource={daftarCicilan}
            rowKey={record => record.cicilanKe}
            rowSelection={cicilanRowSelection}
            rowClassName="disabled-row"
          />
        </Card>
        <br />
        <Card size="small" title="Data Pembayaran">
          <Form
            {...dataPembayaranLayout}
            layout="horizontal"
            ref={this.dataPembayaranRef}
            onFinish={this.hitungDataPembayaran}
          >
            <Form.Item name="totalTagihanYgDibayar" label="Total Tagihan yang ingin dibayar">
              <Input
                placeholder="Total Tagihan yang ingin dibayar"
                style={{ ...inputReadonlyStyle, textAlign: 'right' }}
                readOnly
              />
            </Form.Item>
            <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup (Khusus Pelunasan)">
              <Input
                placeholder="Biaya Admin Tutup (Khusus Pelunasan)"
                style={{ ...inputReadonlyStyle, textAlign: 'right' }}
                readOnly
              />
            </Form.Item>
            <Form.Item name="diskonPembayaran" label="Potongan / Diskon Pembayaran (%)">
              <InputNumber
                placeholder="Potongan / Diskon Pembayaran (%)"
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="diskonPembayaranRp" label="Diskon Pembayaran (Rp)">
              <Input
                placeholder="Diskon Pembayaran (Rp)"
                style={{ ...inputReadonlyStyle, textAlign: 'right' }}
                readOnly
              />
            </Form.Item>
            <Form.Item name="totalTagihanAkhir" label="Total Tagihan Akhir">
              <Input
                placeholder="Total Tagihan Akhir"
                style={{ ...inputReadonlyStyle, textAlign: 'right' }}
                readOnly
              />
            </Form.Item>
            <Form.Item name="totalPembayaranPelanggan" label="Total Pembayaran Pelanggan">
              <InputNumber
                placeholder="Total Pembayaran Pelanggan"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={0}
                max={999999999999999}
              />
            </Form.Item>
            <Form.Item name="metodePembayaran" label="Metode Pembayaran">
              <Select placeholder="Pilih Metode Pembayaran">
                <Option key="CASH" value="CASH">
                  CASH
                </Option>
                <Option key="TRANSFER" value="TRANSFER">
                  TRANSFER
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="kembalian" label="Kembalian">
              <Input
                placeholder="Kembalian"
                style={{ ...inputReadonlyStyle, textAlign: 'right' }}
                readOnly
              />
            </Form.Item>
            <Form.Item label="Bukti Pembayaran (Max. 2 MB)">
              <Upload
                listType="picture"
                maxCount={1}
                accept=".jpg, .jpeg"
                customRequest={this.uploadBuktiPembayaran}
              >
                <Button type="primary">Upload Bukti Pembayaran</Button>
              </Upload>
              <Divider className="mb-1" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="px-5 float-right"
              disabled={hitungDisable}
            >
              Hitung
            </Button>
          </Form>
        </Card>
        <br />
        <Button
          className="btn btn-primary px-5 mr-2 float-right"
          disabled={simpanDisable}
          loading={loadingSave}
          onClick={() => this.onClickProsesPembayaran()}
        >
          Proses Pembayaran
        </Button>
        <Button
          className="btn btn-secondary px-5 mr-2 float-right"
          onClick={() => history.goBack()}
        >
          Kembali
        </Button>
        <br />
      </div>
    )
  }
}

export default PembayaranCicilanTetap
