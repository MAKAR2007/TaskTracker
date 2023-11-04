import Logo from "./Logo";
import Login from "./Login";

//компонент верхней строки состояния с логотипом и кнопками входа в систему/статусом регистрации

export default function StickyTop() {
  return (
    <>
      <div className=" top-0 z-40 mx-auto flex max-w-5xl items-center justify-between gap-x-6 px-4 py-4  sm:px-6 2xl:max-w-full 2xl:shadow-none ">
        <Logo />

        <Login />
      </div>
    </>
  );
}
