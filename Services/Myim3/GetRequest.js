const axios = require('axios');
require('dotenv').config();

class GetRequest {
    constructor() {
        this.endpoint = process.env.API_ENDPOINT_IM3;
    }

    async indexV1(idtrx, tujuan, kodeproduk, user, pin) {
        try {
            // Check balance before making the first request
            let checkbalance = await this.checkbalance(user);

            const data = this.prepareData(idtrx, tujuan, kodeproduk, user, pin);
            console.log('Request Detail:', data);
            let response = await this.sendRequest(data.path, data.request);
            console.log('Response Detail:', response.data);

            if (!response.trx) {
                // If the first request fails, wait and try again
                await this.sleep(30000);
                console.log('Request Detail:', data.request);
               let checkresponse = await this.sendRequest(data.path, data.request);
                console.log('Check Status Response Detail:', response.data);

                if (checkresponse.trx) {
                    // If successful response after the second attempt, handle the response
                    return this.handleResponse(response, user, idtrx, kodeproduk, tujuan, checkbalance);
                } else {
                    // If still unsuccessful, handle the check status response
                    return this.handleCheckStatusResponse(response, user, idtrx, kodeproduk, tujuan, checkbalance);
                }
            }

            // If the first request is successful, handle the response
            return this.handleResponse(response, user, idtrx, kodeproduk, tujuan, checkbalance);
        } catch (error) {
            console.error('Error making the request:', error);
            throw new Error('An error occurred while making the request');
        }
    }

    prepareData(idtrx, tujuan, kodeproduk, user, pin) {
        const categoryParts = kodeproduk.split('.');
        const category = categoryParts[0];
        const data = {
            username: user,
            pin: pin,
            to: tujuan,
            idtrx: idtrx,
        };

        switch (category) {
            case 'GIFT':
                return this.prepareGiftData(data, categoryParts);
            default:
                this.invalidCodeResponse(data);
        }
    }

    prepareGiftData(data, categoryParts) {
        const path = '/dataGift';
        data.pvr_code = categoryParts[1];

        return { path, request: data };
    }

    async sendRequest(path, data) {
        try {
            console.log(`Making GET request to ${this.endpoint}${path} with params:`, data);


            const response = await axios.get(`${this.endpoint}${path}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                params: data,
            });


            return response;
        } catch (error) {

            console.error('Error:', error);
            throw error; // Rethrow the error if needed
        }
    }

   async checkbalance(user){
const data={username:user}
        return await axios.get(`${this.endpoint}/profile`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            params: data,
        });



    }

    handleResponse(response, user, idtrx, kodeproduk, tujuan, checkbalance) {
        const { trx } = response;
        return {
            check:false,
            chip: user,
            idtrx:idtrx,
            kp: kodeproduk,
            tujuan:tujuan,
            prodname: trx.productname,
            price: trx.price,
            salobefore: checkbalance.data,
            saldoafter: parseInt(response.saldo),
            status: trx.status,
            trxid: trx.tid,
            msg: trx.protip,
        };
    }

    handleCheckStatusResponse(response, user, idtrx, kodeproduk, tujuan) {
        return {
            check:true,
            chip: user,
            idtrx:idtrx,
            kp: kodeproduk,
            tujuan:tujuan,
            msg: response.error || response.trx,
        };
    }

    invalidCodeResponse(data) {
        data.msg = 'Kode Produk Salah, Category Tidak ada silahkan coba cek documentasi';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = GetRequest;
