import React, { Component } from 'react'
import { Form, Input, Card, Button, Table, Select, Checkbox, Space, Upload, Modal, notification } from 'antd'
import { history } from 'index'
import Moment from 'moment'
import * as trx from 'services/transaction'
import { UploadOutlined } from '@ant-design/icons'
import CicilanTetapDetail from 'pages/fazalika/transaksi-cicilan/cicilan-tetap-detail'

const { Option } = Select

class CicilanTetapPembayaran extends Component {
  // Columns Preparation --BEGIN--
  fileList = [];

  columns = [
    {
      title: "Cic Ke",
      dataIndex: "cicilanKe",
      key: "cicilanKe",
    },
    {
      title: "Tgl Aktif Cic",
      dataIndex: "tglAktif",
      key: "",
    },
    {
      title: "Tgl Jatuh Tempo",
      dataIndex: "tglJatuhTempo",
      key: "",
    },
    {
      title: "Pokok",
      dataIndex: "pokok",
      key: "",
    },
    {
      title: "B. Jasa Peny",
      dataIndex: "bunga",
      key: "",
    },
    {
      title: "Denda",
      dataIndex: "biayaDenda",
      key: "",
    },
    {
      title: "Total Tagihan",
      dataIndex: "totalTagihan",
      key: "",
    },
    {
      title: "Status Tagihan",
      dataIndex: "statusCic",
      key: "",
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (e) => {
        const { loadedData } = this.state
        if ((e.statusCic === "AKTIF" && loadedData[e.cicilanKe-1].rowDisabled === false) || (e.statusCic === "TERLAMBAT" && loadedData[e.cicilanKe-1].rowDisabled === false)) {
          return(
            <Space size="middle">
              <Checkbox onChange={(checkboxState)=>this.checked(checkboxState, e.cicilanKe)} />
            </Space>
          );
        }

        if (e.statusCic === "DIBAYAR"){
          return(
            <Space size="middle">
              <Checkbox disabled checked />
            </Space>
          );
        }
        return(
          <Space size="middle">
            <Checkbox disabled checked={false} />
          </Space>
        );
      }
    },
  ]
  // Columns Preparation --END--

  // input styling
  inputStyling = {
    width: 250,
  }

  // Reference Definition
  formRefCIT = React.createRef()

  formRefCDP = React.createRef()

  formRefModal = React.createRef()

  // Form layout const
  layoutCIT = {
    labelCol: { span: 6 },
    wrapperCol: { span: 6},
  };

  layoutCDP = {
    labelCol: { span: 6, offset: 12 },
    wrapperCol: { span: 6},
  };

  tailLayoutCDP = {
    wrapperCol: {
      offset: 18,
    }
  }

  // State
  state = {
    noTransaksi: '',
    totalTagihan: 0,
    diskonPembayaran:0,
    tglBayar:'',
    totalPembayaran: 0,
    metodeBayar: '',
    loadedData: [],
    counter: 0,
    buktiBayar: '',
    daftarPembayaran: [],
    buttonPayment: true,
  }

  // ComponentDidMount
  componentDidMount(){
    this.setState({
      noTransaksi: history.location.state.data.noTransaksi
    }, ()=>{
      this.fetchDetail(history.location.state.data)
      this.loadPayment(history.location.state.data)
    })
  }

  // Block Handle Event --Begin
  fetchDetail = (loadParameter) => {
    trx.doGetDetailTrx(loadParameter).then(data=>{
      this.formRefCIT.current.setFieldsValue({
        customerId: data[0].customerId,
        customerName: data[0].customerName,
        noKtp: data[0].noKtp,
        noHp: data[0].noHp,
        tglBayar: Moment(Date()).format("yyyy-MM-DD"),
        tglTransaksi: data[0].tglTransaksi,
        noTransaksi: data[0].noTransaksi,
        produkId:data[0].productId,
        produkName: data[0].produkName,
        produkDesc:data[0].produkDesc
      })
    }
      
    )
  }

