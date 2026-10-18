export default function NotFound() {
  return (
    <main className="desktop" style={{ display: "grid", placeItems: "center" }}>
      <section className="window" style={{ position: "static", width: 360 }}>
        <div className="about">
          <h1 className="doc-title">This item can’t be found.</h1>
          <p className="about-intro">
            It may have been moved or deleted. Everything lives on the desktop.
          </p>
          <a className="button" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`}>
            Go to Desktop
          </a>
        </div>
      </section>
    </main>
  );
}
