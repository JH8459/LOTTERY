import { AppOptions } from '@slack/bolt';

export const SLACK_CONFIG: AppOptions = {
  token: process.env.API_SLACK_BOT_TOKEN,
  signingSecret: process.env.API_SLACK_SIGNING_SECRET,
};
