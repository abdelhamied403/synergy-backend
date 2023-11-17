import { z } from 'zod';
import passwordField from '../shared/passwordField';

const registerSchema = z.object({
  fullName: z.string({
    required_error: 'full name is required',
    invalid_type_error: 'full name must be a string',
  }),
  avatarUrl: z.string({
    required_error: 'avatar is required',
  }),
  username: z
    .string({
      required_error: 'username is required',
      invalid_type_error: 'username must be a string',
    })
    .min(3),
  email: z
    .string({
      required_error: 'email is required',
    })
    .email(),
  password: passwordField,
});

export default registerSchema;
