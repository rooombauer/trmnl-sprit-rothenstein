export function SiteFooter({ siteName, line }: { siteName: string; line: string }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <span>
          © {new Date().getFullYear()} {siteName}
        </span>
        <span>{line}</span>
      </div>
    </footer>
  );
}
