const axios = require('axios');
require('dotenv').config();
const { saveTransaction } = require('../../utility/dbUtils');
const { findTransactionByIdtrx } = require('../../utility/dbUtils');
const { generateRandomNumber } = require('../../utility/helper');
const { callbackisset } = require('../../utility/helper');
const { handleSwitchValue } = require('../../utility/helper');
const {end} = require("../../db");
const {logToLogFile} = require("../../controllers/logger");
const table = 'transaction_Lll';
const vendor = 'LLL';
const customLogPath = 'logs/LLL';
class GetRequest {
    constructor() {
        this.endpoint = process.env.API_ENDPOINT_Lll;
        this.id = process.env.API_ID_Lll;
        this.user = process.env.API_USER_Lll;
        this.pass = process.env.API_PASS_Lll;
        this.pin = process.env.API_PIN_Lll;
        this.terminal = process.env.API_TERMINAL_LLL;
    }


    async index_v1(idtrx, tujuan, kodeproduk) {

        let splitkp = kodeproduk.split('.');

        if (!splitkp || splitkp.length < 2) {
            return {
                idtrx,
                kodeproduk,
                tujuan,
                msg: 'Request tidak sesuai, bisa di gagalkan silahkan cek documentasi terlebih dahulu !! ',
            };
        }

        var kp =  splitkp[0];
        const pembeda =await handleSwitchValue(splitkp[1]);



        const requestData = {
            idtrx: idtrx,
            id: this.id,
            user: this.user,
            pass: this.pass,
            pin: this.pin,
            kodeproduk: kp ,
            tujuan: tujuan,
            counter: 1,
        };


        try {
            console.log(`Making GET request to ${this.endpoint}/api/h2h with params:`, requestData);
            logToLogFile(`Request ${vendor} : ${JSON.stringify(requestData)}`, customLogPath);
            const response = await axios.get(`${this.endpoint}/api/h2h`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                params: requestData,
            });

            const dataToSave = {
                idtrx: idtrx,
                tujuan: tujuan,
                kodeproduk: kodeproduk,
                request: requestData,
                response: response.data,
                created_at: new Date(),
            };

            await (async () => {
                try {
                    const savedData = await saveTransaction(table,dataToSave);
                    console.log('Data saved/updated successfully:', savedData);
                } catch (error) {
                    console.error('Error saving/updating data:', error);
                }
            })();





            if (!response) {
                return {
                    idtrx,
                    kp,
                    tujuan,
                    msg: 'Tidak Dapat Response Dari Vendor, silahkan cek web report / Advice',
                };
            }

            if (response.data.rc === '1') {
                const serial = a ? await generateRandomNumber(8) : response.data.sn||null;
                return {
                    RESP: true,
                    GEN: pembeda.a,
                    RC: response.data.rc,
                    Kode: kp,
                    idtrx,
                     tujuan,
                    sn:serial,
                    Msg: response.data.msg,
                };
            }
            else{
                return {
                    RESP: true,
                    Alih: pembeda.b,
                    RC: response.data.rc,
                    Kode: kp,
                    idtrx,
                    tujuan,
                    Msg: response.data.msg,
                };

            }


        } catch (error) {

            console.error('Error:', error);
            throw error;
        }




    }



    async callback_v1(serverid,clientid,statuscode,kp,msg,msisdn,sn){


        const foundTransaction = await findTransactionByIdtrx(table, clientid);

        const pembeda = handleSwitchValue(foundTransaction.kodeproduk.split('.')[1]);



        if (statuscode === '1') {
            const serial = pembeda.a ? await generateRandomNumber(8) : sn;
            var sendcallback = {
                Callback: true,
                Gen: pembeda.a,
                Rc: statuscode,
                Kode: kp,
                idtrx: clientid,
                tujuan: msisdn,
                sn: serial,
                Msg: msg,

            };

        } else {
            var sendcallback = {
                Callback: true,
                Alih: pembeda.b,
                Rc: statuscode,
                Kode: kp,
                idtrx: clientid,
                tujuan: msisdn,
                Msg: msg,

            };

        }

           await axios.get(`${this.terminal}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: sendcallback,
        });

        console.log('Callback ', sendcallback);

        return callbackisset();

    }

}

module.exports = GetRequest;
