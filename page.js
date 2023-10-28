import Image from "next/image";
import StickyTop from "./components/StickyTop";
import Signup from "./components/Signup";
import PrjList from "./components/PrjList";

export default function Home() {
  return (
    <>
      <div className="isolate  ">
        <div className="from-bgmain-100 relative isolate -z-10 h-screen  bg-gradient-to-b p-4 pt-14">
          <div
            className="shadow-accent-600/10 absolute inset-y-0 right-2/3 -z-10 -mr-96 h-full w-[200%] origin-top-right skew-x-[-25deg] bg-white shadow-xl ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-5xl">
            <StickyTop />
            <section className="m-auto  max-w-5xl   lg:flex lg:flex-row lg:items-center ">
              <div className=" w-full lg:w-3/5">
                <h1 className=" mx-auto mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:mt-16 lg:text-5xl  ">
                  УК ПК: Эффективное Управление Задачами и Проектами с Ментором
                  задач.
                </h1>

                <p className=" text-md mx-auto mt-8  leading-8 text-gray-600 sm:mt-16 lg:text-2xl">
                  Ментор задач - ваш верный спутник в организации, планировании
                  и контроле задач и проектов. Улучшайте продуктивность,
                  определяйте приоритеты, сотрудничайте в команде и успешно
                  достигайте целей вместе с нами.
                </p>
                <div className="mt-4">
                  <PrjList />
                </div>
              </div>
              <div className="  w-full lg:w-2/5">
                <Image
                  src="/HomePage.png"
                  height="100"
                  width="100"
                  className=" mx-auto mt-8 w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none "
                  alt="HomePage image"
                />
              </div>
            </section>
            <Signup />
          </div>
        </div>
      </div>
    </>
  );
}
