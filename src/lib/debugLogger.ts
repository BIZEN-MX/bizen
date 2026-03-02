import { appendFileSync } from 'fs';
import { join } from 'path';

export function logToFile(message: string) {
    const logPath = join(process.cwd(), 'debug_purchase.log');
    const timestamp = new Date().toISOString();
    appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}
