"use client";

import { useState, useEffect } from 'react';
import { Folder, Info, User, Mail, AlertCircle, FileText, Download, Trash2 } from 'lucide-react';

interface FileUpload {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  originalName: string;
  filename: string;
  title: string | null;
  notes: string | null;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/admin/files');
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        setFiles([]);
        setLoading(false);
        return;
      }
      
      // Clone response before reading to avoid "body stream already read" error
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();
      if (!text) {
        console.error('Empty response from API');
        setFiles([]);
        setLoading(false);
        return;
      }
      
      const data = JSON.parse(text);
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string, filename: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${filename}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      if (response.ok) {
        alert('Archivo eliminado correctamente');
        fetchFiles(); // Refresh the list
      } else {
        const data = await response.json();
        alert('Error al eliminar: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error al eliminar el archivo');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Archivos Subidos - Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="admin-page-root" style={{ 
      minHeight: "100vh", 
      background: "#f8fafc",
      fontFamily: "inherit"
    }}>
      <style>{`
        .admin-page-root { padding-left: 280px !important; }
        @media (max-width: 1160px) { .admin-page-root { padding-left: 220px !important; } }
        @media (max-width: 767px) { .admin-page-root { padding-left: 0 !important; padding-bottom: 100px !important; } }
      `}</style>
      <div style={{ padding: "clamp(24px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: 0, color: '#0F62FE', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Folder size={32} /> Archivos Subidos - Módulo 6
            </h1>
            <button
              onClick={() => window.location.href = '/modules/menu'}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#0F62FE',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0842A0'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0F62FE'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ← Regresar
            </button>
          </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <strong>Total de archivos:</strong> {files.length}
      </div>

      {files.some(f => f.userName === 'Usuario Migrado' || f.userId === 'unknown') && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Info size={18} color="#92400e" />
            <strong style={{ color: '#92400e' }}>Archivos antiguos detectados</strong>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
            Los archivos marcados como &quot;Usuario Migrado&quot; fueron subidos antes de implementar el sistema de autenticación. 
            Los nuevos archivos mostrarán el nombre y email real del usuario que los sube.
          </p>
        </div>
      )}

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No hay archivos subidos aún.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {file.title || 'Sin título'}
                  </h3>
                  <div style={{ margin: '5px 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                              <User size={14} color="#666" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: file.userName === 'Usuario Migrado' ? '#999' : '#333', 
                        fontWeight: '500',
                        fontStyle: file.userName === 'Usuario Migrado' ? 'italic' : 'normal'
                      }}>
                        {file.userName || 'Usuario Anónimo'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                              <Mail size={14} color="#666" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: file.userEmail === 'migrado@sistema.com' ? '#999' : '#666',
                        fontStyle: file.userEmail === 'migrado@sistema.com' ? 'italic' : 'normal'
                      }}>
                        {file.userEmail || 'sin-email@ejemplo.com'}
                      </span>
                    </div>
                    {(file.userName === 'Usuario Migrado' || file.userId === 'unknown') && (
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#f59e0b', 
                        background: '#fef3c7',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}>
                        <AlertCircle size={11} style={{ marginRight: 4 }} /> Archivo antiguo
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                    Archivo original: {file.originalName}
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', minWidth: '120px' }}>
                  {formatDate(file.uploadedAt)}
                </div>
              </div>
              
              {file.notes && (
                <p style={{ margin: '10px 0', color: '#555', fontStyle: 'italic' }}>
                  &quot;{file.notes}&quot;
                </p>
              )}
              
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                <span><strong>Tamaño:</strong> {formatFileSize(file.size)}</span>
                <span><strong>Tipo:</strong> {file.type}</span>
                <span><strong>Usuario:</strong> {file.userId}</span>
              </div>
              
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={`/api/admin/files/view?path=${encodeURIComponent(file.path)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                    background: '#0F62FE',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0842A0'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0F62FE'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <FileText size={16} /> Ver Archivo
                </a>
                
                <a
                  href={file.path}
                  download={file.originalName}
                  style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                    background: '#10B981',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#10B981'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Download size={16} /> Descargar
                </a>
                
                <button
                  onClick={() => deleteFile(file.id, file.originalName)}
                  style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DC2626'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#EF4444'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
