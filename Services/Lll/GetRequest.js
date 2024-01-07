const axios = require('axios');
require('dotenv').config();
const { saveTransaction } = require('../../utility/dbUtils');

const {end} = require("../../db");
class GetRequest {
    constructor() {
        this.endpoint = process.env.API_ENDPOINT_Lll;
        this.id = process.env.API_ID_Lll;
        this.user = process.env.API_USER_Lll;
        this.pass = process.env.API_PASS_Lll;
        this.pin = process.env.API_PIN_Lll;
    }

    async index_v1(idtrx, tujuan, kodeproduk) {

        var splitkp = kodeproduk.split('.');
        var kp =  splitkp[0];

        let a, b;

        switch (parseInt(splitkp[1])) {
            case 0:
                a = b = false;
                break;
            case 1:
                a = false;
                b = true;
                break;
            case 2:
                a = true;
                b = false;
                break;
            case 3:
                a = b = true;
                break;
            default:
                a = b = false;
        }


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
                create_at: new Date(),
            };

            await (async () => {
                try {
                    const savedData = await saveTransaction(dataToSave);
                    console.log('Data saved/updated successfully:', savedData);
                } catch (error) {
                    console.error('Error saving/updating data:', error);
                }
            })();



            console.log(`Response Data :`, response);

            if (!response) {
                return {
                    idtrx,
                    kp,
                    tujuan,
                    msg: 'Tidak Dapat Response Dari Vendor, silahkan cek web report / Advice',
                };
            }

            if (response.data.rc === '1') {
                return {
                    RESP: true,
                    GEN: a,
                    RC: response.data.rc,
                    Kode: kp,
                    idtrx,
                     tujuan,
                    Msg: response.data.msg,
                };
            }
            else{
                return {
                    RESP: true,
                    Alih: b,
                    RC: response.data.rc,
                    Kode: kp,
                    idtrx,
                    tujuan,
                    Msg: response.data.msg,
                };

            }


        } catch (error) {

            console.error('Error:', error);
            throw error; // Rethrow the error if needed
        }




    }

}

module.exports = GetRequest;
