
import { randomUUID, randomInt } from "crypto";

export function createSessionId(): string {
    return randomUUID();
}
export function generateVerificationCode(): string {
    return randomInt(100000, 1000000).toString();
}