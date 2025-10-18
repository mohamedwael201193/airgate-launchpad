/**
 * PassportProgress - Visual display of user's credential status.
 */

import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AirCredential } from '@/air/airkit';
import { Badge } from '@/components/ui/badge';

interface PassportProgressProps {
  credentials?: AirCredential[];
  className?: string;
}

export function PassportProgress({ credentials = [], className }: PassportProgressProps) {
  const getStatusIcon = (status: AirCredential['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-accent" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-warn" />;
      case 'revoked':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: AirCredential['status']) => {
    switch (status) {
      case 'active':
        return 'bg-accent/10 border-accent/20';
      case 'expired':
        return 'bg-warn/10 border-warn/20';
      case 'revoked':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted/10 border-border';
    }
  };

  if (credentials.length === 0) {
    return (
      <div className={cn('p-6 rounded-xl bg-card border border-border', className)}>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No credentials found</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Complete verification to earn credentials
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 rounded-xl bg-card border border-border', className)}>
      <h3 className="font-display font-semibold text-lg mb-4">Your Passport</h3>
      
      <div className="space-y-3">
        {credentials.map((cred, index) => (
          <motion.div
            key={cred.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              getStatusColor(cred.status)
            )}
          >
            {getStatusIcon(cred.status)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{cred.type}</p>
                <Badge variant="outline" className="text-xs">
                  {cred.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Issued {new Date(cred.issuedAt).toLocaleDateString()}
                {cred.expiresAt && ` • Expires ${new Date(cred.expiresAt).toLocaleDateString()}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Completion</span>
          <span className="text-sm font-semibold">
            {credentials.filter(c => c.status === 'active').length} / {credentials.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(credentials.filter(c => c.status === 'active').length / credentials.length) * 100}%`
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-cosmic"
          />
        </div>
      </div>
    </div>
  );
}
