
const transaction = require('../Services/Myim3/GetRequest');
const getRequest = new transaction(); // Assuming you have a GetRequest class for handling requests

class Myim3 {

    async Index_v1(req, res) {
        try {
            const {idtrx, tujuan, kodeproduk, user, pin} = req.query;
            const result = await getRequest.indexV1(idtrx, tujuan, kodeproduk, user, pin);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }


}


module.exports = Myim3;