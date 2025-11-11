'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StepCardProps {
  id: string;
  title: string;
  description: string | null;
  order: number;
  required: boolean;
  isCompleted: boolean;
  isLocked?: boolean;
  className?: string;
}

export function StepCard({
  id,
  title,
  description,
  order,
  required,
  isCompleted,
  isLocked = false,
  className
}: StepCardProps) {
  const content = (
    <Card
      className={cn(
        'transition-all duration-200',
        isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md cursor-pointer',
        isCompleted && 'border-green-200 bg-green-50/30',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">
                {order}. {title}
              </CardTitle>
              {required && (
                <Badge variant="outline" className="text-xs">
                  Requerido
                </Badge>
              )}
              {isCompleted && (
                <Badge className="text-xs bg-green-600">Completado</Badge>
              )}
            </div>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  if (isLocked) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={`/business-lab/step/${id}`} className={className}>
      {content}
    </Link>
  );
}

