import { LoginForm } from "@/app/login/login-form";

type LoginPageProps = {
  searchParams: Promise<{ role?: string }>;
};

function accountKind(role: string | undefined) {
  return role === "visitor" ? "Visiteur" : "Vigneron";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { role } = await searchParams;
  const kind = accountKind(role);

  return (
    <main className="flex flex-1 items-center justify-center bg-stone-50 px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-8 shadow-[0_16px_40px_rgba(44,50,44,0.08)]">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8b9288]">
          Connexion
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#2c322c]">
          Connexion {kind}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#5c5146]">
          Connectez-vous avec votre e-mail et votre mot de passe.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