  loadPayment = (loadParameter) => {
    trx.loadPayment(loadParameter).then(data=>{
      this.setState({
        loadedData: data
      }, ()=>{
        this.updateLoadPayment()
      })
    })
  }

  updateLoadPayment = () => {
    const { loadedData } = this.state
    const newLoadedData = []
    for (let x=0; x<loadedData.length;x += 1){
      if(x === 0){
        loadedData[x].rowDisabled = false
        newLoadedData.push(loadedData[x])
      } else {
        newLoadedData.push(loadedData[x])
      }
    }
    this.setState({
      loadedData: newLoadedData
    })
  }

  modalDetail = () =>{
    Modal.info({
      title: 'Detail Transaksi',
      width:1000,
      content: (
        <CicilanTetapDetail footerHide="true" />
      ),
      onOk() {},
    });
  }

  checked = (checkboxState, cicilanKe) => {
    const { totalTagihan, loadedData, counter, daftarPembayaran } = this.state
    let newDaftarPembayaran = []

    const newLoadedData = []
    let newTotalTagihan = totalTagihan
    
    if (checkboxState.target.checked) {
      newDaftarPembayaran.push(cicilanKe)

      if (cicilanKe === loadedData.length) {
        for (let x=0; x<loadedData.length;x += 1){
          newLoadedData.push(loadedData[x])
        }
        newTotalTagihan += loadedData[cicilanKe-1].totalTagihan
        this.formRefCDP.current.setFieldsValue({
          biayaAdminTutup: loadedData[cicilanKe-1].biayaAdminTutup
        })
      } else {
        for (let x=0; x<loadedData.length;x += 1){
          if(x === cicilanKe){
            loadedData[x].rowDisabled = false
            newLoadedData.push(loadedData[x])
            newTotalTagihan += loadedData[cicilanKe-1].totalTagihan
          } else {
            newLoadedData.push(loadedData[x])
          }
        }
      }  
      this.setState({
        totalTagihan: newTotalTagihan,
        loadedData: newLoadedData,
        counter: counter + 1,
        daftarPembayaran: newDaftarPembayaran
      },()=>{
        this.updateTotalTagihanField()
        }
      )
    } else {
      newDaftarPembayaran = daftarPembayaran
      newDaftarPembayaran.splice(newDaftarPembayaran.indexOf(cicilanKe), newDaftarPembayaran.length-(newDaftarPembayaran.indexOf(cicilanKe)))
      this.formRefCDP.current.setFieldsValue({
        biayaAdminTutup: null
      })
      for (let x=0; x<loadedData.length;x += 1){
        if(x >= cicilanKe-1 && x < counter){
          newTotalTagihan -= loadedData[x].totalTagihan
        }
        if(x > cicilanKe-1){
          loadedData[x].rowDisabled = true
          newLoadedData.push(loadedData[x])
        } else {
          newLoadedData.push(loadedData[x])
        }
      }
      this.setState({
        totalTagihan: newTotalTagihan,
        loadedData: newLoadedData,
        counter: cicilanKe-1,
        daftarPembayaran: newDaftarPembayaran
      },()=>{
        this.updateTotalTagihanField()
        }
      )
    }
  }

  updateTotalTagihanField = () => {
    const { totalTagihan } = this.state
    this.formRefCDP.current.setFieldsValue({
      totalTagihan: totalTagihan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    })
  }

