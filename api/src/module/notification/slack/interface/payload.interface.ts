import { Block, KnownBlock, PlainTextElement } from '@slack/bolt';

export interface SlackInteractionPayload {
  type: string; // 상호작용의 타입 (예: block_actions, message_action, etc.)
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  container: {
    type: string;
    message_ts?: string;
    channel_id?: string;
    is_ephemeral?: boolean;
  };
  team: {
    id: string;
    domain: string;
  };
  channel: {
    id: string;
    name: string;
  };
  token: string;
  trigger_id: string;
  response_url: string;
  actions?: SlackAction[];
  view?: SlackView;
}

export interface SlackAction {
  action_id: string;
  block_id: string;
  text: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  value?: string;
  style?: string;
  type: string;
  action_ts: string;
}

export interface SlackView {
  id: string;
  team_id: string;
  type: string;
  title: PlainTextElement;
  blocks: (Block | KnownBlock)[];
  close?: PlainTextElement;
  submit?: PlainTextElement;
  private_metadata?: string;
  callback_id?: string;
  state?: any;
  hash?: string;
  root_view_id?: string;
  previous_view_id?: string;
}
