export default function Logo() {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <a href="/" className="-m-1.5 p-1.5 ">
          <span className="sr-only">Компания</span>
          <img className="h-8 w-auto" src="/logo.png" alt="Компания" />
        </a>
      </div>
    </>
  );
}
