'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';

interface TrackCardProps {
  id: string;
  keyName: string;
  title: string;
  description: string | null;
  order: number;
  completedSteps: number;
  totalSteps: number;
  className?: string;
}

export function TrackCard({
  keyName,
  title,
  description,
  completedSteps,
  totalSteps,
  className
}: TrackCardProps) {
  const isCompleted = completedSteps === totalSteps && totalSteps > 0;

  return (
    <Link href={`/business-lab/track/${keyName}`}>
      <Card
        className={cn(
          'hover:shadow-lg transition-all duration-300 cursor-pointer border-2',
          isCompleted
            ? 'border-green-200 bg-green-50/30'
            : 'border-gray-200 hover:border-blue-300',
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-2">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar
            current={completedSteps}
            total={totalSteps}
            showNumbers={true}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

