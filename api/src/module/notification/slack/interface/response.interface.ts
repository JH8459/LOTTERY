export interface SlackOAuthResponse {
  accessToken: string;
  appId: string;
}

export interface SlackTeamResponse {
  workspaceId: string;
  workspaceName: string;
  appRedirectUrl: string;
}
