import { z } from 'zod';

const editProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

export default editProfileSchema;
