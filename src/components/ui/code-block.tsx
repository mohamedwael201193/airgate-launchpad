/**
 * CodeBlock - Syntax-highlighted code display with copy button.
 */

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AirButton } from './air-button';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', className, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('relative group', className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AirButton
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </AirButton>
      </div>
      
      <pre className="overflow-x-auto rounded-xl bg-card border border-border p-4">
        <code className="text-sm font-mono text-muted-foreground">
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="pr-4 text-right select-none text-muted-foreground/50 w-8">
                      {i + 1}
                    </td>
                    <td className="text-foreground">{line || '\n'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className="text-foreground">{code}</span>
          )}
        </code>
      </pre>
      
      {language && (
        <div className="absolute left-4 top-2 text-xs font-mono text-muted-foreground/70 uppercase">
          {language}
        </div>
      )}
    </div>
  );
}
