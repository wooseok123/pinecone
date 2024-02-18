export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      하이
      <div>{children}</div>
      <div>{children}</div>
    </div>
  );
}
