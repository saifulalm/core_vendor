
const moment = require('moment-timezone');



const generateRandomNumber= async(length)=>{
    const dpn = '02140';
    const tgh = '0000';
    let result = dpn;

    // Generate random numbers
    for (let i = 0; i < 2; i++) {
        const acak2 = Math.floor(Math.random() * (99 - 11 + 1) + 11);
        result += acak2;
    }

    const acak = Math.floor(Math.random() * 9) + 1;
    result += acak + tgh;

    // Generate additional random numbers based on the specified length
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result;
}

const handleSwitchValue = async(value) =>{

    let a, b;

    switch (parseInt(value)) {
        case 0:
            a = b = false;
            break;
        case 1:
            a = true;
            b = false;
            break;
        case 2:
            a = false;
            b = true;
            break;
        case 3:
            a = b = true;
            break;
        default:
            a = b = false;
    }

    return { a, b };
}


const callbackisset = () =>{
    const logTime = moment().tz('Asia/Jakarta').format('DD-MM-YY HH:mm:ss');
    return { Callback: 'Ok', Created: logTime };
}


module.exports = {
    generateRandomNumber,
    handleSwitchValue,
    callbackisset,
};


