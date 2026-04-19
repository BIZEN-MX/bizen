// Workaround for Next.js Turbopack ESM/CJS interop issue with Resend 6.1.3
export const getResend = async () => {
    const mod = await import('resend');
    const ResendClass = mod.Resend || (mod as any).default?.Resend || (mod as any).default;
    return new ResendClass(process.env.RESEND_API_KEY!);
};
