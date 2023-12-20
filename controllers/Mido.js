'use strict';

const axios = require('axios');
const https = require('https');

const baseApiUrl = 'https://partnerapi.indosatooredoo.com';

const createAxiosInstance = () => {
  return axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
};

const controller = {};

//Request transaksi indosat
controller.validation = async (req, res) => {

  const clientTransIdToFind = req.query.idtrx;
  const tujuan = '62' + req.query.tujuan.slice(1);
  try {
    const axiosInstance = createAxiosInstance();


    const initialResponse = await axiosInstance.get(baseApiUrl);
    const cookies = initialResponse.headers['set-cookie'];

    const headers = {
      'Host': 'partnerapi.indosatooredoo.com',
      'Accept': 'text/html, application/xhtml+xml',
      'Referer': 'https://partnerapi.indosatooredoo.com/',
      'Content-Type': 'application/json',
      'X-Inertia': 'true',
      'X-Inertia-Version': '207fd484b7c2ceeff7800b8c8a11b3b6',
      'X-XSRF-TOKEN': decodeURIComponent(cookies[0].split(';')[0].split('=')[1]),
      'Content-Length': '54',
      'Origin': 'https://partnerapi.indosatooredoo.com',
      'Cookie': cookies.join('; '),
    };


    const bodyData = {
      'email': 'fety@jempolkios.com',
      'password': 'indosat23',
    };

    // Make a POST request to the login endpoint
    const loginResponse = await axiosInstance.post(`${baseApiUrl}/v2/signin`, bodyData, { headers });
    if (loginResponse.status === 200) {
      const cookiesDashboard = loginResponse.headers['set-cookie'];

      const headersDashboard = {
        'Host': 'partnerapi.indosatooredoo.com',
        'Referer': 'https://partnerapi.indosatooredoo.com/dashboard',
        'X-Inertia': 'true',
        'X-Inertia-Version': '207fd484b7c2ceeff7800b8c8a11b3b6',
        'X-XSRF-TOKEN': decodeURIComponent(cookiesDashboard[0].split(';')[0].split('=')[1]),
        'Origin': 'https://partnerapi.indosatooredoo.com',
        'Cookie': cookiesDashboard.join('; '),
      };

      const loginDashboard = await axiosInstance.get(`${baseApiUrl}/dashboard`, { headers: headersDashboard });

      console.log('Response Dashboard:', loginDashboard.data);

      if (loginDashboard.status === 200) {


        const headersearch = {
          'Host': 'partnerapi.indosatooredoo.com',
          'Referer': ' https://partnerapi.indosatooredoo.com/service/ojoldata/MDUCDOProdApp',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(cookiesDashboard[0].split(';')[0].split('=')[1]),
          'Content-Length': '26',
          'Origin': 'https://partnerapi.indosatooredoo.com',
          'Cookie': cookiesDashboard.join('; '),
        };


        const data = {
          search: tujuan

        };

        const searchdata = await axiosInstance.post(`${baseApiUrl}/service/ojoldata/MDUCDOProdApp/api/gift/search`, data ,{ headers: headersearch });
        console.log('Response Dashboard:', searchdata.data);


        const foundTransaction = searchdata.data.transData.find(transaction => {
          return transaction.client_trans_id === clientTransIdToFind;
        });


        if (foundTransaction) {
          console.log('Found Transaction:', foundTransaction);


          const headerdetail = {
            'Host': 'partnerapi.indosatooredoo.com',
            'Referer': 'https://partnerapi.indosatooredoo.com/service/ojoldata/MDUCDOProdApp/api/gift/status',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': decodeURIComponent(cookiesDashboard[0].split(';')[0].split('=')[1]),
            'Content-Length': '98',
            'Origin': 'https://partnerapi.indosatooredoo.com',
            'Cookie': cookiesDashboard.join('; '),
          };

          const data = {
            clientTransId: clientTransIdToFind,
            developerAppName: "MDUCDOProdApp",
            startDate: foundTransaction.created_date,

          };
          console.log('Request Transaction Detail:', data);


          const detaildata = await axiosInstance.post(`${baseApiUrl}/service/ojoldata/MDUCDOProdApp/api/gift/status`, data ,{ headers: headerdetail });
          console.log('Found Transaction Detail:', detaildata.data);
          res.status(200).json(detaildata.data);

        } else {
          // Transaction with the specified client_trans_id was not found
          const resdata = {
            idtrx: clientTransIdToFind,
            tujuan: tujuan,
            message: 'Transaksi Tidak ditemukan, Silahkan Hubungi Customer Service ',

          };
          console.log('Transaction not found');
          res.status(404).json(resdata);
        }



      }




    }

    res.status(initialResponse.status).json({ message: 'Request completed successfully' });
  } catch (error) {

  return   res.status(500).json({ error: 'Internal Server Error' });
  }
};

controller.index = async (req, res) =>{





}

    module.exports = controller;
