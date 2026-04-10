// src/app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: "Iniciar Sesión | BIZEN",
  description: "Accede a tu cuenta de BIZEN y continúa tu camino hacia la maestría financiera.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
       <div className="flex h-screen w-screen items-center justify-center bg-[#020e27]">
          <PageLoader />
       </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
