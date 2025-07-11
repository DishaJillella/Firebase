import { FirestarterGenerator } from '@/components/firestarter-generator';
import { Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center mb-10">
          <div className="rounded-full bg-primary/10 p-4 border border-primary/20">
            <Flame className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold font-headline text-foreground tracking-tight">
            FireStarter
          </h1>
          <p className="max-w-md text-muted-foreground">
            Your personal Firebase assistant. Instantly generate starter code
            snippets and ignite your next project.
          </p>
        </div>
        <FirestarterGenerator />
      </main>
    </div>
  );
}
