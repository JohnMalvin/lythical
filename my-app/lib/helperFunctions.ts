
import { randomUUID } from "crypto";

export function createSessionId(): string {
    return randomUUID();
}
