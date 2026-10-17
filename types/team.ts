export type TeamRole = "admin" | "developer" | "tester" | "viewer";

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}
