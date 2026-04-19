import { appendFileSync } from 'fs';
import { join } from 'path';

export function logToFile(message: string) {
    try {
        const logPath = join(process.cwd(), 'debug_purchase.log');
        const timestamp = new Date().toISOString();
        appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        console.error("DEBUG LOG ERROR:", e);
    }
}
