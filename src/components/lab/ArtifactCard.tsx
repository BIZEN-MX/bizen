'use client';

import React from 'react';
import { FileText, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ArtifactCardProps {
  title: string;
  type: string;
  content?: string | null;
  url?: string | null;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ArtifactCard({
  title,
  type,
  content,
  url,
  createdAt,
  onEdit,
  onDelete,
  className
}: ArtifactCardProps) {
  const date = new Date(createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {url ? (
              <LinkIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-purple-500" />
            )}
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">
                {type} · {date}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      {(content || url) && (
        <CardContent>
          {content && (
            <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-2"
            >
              Ver recurso
              <LinkIcon className="w-3 h-3" />
            </a>
          )}
        </CardContent>
      )}
    </Card>
  );
}

