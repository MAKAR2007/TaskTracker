//страница отображающая несоответсвие прав доступа требуемому уровню для просмотра содержимого

import Link from "next/link";

export default function Denied() {
  return (
    <section className="flex flex-col items-center gap-12">
      <h1 className="text-5xl">Доступ запрещен</h1>
      <p className="max-w-2xl text-center text-3xl">
        Вы успешно вошли в систему, но уровень доступа недостаточен для
        просмотра данного раздела
      </p>
      <Link href="/" className="text-3xl underline">
        Вернуться на домашнюю страницу
      </Link>
    </section>
  );
}
