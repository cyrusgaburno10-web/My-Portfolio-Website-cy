export function PageContainer({
  id,
  children,
  divider = true,
}: {
  id?: string;
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      {divider && <div className="pulse-divider" aria-hidden="true" />}
      <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  as: Heading = 'h1',
}: {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div className="mb-12 max-w-2xl sm:mb-16">
      <Heading className="font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">{title}</Heading>
      {subtitle && <p className="mt-4 text-[15px] leading-relaxed text-ash">{subtitle}</p>}
    </div>
  );
}
