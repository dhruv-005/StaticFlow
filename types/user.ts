export type UserRole = "admin" | "user";
export type SubscriptionPlan = "free" | "pro" | "enterprise";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  plan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  apiCount: number;
  deployCount: number;
  apiCallsLimit: number;
  apiCallsUsed: number;
}
