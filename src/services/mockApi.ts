export interface SubscriptionRequest {
  ticker?: string;
  team?: string;
  subscribed: boolean;
  userId: string;
  type: 'ticker' | 'team';
}

export interface SubscriptionResponse {
  success: boolean;
  ticker?: string;
  team?: string;
  subscribed: boolean;
  timestamp: string;
  type: 'ticker' | 'team';
}

const mockSubscriptions = new Map<string, boolean>();

export const mockSubscriptionApi = {
  async updateSubscription(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    if (Math.random() < 0.1) {
      throw new Error('Network error - subscription update failed');
    }
    
    const identifier = request.ticker || request.team;
    const key = `${request.userId}-${request.type}-${identifier}`;
    mockSubscriptions.set(key, request.subscribed);
    
    return {
      success: true,
      ticker: request.ticker,
      team: request.team,
      subscribed: request.subscribed,
      timestamp: new Date().toISOString(),
      type: request.type,
    };
  },

  async getSubscriptions(userId: string, type?: 'ticker' | 'team'): Promise<Record<string, boolean>> {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const userSubscriptions: Record<string, boolean> = {};
    mockSubscriptions.forEach((subscribed, key) => {
      if (key.startsWith(`${userId}-`)) {
        const parts = key.split('-');
        if (parts.length >= 3) {
          const keyType = parts[1];
          const identifier = parts.slice(2).join('-');
          if (!type || keyType === type) {
            userSubscriptions[identifier] = subscribed;
          }
        }
      }
    });
    
    return userSubscriptions;
  }
};
