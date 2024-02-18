export interface PublicSubscriberInfoInterface {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string | null;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string | null;
  following_url: string | null;
  gists_url: string | null;
  starred_url: string | null;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface PrivateSubscriberInfoInterface {
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string;
  hireable: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriberInfoInterface extends PublicSubscriberInfoInterface, PrivateSubscriberInfoInterface {}
