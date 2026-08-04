import { User, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { UserRepository } from '../../repositories/user-repository';

/**
 * Prisma implementation of the UserRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaUserRepository 
  extends PrismaBaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> 
  implements UserRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.user) to the base repository
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findByRole(roleName: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        roles: {
          some: {
            name: roleName,
          },
        },
      },
    });
  }
}