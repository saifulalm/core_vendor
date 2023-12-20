'use strict';

const axios = require('axios');

const { logToLogFile } = require('./logger');
const {json} = require("express");
const customLogPath = 'logs/Masa';
const baseApiUrl = 'http://103.103.192.250:8002';
const vendor='MASA';
const id='BP8278';
const user='A1A3C8';
const pass='7F6AC5';
const pin='0919029';


const controller = {};




controller.index = async (req, res) =>{

  const idtrx = req.query.idtrx.replace(/\s/g, '');
  const tujuan = req.query.tujuan.replace(/\s/g, '');
  const kodeproduk = req.query.kodeproduk.replace(/\s/g, '');

  const bodyData = {
    idtrx: idtrx,
    id: id,
    user: user,
    pass: pass,
    pin: pin,
    tujuan: tujuan,
    kodeproduk: kodeproduk,
    counter: 1,
  };
  logToLogFile(`Request ${vendor} : ${JSON.stringify(bodyData)}`, customLogPath);
  console.log(`Request ${vendor} :`, `${baseApiUrl}/api/h2h`, bodyData);
  try {
    const response = await axios.get(`${baseApiUrl}/api/h2h`, {
      params: bodyData,
    });
    // console.log(`Response ${vendor} : ${JSON.stringify(response.data)}');

    if (response.data !== null) {
      const resdata = {
        idtrx: idtrx,
        tujuan: tujuan,
        kodeproduk: kodeproduk,
        status: response.data.rc,
        message: response.data.msg,
      };
      return res.status(200).json(resdata);
    } else {
      const resdata = {
        idtrx: idtrx,
        tujuan: tujuan,
        kodeproduk: kodeproduk,
        message: 'Tidak Dapat Response Dari Vendor, silahkan cek web report / Advice ',
      };

      console.log('Response is null.');
      return res.status(200).json(resdata);
    }
  } catch (error) {
    console.error(error);
    // Handle other errors here, if needed
    return res.status(500).json({ error: 'Internal Server Error' });
  }



}

    module.exports = controller;
