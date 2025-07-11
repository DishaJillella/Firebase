'use client';

import { useState, useTransition } from 'react';

import { generateFirebaseSnippet } from '@/ai/flows/generate-firebase-snippet';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Check,
  Code,
  Copy,
  Database,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';

const languages = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
];

const services = [
  {
    value: 'Authentication',
    label: 'Authentication',
    icon: <Lock className="mr-2 h-4 w-4" />,
  },
  {
    value: 'Firestore',
    label: 'Firestore',
    icon: <Database className="mr-2 h-4 w-4" />,
  },
];

export function FirestarterGenerator() {
  const [language, setLanguage] = useState<string>('');
  const [firebaseService, setFirebaseService] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!language || !firebaseService) {
      toast({
        title: 'Selection missing',
        description: 'Please select both a language and a Firebase service.',
        variant: 'destructive',
      });
      return;
    }
    setCodeSnippet('');
    startTransition(async () => {
      try {
        const result = await generateFirebaseSnippet({
          language,
          firebaseService,
        });
        setCodeSnippet(result.codeSnippet);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Generation Failed',
          description: 'Could not generate the code snippet. Please try again.',
          variant: 'destructive',
        });
        setCodeSnippet(
          '// An error occurred. Please check the console for details.'
        );
      }
    });
  };

  const handleCopy = () => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle className="text-2xl">Snippet Generator</CardTitle>
        <CardDescription>
          Select a language and a Firebase service to generate a starter
          snippet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select onValueChange={setLanguage} value={language}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    {lang.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setFirebaseService} value={firebaseService}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map(service => (
                <SelectItem key={service.value} value={service.value}>
                  <div className="flex items-center">
                    {service.icon}
                    {service.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(isPending || codeSnippet) && (
          <div className="relative rounded-lg bg-black/30 p-4 min-h-[16rem] animate-in fade-in duration-500">
            {isPending ? (
              <div className="flex h-full min-h-[16rem] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 transition-opacity hover:bg-white/20"
                  onClick={handleCopy}
                  aria-label="Copy code snippet"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  <code className="font-code text-foreground">
                    {codeSnippet}
                  </code>
                </pre>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Snippet
        </Button>
      </CardFooter>
    </Card>
  );
}
