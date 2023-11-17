import { ZodError } from 'zod';

export const zodToFieldErrors = (error: ZodError) =>
  error.issues.reduce(
    (issues, issue) => ({
      ...issues,
      [issue.path[0]]: issue.message,
    }),
    {},
  );
