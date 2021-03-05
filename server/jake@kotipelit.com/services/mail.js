"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInviteMailContent = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const types_1 = require("../types");
const config_1 = __importDefault(require("../utils/config"));
const logger_1 = __importDefault(require("../utils/logger"));
const mappers_1 = require("../utils/mappers");
const date_fns_1 = require("date-fns");
mail_1.default.setApiKey(config_1.default.SENDGRID_API_KEY);
exports.getInviteMailContent = (inviteInfo) => {
    const date = new Date(inviteInfo.startTime);
    const dateString = date_fns_1.format(date, 'd.M.');
    const timeString = date_fns_1.format(date, 'HH:mm');
    switch (inviteInfo.gameType) {
        case types_1.GameType.KOTITONNI: {
            return {
                // text content here
                text: `Hei,

Tervetuloa pelaamaan Kotitonnia ${dateString} klo ${timeString}!
        
Tässä ovat sanasi: 
${inviteInfo.data.words.join(', ')} 

Huomioi, että pelissä käytetään myös yhdyssanoja ja erisnimiä.
        
Peliin pääset tästä linkistä:
${inviteInfo.url}
        
Jos tulee kysyttävää, voit olla yhteydessä vastaamalla tähän viestiin.
        
Hyviä pelejä!
        
Terveisin,
Kotipelit.com`,
                // html content here
                html: `
        <div>Hei,
        <br /><br />
        Tervetuloa pelaamaan Kotitonnia ${dateString} klo ${timeString}!
        <br /><br />
        Tässä ovat sanasi: 
        <br />
        ${inviteInfo.data.words.join(', ')} 
        <br /><br /> 
        Huomioi, että pelissä käytetään myös yhdyssanoja ja erisnimiä. <br /><br />
        Peliin pääset tästä linkistä:
        <br />
        <a href=${inviteInfo.url}>${inviteInfo.url}</a>
        <br />
        <br />
        Jos tulee kysyttävää, voit olla yhteydessä vastaamalla tähän viestiin.
        <br /><br />
        <span>Jos joudut peruuttamaan varauksesi, klikkaa <a href=${inviteInfo.cancelUrl}>tästä</a></span>
        <br /><br />
        Hyviä pelejä!
        <br /><br />
        Terveisin,
        <br />
        Kotipelit.com
        </div>`,
            };
        }
        default: {
            throw new Error('unknown game type');
        }
    }
};
const sendInvite = (recipient, inviteInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date(inviteInfo.startTime);
        const dateString = date_fns_1.format(date, 'd.M.');
        const timeString = date_fns_1.format(date, 'HH:mm');
        const subject = `${mappers_1.capitalize(inviteInfo.gameType)} ${dateString} klo ${timeString}`;
        const mailContent = exports.getInviteMailContent(inviteInfo);
        const msg = {
            to: recipient,
            from: 'info@kotipelit.com',
            subject,
            text: mailContent.text,
            html: mailContent.html,
        };
        yield mail_1.default.send(msg);
        logger_1.default.log(`invitation mail sent for '${inviteInfo.displayName}'`);
    }
    catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e.response)
            logger_1.default.error(e.response.body);
        throw new Error(`Error sending invite email`);
    }
});
exports.default = {
    sendInvite,
};
