import { SiGoogle, SiOpenai, SiMeta } from 'react-icons/si';
import { FaMicrosoft } from 'react-icons/fa';

export default function SocialProof() {
  const logos = [
    { name: 'Google', icon: SiGoogle },
    { name: 'Microsoft', icon: FaMicrosoft },
    { name: 'OpenAI', icon: SiOpenai },
    { name: 'Meta', icon: SiMeta },
  ];

  return (
    <section className="py-12 border-y border-border/40 bg-background/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-8">
          TRUSTED BY PROMPT ENGINEERS AT LEADING ORGANIZATIONS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <logo.icon className="h-6 w-6" />
              <span className="text-lg font-semibold tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
