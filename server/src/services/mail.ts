import sgMail from '@sendgrid/mail';
import { InviteInfo } from '../types';
import config from '../utils/config';
import logger from '../utils/logger';
import { capitalize } from '../utils/mappers';
import { format } from 'date-fns';
import {
  getInviteMailContent,
  getVerificationMailContent,
} from '../utils/mailContent';

sgMail.setApiKey(config.SENDGRID_API_KEY);

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
    if (e.response) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.error(`Error sending invite email: ${e.response.data}`);
    }

    throw new Error(`Error sending invite email: ${e.message}`);
  }
};

const sendVerification = async (
  recipientEmail: string,
  confirmationId: string,
  recipientUserName?: string
) => {
  try {
    const { text, html } = getVerificationMailContent(confirmationId);

    const msg = {
      to: recipientEmail,
      from: 'info@kotipelit.com',
      subject: 'Vahvista sähköpostiosoitteesi',
      text,
      html,
    };

    await sgMail.send(msg);

    logger.log(
      `verification mail sent${
        recipientUserName ? ` to ${recipientUserName}` : ''
      }`
    );
  } catch (e) {
    if (e.response) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.error(`Error sending verification email: ${e.response.data}`);
    }

    throw new Error(`Error sending verification email: ${e.message}`);
  }
};

export default {
  sendInvite,
  sendVerification,
};
