
export interface Agent {
  id: string;
  name: string;
  domain: string;
  personality: string;
  role: string;
  tagline: string;
  avatarColor: string;
  description: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}
