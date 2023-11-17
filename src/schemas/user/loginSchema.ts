import { z } from 'zod';
import passwordField from '../shared/passwordField';

const loginSchema = z.object({
  usernameOrEmail: z.string({
    required_error: 'username or email is required',
  }),
  password: passwordField,
});

export default loginSchema;
