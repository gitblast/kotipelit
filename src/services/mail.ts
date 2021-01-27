import sgMail from '@sendgrid/mail';
import { GameType, InviteInfo, InviteMailContent } from '../types';
import config from '../utils/config';
import logger from '../utils/logger';
import { capitalize } from '../utils/mappers';
import { format } from 'date-fns';

sgMail.setApiKey(config.SENDGRID_API_KEY);

export const getInviteMailContent = (
  inviteInfo: InviteInfo
): InviteMailContent => {
  const date = new Date(inviteInfo.startTime);
  const dateString = format(date, 'd.M.');
  const timeString = format(date, 'HH:mm');

  switch (inviteInfo.gameType) {
    case GameType.KOTITONNI: {
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

const sendInvite = async (
  recipient: string,
  inviteInfo: InviteInfo
): Promise<void> => {
  try {
    const date = new Date(inviteInfo.startTime);
    const dateString = format(date, 'd.M.');
    const timeString = format(date, 'HH:mm');

    const subject = `${capitalize(
      inviteInfo.gameType
    )} ${dateString} klo ${timeString}`;

    const mailContent = getInviteMailContent(inviteInfo);

    const msg = {
      to: recipient,
      from: 'info@kotipelit.com',
      subject,
      text: mailContent.text,
      html: mailContent.html,
    };

    await sgMail.send(msg);

    logger.log(`invitation mail sent for '${inviteInfo.displayName}'`);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.response) logger.error(e.response.body);

    throw new Error(`Error sending invite email`);
  }
};

export default {
  sendInvite,
};
