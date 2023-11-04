// import SideBar from "./components/Sidebar";
import AuthProvider from "./context/AuthProvider";
import { SelectedProvider } from "./context/SelectedProvider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskMentor",
  description: "Generated for UK PK",
};

//функция layout задающая общие параметры для всех страниц приложения
//в качестве параметра получает странцы приложения
export default function RootLayout({ children }) {
  return (
    <html className="" lang="en">
      <body className={`${inter.className}  `}>
        <AuthProvider>
          <SelectedProvider>
            <main className="  p min-w-[300px]">{children}</main>
          </SelectedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
