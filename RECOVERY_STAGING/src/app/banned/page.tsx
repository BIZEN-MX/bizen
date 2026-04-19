import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function BannedPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
      <div style={{ maxWidth: 500, width: '100%', background: 'white', padding: 40, borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShieldAlert size={40} color="#dc2626" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Cuenta Suspendida</h1>
        <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 32 }}>
          Tu acceso a BIZEN ha sido restringido por violar los términos de seguridad o comportamiento institucional. 
          Si crees que esto es un error, contacta a la administración de tu escuela.
        </p>
        <Link 
          href="/" 
          style={{ padding: '12px 24px', background: '#0f172a', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
