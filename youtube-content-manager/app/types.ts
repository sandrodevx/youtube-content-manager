export interface YoutubeAccount {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  estimatedRevenue: number;
  isActive: boolean;
  channelId?: string;
  description?: string;
  content_niche?: string;
  upload_frequency?: string;
}

export interface Video {
  id: string;
  accountId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  revenue: number;
}

export interface ChannelStats {
  day: string;
  subscribers: number;
  views: number;
  revenue: number;
}

export interface AccountSummary {
  totalAccounts: number;
  totalSubscribers: number;
  totalViews: number;
  totalVideos: number;
  totalRevenue: number;
} 