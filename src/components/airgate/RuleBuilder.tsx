/**
 * RuleBuilder - Visual JSON rule editor with syntax highlighting.
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AirButton } from '@/components/ui/air-button';
import type { RulesJSON } from '@/air/rules';
import { cn } from '@/lib/utils';

interface RuleBuilderProps {
  initialRule?: RulesJSON;
  onChange?: (rule: RulesJSON) => void;
  className?: string;
}

export function RuleBuilder({ initialRule, onChange, className }: RuleBuilderProps) {
  const [rule, setRule] = useState<string>(
    JSON.stringify(initialRule || { all: [] }, null, 2)
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (value: string) => {
    setRule(value);
    setError('');
    
    try {
      const parsed = JSON.parse(value);
      onChange?.(parsed);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Rule Configuration</label>
        <AirButton
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </AirButton>
      </div>

      <div className="relative">
        <textarea
          value={rule}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            'w-full min-h-[300px] p-4 rounded-xl bg-card border font-mono text-sm resize-y',
            error ? 'border-destructive' : 'border-border',
            'focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          spellCheck={false}
        />
        
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </div>

      <div className="mt-4 p-4 rounded-lg bg-muted/50">
        <h4 className="text-sm font-semibold mb-2">Rule Schema Hints:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <code>all: Rule[]</code> - All rules must pass</li>
          <li>• <code>any: Rule[]</code> - At least one rule must pass</li>
          <li>• <code>rln: {'{windowHours, maxActions}'}</code> - Rate limiting</li>
          <li>• Rule types: credential, claim, geo, onchain</li>
        </ul>
      </div>
    </div>
  );
}
