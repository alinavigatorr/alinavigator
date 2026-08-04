import { AuthDataSource } from './auth-data-source';
import { LoginCredentials, RegisterPayload } from '../../domain/auth/auth-types';
import { Identity } from '../../domain/auth/identity-types';
import { User, UserStatus } from '../../domain/auth/user-types';
import { Session } from '../../domain/auth/session-types';
import { UserRole } from '../../domain/auth/role-types';
import { Permission } from '../../domain/auth/permission-types';

export class MockAuthDataSource implements AuthDataSource {
  // --- In-Memory Mock Database ---
  private users: User[] = [
    {
      id: 'usr_1',
      email: 'admin@example.com',
      status: UserStatus.ACTIVE,
      roles: [UserRole.SUPER_ADMINISTRATOR],
      profile: { firstName: 'System', lastName: 'Admin' },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'usr_2',
      email: 'customer@example.com',
      status: UserStatus.ACTIVE,
      roles: [UserRole.CUSTOMER],
      profile: { firstName: 'John', lastName: 'Doe' },
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-01'),
    }
  ];

  // Map to associate session IDs with User IDs
  private activeSessions: Map<string, string> = new Map();

  // Helper for artificial latency
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  private generateMockSession(): Session {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setHours(now.getHours() + 24); // 24 hour expiry

    return {
      sessionId: `sess_${Math.random().toString(36).substring(2, 15)}`,
      deviceId: 'mock-device-id',
      ipAddress: '127.0.0.1',
      userAgent: 'MockBrowser/1.0',
      issuedAt: now,
      expiresAt: expiresAt,
      lastActivity: now,
    };
  }

  private generateMockPermissions(roles: UserRole[]): Permission[] {
    // In a real app, this comes from a database table joining Roles and Permissions.
    if (roles.includes(UserRole.SUPER_ADMINISTRATOR)) {
      return [{ code: '*', name: 'All Access', description: 'Full system access' }];
    }
    return [{ code: 'profile:read', name: 'Read Profile' }, { code: 'orders:create', name: 'Create Order' }];
  }

  // --- Contract Implementations ---

  async login(credentials: LoginCredentials): Promise<Identity> {
    await this.delay(800); // Simulate network request

    // Since this is a mock, any password works for known emails. 
    // In a real app, the server would compare password hashes here.
    const user = this.users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const session = this.generateMockSession();
    this.activeSessions.set(session.sessionId, user.id);

    return {
      user,
      session,
      permissions: this.generateMockPermissions(user.roles),
      isAuthenticated: true,
    };
  }

  async register(payload: RegisterPayload): Promise<Identity> {
    await this.delay(1000);

    const existingUser = this.users.find((u) => u.email === payload.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: payload.email,
      status: UserStatus.ACTIVE,
      roles: [UserRole.CUSTOMER],
      profile: { firstName: payload.firstName, lastName: payload.lastName },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    const session = this.generateMockSession();
    this.activeSessions.set(session.sessionId, newUser.id);

    return {
      user: newUser,
      session,
      permissions: this.generateMockPermissions(newUser.roles),
      isAuthenticated: true,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.delay(400);
    this.activeSessions.delete(sessionId);
  }

  async refreshSession(sessionId: string): Promise<Identity> {
    await this.delay(600);
    const userId = this.activeSessions.get(sessionId);
    if (!userId) throw new Error('Session not found or expired');
    
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const newSession = this.generateMockSession();
    this.activeSessions.delete(sessionId);
    this.activeSessions.set(newSession.sessionId, userId);

    return {
      user,
      session: newSession,
      permissions: this.generateMockPermissions(user.roles),
      isAuthenticated: true,
    };
  }

  async getCurrentUser(sessionId: string): Promise<User> {
    await this.delay(500);
    const userId = this.activeSessions.get(sessionId);
    if (!userId) throw new Error('Invalid session');
    
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    
    return user;
  }

  async validateSession(sessionId: string): Promise<Session> {
    await this.delay(300);
    if (!this.activeSessions.has(sessionId)) {
      throw new Error('Session revoked or invalid');
    }
    // Return a dummy session object indicating validity
    return this.generateMockSession();
  }

  async changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<void> {
    await this.delay(800);
    // Mock success
  }

  async forgotPassword(email: string): Promise<void> {
    await this.delay(700);
    // Mock sending email
  }

  async resetPassword(recoveryToken: string, newPassword: string): Promise<void> {
    await this.delay(800);
    // Mock success
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    await this.delay(600);
    // Mock success
  }
}