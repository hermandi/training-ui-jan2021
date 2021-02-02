import React, { Component } from 'react'
import { Form, Input, Card, Button } from 'antd'
import { history } from 'index'
import * as trx from 'services/transaction'


class CicilanTetapDetail extends Component {
  formRef = React.createRef()

  state = {
    kodeTrx: '',
    footerStyle:{},
  }

  constructor(props){
    super(props)

    console.log("success")
  }

  componentDidMount(){
    const {footerHide} = this.props
    if(footerHide){
      this.setState({
        footerStyle:{display:'none'}
      })
    }
    this.setState({
      kodeTrx: history.location.state.data.noTransaksi
    },
    ()=>{
      this.fetchTrxDetail(history.location.state.data)
    })
  }

  back = () => {
    history.goBack()
  }

  pembayaran = () => {
    const { kodeTrx } = this.state
    const path = "/cicilan-tetap/pembayaran"
    history.push({pathname:path, state:{data:{"noTransaksi":kodeTrx}}})
  }

  fetchTrxDetail = trxCode => {
    const { kodeTrx } = this.state
    trx.doGetDetailTrx(trxCode).then(data=>{
      this.formRef.current.setFieldsValue({
        noTransaksi: kodeTrx,
        customerId: data[0].customerId,
        tglTransaksi: data[0].tglTransaksi,
        produkId: data[0].productId,
        noKtp: data[0].noKtp,
        customerName: data[0].customerName,
        produkName: data[0].produkName,
        ltv: data[0].ltv,
        jangkaWaktu: data[0].jangkaWaktu,
        tipeAdminBuka: data[0].tipeAdminBuka,
        biayaAdminBuka: data[0].biayaAdminBuka,
        tipeAdminTutup: data[0].tipeAdminTutup,
        biayaAdminTutup: data[0].biayaAdminTutup,
        biayaJasaPenyimpanan: data[0].biayaJasaPenyimpanan,
        biayaJasaPenyimpananPeriode: data[0].biayaJasaPenyimpananPeriode,
        periodeJasaPenyimpanan: data[0].periodeJasaPenyimpanan,
        biayaKeterlambatan: data[0].biayaKeterlambatan,
        periodeBiayaKeterlambatan: data[0].periodeBiayaKeterlambatan,
        totalNilaiTaksiran: data[0].totalNilaiTaksiran,
        maksPinjaman: data[0].maksPinjaman,
        nilaiPencairan: data[0].nilaiPencairan,
        discBiayaAdm: data[0].discBiayaAdm,
        biayaAdmAkhir: data[0].biayaAdmAkhir,
        totalPinjaman: data[0].totalPinjaman,
        tglJatuhTempo: data[0].tglJatuhTempo,
        discBiayaJp: data[0].discBiayaJp,
        totalBiayaJp: data[0].totalBiayaJp,
        totalPengembalian: data[0].totalPengembalian,
        statusTransaksi: data[0].statusTransaksi,
        createdBy: data[0].createdBy,
        createdDate: data[0].createdDate,
        updatedBy: data[0].updatedBy,
        updatedDate: data[0].updatedDate,
        deletedBy: data[0].deletedBy,
        deletedDate: data[0].deletedDate,
      })
    })
  }
  

  render(){
    const { footerStyle } = this.state
    return(
      <div>
        <Card title="Transaksi Cicilan Tetap Detail" size="small">
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item name="noTransaksi" label="Nomor Transaksi">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="customerId" label="ID Pelanggan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="produkId" label="ID Produk">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="noKtp" label="Nomor KTP">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="customerName" label="Nama Pelanggan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="produkName" label="Nama Produk">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="ltv" label="LTV">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="jangkaWaktu" label="Jangka Waktu">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="tipeAdminBuka" label="Tipe Admin Buka">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaAdminBuka" label="Biaya Admin Buka">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="tipeAdminTutup" label="Tipe Admin Tutup">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaJasaPenyimpanan" label="Biaya Jasa Penyimpanan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaJasaPenyimpananPeriode" label="Biaya Jasa Penyimpanan Periode">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="periodeJasaPenyimpanan" label="Periode Jasa Penyimpanan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaKeterlambatan" label="Biaya Keterlambatan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="periodeBiayaKeterlambatan" label="Periode Biaya Keterlambatan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item name="totalNilaiTaksiran" label="Total Nilai Taksiran">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="maksPinjaman" label="Maksimal Pinjaman">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="nilaiPencairan" label="Nilai Pencairan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="discBiayaAdm" label="Diskon Biaya Admin">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="biayaAdmAkhir" label="Biaya Admin Akhir">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="totalPinjaman" label="Total Pinjaman">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="tglJatuhTempo" label="Tanggal Jatuh Tempo">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="discBiayaJp" label="Diskon Biaya Jasa Penyimpanan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="totalBiayaJp" label="Total Biaya Jasa Penyimpanan">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="totalPengembalian" label="Total Pengembalian">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="statusTransaksi" label="Status Transaksi">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="createdDate" label="Created Date">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="createdBy" label="Created By">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="updatedDate" label="Updated Date">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="updatedBy" label="Updated By">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="deletedDate" label="Deleted Date">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
                <Form.Item name="deletedBy" label="Deleted By">
                  <Input readOnly style={{ width: 250 }} />
                </Form.Item>
              </div>
            </div>
          </Form>
          <div style={footerStyle}>
            <Button onClick={this.back}>
              Kembali
            </Button>
            <Button onClick={this.pembayaran}>
              Pembayaran
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default CicilanTetapDetail
