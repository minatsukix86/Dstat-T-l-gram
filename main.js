const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('ssh2');


const token = 'tokentlg';
const bot = new TelegramBot(token, { polling: true });

const SSH_HOST = "// host ip";
const SSH_PORT = 22;
const SSH_USERNAME = "root";
const SSH_PASSWORD = "// passwd serv";
const DISCORD_WEBHOOK_URL = 'webhook url';




bot.onText(/\/start/, (msg) => {
    const userName = msg.from.first_name;
    const userId = msg.from.id;
    const helpMessage = `👋 Bienvenue ${userName}, votre ID est : ${userId} !\n\nCommandes disponibles :\n\n/count - Pour compter le trafic réseau\n`;
    bot.sendMessage(msg.chat.id, helpMessage);
});


bot.onText(/\/count/, (msg) => {
    const chatId = msg.chat.id;
    const interfaceOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'eth0', callback_data: 'interface_eth0' }],
                [{ text: 'lo', callback_data: 'interface_lo' }]
            ]
        })
    };
    bot.sendMessage(chatId, 'Quelle interface souhaitez-vous utiliser pour compter le trafic réseau ?', interfaceOptions);
});

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    if (data.startsWith('interface_')) {
        const interfaceName = data.split('_')[1];
        console.log(`L'interface choisie est : ${interfaceName}`);
        const durationOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '60 secs', callback_data: `duration_60_${interfaceName}` }],
                    [{ text: '120 secs', callback_data: `duration_120_${interfaceName}` }],
                    [{ text: '200 secs', callback_data: `duration_200_${interfaceName}` }]
                ]
            })
        };
        bot.sendMessage(chatId, 'Combien de temps voulez-vous surveiller le trafic (en secondes) ?', durationOptions);
    } else if (data.startsWith('duration_')) {
        const [_, duration, interfaceName] = data.split('_');
        console.log(`La durée choisie est : ${duration} secondes`);
        console.log(`Interface : ${interfaceName}`);
        bot.sendMessage(chatId, `Surveillance du trafic pour l'interface ${interfaceName} pendant ${duration} secondes...`);

        const command = `ifstat -i ${interfaceName} 1`;
        executeSSHCommand(command, parseInt(duration, 10), chatId, interfaceName);
    } else if (data === 'MiraiC2') {
        bot.sendMessage(chatId, 'Bon choix Merci de ton aide. Voici le lien: https://t.me/minatsukix86');
    } else if (data === 'Catsecurity') {
        bot.sendMessage(chatId, 'Bon choix Merci de ton aide. Voici le lien: https://t.me/minatsukix86');
    } else if (data === 'Back') {
        bot.sendMessage(chatId, 'Retour au menu principal');
    }
});

function executeSSHCommand(command, duration, chatId, interfaceName) {
    const conn = new Client();
    conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
            if (err) {
                bot.sendMessage(chatId, `Erreur:\n${err.message}`);
                console.error(`Erreur SSH: ${err.message}`);
                return;
            }

            let output = '';
            let totalIn = 0;
            let totalOut = 0;
            let count = 0;
            let halfwayReported = false;
            const halfwayDuration = duration / 2;

            stream.on('data', (data) => {
                output += data.toString();
                const lines = output.trim().split('\n');
                if (lines.length > 2) {
                    const lastLine = lines[lines.length - 1].trim().split(/\s+/);
                    const currentIn = parseFloat(lastLine[0]);
                    const currentOut = parseFloat(lastLine[1]);

                    totalIn += currentIn;
                    totalOut += currentOut;
                    count++;

                    output = ''; 
                }
            });

            stream.on('close', async (code, signal) => {
                conn.end();
                bot.sendMessage(chatId, 'Machine de surveillance éteinte');
                const averageIn = totalIn / count;
                const averageOut = totalOut / count;
                const summaryMessage = `Surveillance terminée pour l'interface ${interfaceName}.\nTrafic entrant total: ${formatTraffic(totalIn)}\nTrafic sortant total: ${formatTraffic(totalOut)}\nTrafic entrant moyen: ${formatTraffic(averageIn)}\nTrafic sortant moyen: ${formatTraffic(averageOut)}`;
                bot.sendMessage(chatId, summaryMessage);

                await sendDiscordWebhook(summaryMessage);
            });

            let elapsed = 0;
            const interval = setInterval(() => {
                elapsed += 5;

                if (!halfwayReported && elapsed >= halfwayDuration) {
                    halfwayReported = true;
                    const halfwayMessage = `Rapport intermédiaire pour l'interface ${interfaceName} (à mi-parcours):\nTrafic entrant accumulé: ${formatTraffic(totalIn)}\nTrafic sortant accumulé: ${formatTraffic(totalOut)}`;
                    bot.sendMessage(chatId, halfwayMessage);
                }

                if (elapsed >= duration) {
                    clearInterval(interval);
                    stream.close();
                }
            }, 5000);
        });
    }).on('error', (err) => {
        bot.sendMessage(chatId, `Erreur de connexion SSH:\n${err.message}`);
        console.error(`Erreur de connexion SSH: ${err.message}`);
    }).connect({
        host: SSH_HOST,
        port: SSH_PORT,
        username: SSH_USERNAME,
        password: SSH_PASSWORD
    });
}

function formatTraffic(value) {
    if (value < 1000) {
        return `${value.toFixed(2)} Kbps`;
    } else if (value < 1000000) {
        return `${(value / 1000).toFixed(2)} Mbps`;
    } else {
        return `${(value / 1000000).toFixed(2)} Gbps`;
    }
}

async function sendDiscordWebhook(message) {
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Erreur lors de l'envoi du webhook Discord: ${error.message}`);
    }
}
bot.onText(/\/review/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'MiraiC2', callback_data: 'MiraiC2' }],
                [{ text: 'Catsecurity', callback_data: 'Catsecurity' }],
                [{ text: 'Retour', callback_data: 'Back' }]
            ]
        })
    };
    bot.sendMessage(chatId, 'Quelle est le meilleur botnet actuellement ?', options);
});

function formatTraffic(value) {
    if (value < 1000) {
        return `${value.toFixed(2)} Kbps`;
    } else if (value < 1000000) {
        return `${(value / 1000).toFixed(2)} Mbps`;
    } else {
        return `${(value / 1000000).toFixed(2)} Gbps`;
    }
}


bot.on('polling_error', (error) => {
    console.error(`Erreur de polling: ${error.code}`);
});

console.log('Bot is running...');
