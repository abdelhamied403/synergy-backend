import { z } from 'zod';

const passwordField = z
  .string({
    required_error: 'password is required',
  })
  .regex(new RegExp('.*[A-Z].*'), 'one uppercase character')
  .regex(new RegExp('.*[a-z].*'), 'one lowercase character')
  .regex(new RegExp('.*\\d.*'), 'one number')
  .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), 'one special character')
  .min(8, 'must be at least 8 characters in length');

export default passwordField;
