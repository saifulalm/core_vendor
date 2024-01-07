
const transaction = require('../Services/Lll/GetRequest');
const getRequest = new transaction(); // Assuming you have a GetRequest class for handling requests

class Lll {

    async index_v1(req, res) {
        try {
            const {idtrx, tujuan, kodeproduk} = req.query;
            const result = await getRequest.index_v1(idtrx, tujuan, kodeproduk);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }


}


module.exports = Lll;