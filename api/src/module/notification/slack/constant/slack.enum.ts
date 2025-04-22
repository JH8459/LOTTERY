export enum SlackActionTypeEnum {
  BLOCK_ACTIONS = 'block_actions',
  VIEW_SUBMISSION = 'view_submission',
}

export enum SlackActionIDEnum {
  PRIZE_INFO = 'prize_info',
  SPEETTO_INFO = 'speetto_info',
  STATISTIC_PRIZE_INFO = 'statistic_prize_info',
  RECENTLY_PRIZE_INFO = 'recently_prize_info',
  ORDER_INPUT = 'order_input',
  SLACK_FEEDBACK_INPUT = 'slack_feedback_input',
  EMAIL_FEEDBACK_INPUT = 'email_feedback_input',
  SPEETTO_INPUT = 'speetto_input',
  SLACK_SUBSCRIBE = 'slack_subscribe',
  SLACK_UNSUBSCRIBE = 'slack_unsubscribe',
  EMAIL_SUBSCRIBE = 'email_subscribe',
  EMAIL_SUBSCRIBE_INPUT = 'email_subscribe_input',
  EMAIL_CONFIRM_INPUT = 'email_confirm_input',
  EMAIL_CONFIRM = 'email_confirm',
  EMAIL_UNSUBSCRIBE = 'email_unsubscribe',
  EMAIL_VERIFICATION_CODE = 'email_resend_verification_code',
}

export enum SlackBlockIDEnum {
  ORDER_INPUT = 'order_input',
  SLACK_FEEDBACK_INPUT = 'slack_feedback_input',
  EMAIL_SUBSCRIBE_INPUT = 'email_subscribe_input',
  EMAIL_CONFIRM_INPUT = 'email_confirm_input',
  EMAIL_CONFIRM_INPUT_WARNING = 'email_confirm_input_warning',
  EMAIL_CONFIRM = 'email_confirm',
  EMAIL_VERIFICATION_CODE = 'email_verification_code',
  EMAIL_FEEDBACK_INPUT = 'email_feedback_input',
  SPEETTO_INPUT = 'speetto_input',
  INPUT_ERROR_MESSAGE = 'input_error_message',
}

export enum SlackSubMitButtonNameEnum {
  SEARCH = '조회',
}
