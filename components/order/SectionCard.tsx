interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="w-full rounded-[14px] border border-border p-4">
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
