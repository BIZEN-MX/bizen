import { prisma } from './prisma';
import { NextRequest } from 'next/server';

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'UPDATE_PROFILE' 
  | 'PURCHASE' 
  | 'SUBMIT_QUIZ' 
  | 'ADMIN_ACTION' 
  | 'DELETE_ENTITY'
  | 'CREDIT_SIM_RUN';

export interface AuditLogOptions {
  userId: string;
  action: AuditAction | string;
  entityType: string;
  entityId: string;
  oldData?: any;
  newData?: any;
  request?: NextRequest;
}

/**
 * Notifica acciones críticas en la base de datos de auditoría.
 */
export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  oldData,
  newData,
  request
}: AuditLogOptions) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for') || null;
    const userAgent = request?.headers.get('user-agent') || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
        newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // No queremos que un error en los logs detenga la aplicación
    console.error('❌ Error writing to audit log:', error);
  }
}
