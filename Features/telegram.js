const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

class TelegramTrait {
    formatRupiah(amount) {
        return `Rp ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    async getBalance(vendorName) {
        try {
            const response = await axios.post('http://118.99.85.170:2222/api/balance-terminal', {
                name: vendorName
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async sendMessageToTelegram(message) {
        const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your Telegram bot token
        const chatId = '-1001694851524'; // Replace with your chat ID

        const bot = new TelegramBot(token);

        try {
            await bot.sendMessage(chatId, message);
        } catch (error) {
            console.error(error);
            // Log or handle the exception
        }
    }

    async useTelegram(vendorName, limit) {
        const balanceResponse = await this.getBalance(vendorName);

        if (balanceResponse === null) {
            return { status: 500 };
        }

        const balance = balanceResponse.msg[0].Saldo;

        const message = `[ Notification Saldo Vendor ]\n\nHai Team @Deposit_Nirwana,@Nirwana123,@NirwanaGames\n\n` +
            `Date: ${new Date().toLocaleString()}\n` +
            `Nama Vendor: ${vendorName}\n` +
            `Limit Saldo: ${this.formatRupiah(limit)}\n` +
            `Saldo terupdate : ${this.formatRupiah(balance)}\n\n` +
            `Silahkan Melakukan Request Topup Melibihi Limit yang di tentukan`;

        if (limit > balance) {
            await this.sendMessageToTelegram(message);
            return { status: 200 };
        } else {
            return { status: 400 };
        }
    }
}

