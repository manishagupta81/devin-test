export interface SubscriptionRequest {
  ticker: string;
  subscribed: boolean;
  userId: string;
}

export interface SubscriptionResponse {
  success: boolean;
  ticker: string;
  subscribed: boolean;
  timestamp: string;
}

const mockSubscriptions = new Map<string, boolean>();

export const mockSubscriptionApi = {
  async updateSubscription(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    if (Math.random() < 0.1) {
      throw new Error('Network error - subscription update failed');
    }
    
    const key = `${request.userId}-${request.ticker}`;
    mockSubscriptions.set(key, request.subscribed);
    
    return {
      success: true,
      ticker: request.ticker,
      subscribed: request.subscribed,
      timestamp: new Date().toISOString(),
    };
  },

  async getSubscriptions(userId: string): Promise<Record<string, boolean>> {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const userSubscriptions: Record<string, boolean> = {};
    mockSubscriptions.forEach((subscribed, key) => {
      if (key.startsWith(`${userId}-`)) {
        const ticker = key.replace(`${userId}-`, '');
        userSubscriptions[ticker] = subscribed;
      }
    });
    
    return userSubscriptions;
  }
};
