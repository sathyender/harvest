import { Prisma } from "@prisma/client";

export type DatabaseFailureKind =
  | "missing_configuration"
  | "invalid_configuration"
  | "unreachable"
  | "authentication_failed"
  | "schema_error"
  | "unavailable";

function errorCode(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
  if (error instanceof Prisma.PrismaClientInitializationError) return error.errorCode;
  return undefined;
}

export function databaseFailureKind(error: unknown): DatabaseFailureKind {
  if (!process.env.DATABASE_URL?.trim()) return "missing_configuration";

  const code = errorCode(error);
  if (code === "P1000" || code === "P1010") return "authentication_failed";
  if (code === "P1001" || code === "P1002") return "unreachable";
  if (code === "P1003" || code === "P2021" || code === "P2022") return "schema_error";

  const message = error instanceof Error ? error.message : String(error);
  if (/invalid.*(url|connection)|invalid connection string/i.test(message)) return "invalid_configuration";
  if (/ECONNREFUSED|ENOTFOUND|EHOSTUNREACH|ETIMEDOUT|can't reach|timed out|connect/i.test(message)) return "unreachable";
  return "unavailable";
}

export function databaseUserMessage(error: unknown) {
  switch (databaseFailureKind(error)) {
    case "missing_configuration":
      return "Database configuration is missing. Set DATABASE_URL on the server and restart the application.";
    case "invalid_configuration":
      return "Database configuration is invalid. Check the server DATABASE_URL format.";
    case "unreachable":
      return "The database server is temporarily unreachable. Check the database status and network connection.";
    case "authentication_failed":
      return "The database rejected the server credentials. Check DATABASE_URL without exposing it to the browser.";
    case "schema_error":
      return "The database schema is not ready for this application. Apply the reviewed schema before retrying.";
    default:
      return "Database access is temporarily unavailable. Please try again later.";
  }
}

export function databaseLogDetails(error: unknown) {
  return { kind: databaseFailureKind(error), code: errorCode(error) };
}
