import { ZodError, ZodIssue } from "zod";


const isZodIssueWithReceived = (
  issue: ZodIssue
): issue is ZodIssue & { received: unknown } => "received" in issue;

export const formatZodError = (
  error: ZodError
): {
  path: string;
  message: string;
  expected?: string;
  received?: string;
}[] => {
  return error.issues.map((issue) => {
    const path = issue.path.join(".");
    const expected = "expected" in issue ? String(issue.expected) : undefined;
    const received = isZodIssueWithReceived(issue)
      ? String(issue.received)
      : undefined;

    let message = issue.message;
    if (expected && received) {
      message = `Expected ${expected}, but received ${received}`;
    } else if (expected) {
      message = `Expected ${expected}`;
    } else if (received) {
      message = `Received ${received}`;
    }

    return {
      path,
      message,
      expected,
      received,
    };
  });
};