  count = values => {
    const countParameter = {}
    if (values.totalPembayaran === undefined) {
      countParameter.totalTagihan = parseInt(values.totalTagihan.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"), 10)
      countParameter.diskonPembayaran = values.diskonPembayaran
      countParameter.biayaAdminTutup = values.biayaAdminTutup
      trx.countPayment(countParameter).then(data=>{
        this.formRefCDP.current.setFieldsValue({
          diskonPembayaranHasil: data[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          totalTagihanAkhir: data[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        })
      })
    } else {
      countParameter.totalTagihan = parseInt(values.totalTagihan.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"), 10)
      countParameter.diskonPembayaran = values.diskonPembayaran
      countParameter.totalPembayaran = parseInt(values.totalPembayaran .replace(/,/g,''), 10)
      trx.countPayment(countParameter).then(data=>{
        if (data[2]>=0 && data[1]>=0) {
          this.setState({
            buttonPayment: false
          })
        } else {
          this.modalPayment()
          this.setState({
            buttonPayment: true
          })
        }
        this.formRefCDP.current.setFieldsValue({
          diskonPembayaranHasil: data[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          totalTagihanAkhir: data[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          kembalian: data[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        })
      })
    } 
  }

  modalPayment = () =>{
    Modal.warning({
      title: "Proses Tidak Dapat Dilanjutkan",
      content:(
        <a>Nilai Kembalian atau Total Tagihan Akhir kurang dari nol</a>
      )
    })
  }

  uploadImage = ({ onSuccess, onError, file}) => {
    const isLessThan2MB = file.size / 1024**2
    if(isLessThan2MB){
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = (e) =>{
        this.setState({
          buktiBayar: e.target.result
        })
        setTimeout(()=>{
          onSuccess("OK");
        }, 0)
      }
    } else {
      notification.error({
        message: 'Gagal mengupload file!',
        description: 'Ukuran file melebihi 2MB!'
      })
      setTimeout(()=>{
        onError("Failed");
      }, 0)
    }
  }

  savePayment = () => {
    const { noTransaksi, diskonPembayaran, tglBayar, totalPembayaran, metodeBayar, totalTagihan, buktiBayar, daftarPembayaran } = this.state
    const saveParameter  = {}
    saveParameter.noTransaksi = noTransaksi
    saveParameter.diskonPembayaran = parseInt(diskonPembayaran, 10)
    saveParameter.tglBayar = tglBayar
    saveParameter.totalTagihan = totalTagihan
    saveParameter.totalPembayaran = parseInt(totalPembayaran, 10)
    saveParameter.metodeBayar = metodeBayar
    saveParameter.buktiBayar = buktiBayar
    saveParameter.daftarPembayaran = daftarPembayaran
    trx.savePayment(saveParameter).then(data=>{
      console.log(data)
    },()=>{
      notification.success({
        message: 'Sukses!',
        description: 'Pembayaran berhasil dilakukan'
      })
      history.goBack()
    })
  }

  back = () => {
    history.goBack()
  }

  onFinishCDP = values => {
    this.setState({
      totalTagihan: values.totalTagihan,
      diskonPembayaran: values.diskonPembayaran,
      tglBayar: Moment(Date()).format("yyyy-MM-DD"),
      totalPembayaran: values.totalPembayaran,
      metodeBayar: values.metodeBayar,
    },()=>{
      this.count(values)
    })
  }

  paymentOnChange = e => {
    this.formRefCDP.current.setFieldsValue({
      totalPembayaran: parseInt(e.target.value.replace(/,/g,''), 10).toLocaleString()
    })
  }

  // Block Handle Event --End

  render(){
    const { loadedData, buttonPayment } = this.state
    return(
      <div>
        <Card>
          <h4>Transaksi Cicilan Tetap - Pembayaran</h4>
          {/* Card 1 */}
          <Card title="Informasi Transaksi" size="small">
            <Form layout="horizontal" ref={this.formRefCIT} {...this.layoutCIT}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item name="customerId" label="ID Pelanggan">
                    <Input style={{ width: 75 }} readOnly />
                  </Form.Item>
                  <Form.Item name="customerName" label="Nama Pelanggan">
                    <Input style={{ width: 250 }} readOnly />
                  </Form.Item>
                  <Form.Item name="noKtp" label="Nomor KTP">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <Form.Item name="noHp" label="Nomor HP">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <Form.Item name="tglBayar" label="Tanggal Pembayaran">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <br />
                  <br />
                  <br />
                  <Form.Item>
                    <Button type='primary' style={{ width: 175, height:30 }} onClick={this.modalDetail}>Lihat Detail Transaksi</Button>
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item name="tglTransaksi" label="Tanggal Transaksi">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <Form.Item name="noTransaksi" label="Nomor Transaksi">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <Form.Item name="produkId" label="Produk Transaksi">
                    <Input style={{ width: 125 }} readOnly />
                  </Form.Item>
                  <Form.Item name="produkName" label="Nama Produk">
                    <Input style={{ width: 250 }} readOnly />
                  </Form.Item>
                  <Form.Item name="produkDesc" label="Keterangan Produk">
                    <Input style={{ width: 250, height: 100 }} readOnly />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
          <br />
          {/* Card 2 */}
          <Card title="Daftar Tagihan Pelanggan" size="small">
            <Table
              columns={this.columns}
              dataSource={loadedData}
              rowKey={record=>record.cicilanKe}
            />
          </Card>
          <br />
          {/* Card 3 */}
          <Card title="Data Pembayaran" size="small">
            <Form
              {...this.layoutCDP}
              layout="horizontal"
              ref={this.formRefCDP}
              onFinish={this.onFinishCDP}
            >
              <div className="row">
                <div className="col-md-12">
                  <Form.Item name="totalTagihan" label="Total Tagihan yang ingin dibayar">
                    <Input style={{...this.inputStyling, textAlign:'right'}} readOnly prefix="Rp." />
                  </Form.Item>
                  <Form.Item name="biayaAdminTutup" label="Biaya Admin Tutup (Khusus Pelunasan)">
                    <Input style={{ width: 250 }} readOnly prefix="Rp." />
                  </Form.Item>
                  <Form.Item name="diskonPembayaran" label="Potongan/Diskon Pembayaran">
                    <Input style={{ width: 250 }} pattern="[0-9]*" title="Masukkan hanya boleh diisi angka [0-9]" suffix="%" />
                  </Form.Item>
                  <Form.Item name="diskonPembayaranHasil" label="Diskon Pembayaran">
                    <Input style={{ width: 250 }} readOnly prefix="Rp." />
                  </Form.Item>
                  <Form.Item name="totalTagihanAkhir" label="Total Tagihan Akhir">
                    <Input style={{ width: 250 }} readOnly prefix="Rp." />
                  </Form.Item>
                  <Form.Item name="totalPembayaran" label="Total Pembayaran dari Pelanggan">
                    <Input style={{ width: 250 }} prefix="Rp." onChange={this.paymentOnChange} />
                  </Form.Item>
                  <Form.Item name="metodeBayar" label="Metode Pembayaran">
                    <Select style={{ width: 250 }} placeholder="Pilih Metode Pembayaran">
                      <Option value="CASH">Cash</Option>
                      <Option value="TRANSFER">Transfer</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="kembalian" label="Kembalian">
                    <Input style={{ width: 250 }} readOnly prefix="Rp." />
                  </Form.Item>
                  <Form.Item {...this.tailLayoutCDP}>
                    <Upload
                      webkitRelativePath
                      customRequest={(e)=>this.uploadImage(e)}
                      listType="picture"
                      defaultFileList={[...this.fileList]}
                      className="upload-list-inline"
                    >
                      <Button icon={<UploadOutlined />}>Upload Bukti Bayar</Button>
                    </Upload>
                  </Form.Item>
                </div>
              </div>
              <br />
              <div align="right">
                <Button onClick={this.back}>
                  Kembali
                </Button>
                &emsp;
                <Button htmlType='submit'>
                  Hitung
                </Button>
                &emsp;
                <Button type='primary' onClick={this.savePayment} disabled={buttonPayment}>
                  Proses Pembayaran
                </Button>
              </div>
            </Form>
          </Card>
        </Card>
      </div>
    )
  }
}

export default CicilanTetapPembayaran
