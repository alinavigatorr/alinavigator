import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, Session } from '@prisma/client';

import { AuthDataSource } from './auth-data-source';
import { PrismaUserRepository } from '../../database/prisma/repositories/prisma-user-repository';
import { PrismaSessionRepository } from '../../database/prisma/repositories/prisma-session-repository';
import { 
  LoginDTO, 
  RegisterDTO, 
  ChangePasswordDTO, 
  AuthResult, 
  UserResponseDTO 
} from './dto/auth.dto';

/**
 * Real Database implementation of AuthDataSource using Prisma Repositories.
 */
export class PrismaAuthDataSource implements AuthDataSource {
  
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly sessionRepository: PrismaSessionRepository
  ) {}

  async login(credentials: LoginDTO): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Generate a secure session token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.sessionRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });

    return {
      user: this.mapToUserResponse(user),
      token,
    };
  }

  async register(data: RegisterDTO): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const newUser = await this.userRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      isEmailVerified: false,
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.sessionRepository.create({
      token,
      userId: newUser.id,
      expiresAt,
    });

    return {
      user: this.mapToUserResponse(newUser),
      token,
    };
  }

  async logout(token: string): Promise<boolean> {
    const session = await this.sessionRepository.findByToken(token);
    if (session) {
      await this.sessionRepository.delete(session.id);
      return true;
    }
    return false;
  }

  async validateSession(token: string): Promise<boolean> {
    const session = await this.sessionRepository.findByToken(token);
    
    if (!session) return false;
    if (new Date() > session.expiresAt) {
      await this.sessionRepository.delete(session.id);
      return false;
    }
    
    return true;
  }

  async refreshSession(token: string): Promise<string> {
    const isValid = await this.validateSession(token);
    if (!isValid) {
      throw new Error('Invalid or expired session');
    }

    const session = await this.sessionRepository.findByToken(token);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await this.sessionRepository.update(session!.id, {
      expiresAt: newExpiresAt,
    });

    return token;
  }

  async getCurrentUser(token: string): Promise<UserResponseDTO | null> {
    const isValid = await this.validateSession(token);
    if (!isValid) return null;

    const session = await this.sessionRepository.findByToken(token);
    if (!session) return null;

    const user = await this.userRepository.findById(session.userId);
    if (!user) return null;

    return this.mapToUserResponse(user);
  }

  async changePassword(userId: string, data: ChangePasswordDTO): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isOldPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 12);
    
    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
    });

    // Optionally: invalidate all other active sessions here

    return true;
  }

  async verifyEmail(token: string): Promise<boolean> {
    // In a real implementation, you'd check a verification token repository.
    // For this flow, assuming the token directly matches a stored verification string on the user.
    // *Implementation depends on the schema (e.g. user.verificationToken).*
    
    // Fallback logic assuming verification is handled via a generic approach:
    throw new Error('Method not completely implemented: verifyEmail requires EmailVerificationRepository');
  }

  /**
   * Helper method to map the Prisma User entity to a safe DTO,
   * stripping out sensitive fields like passwordHash.
   */
  private mapToUserResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }
}