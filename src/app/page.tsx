import BasicsForm from "@/components/BasicsForm";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            JSON Resume Builder
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create your resume following the{" "}
            <a
              href="https://jsonresume.org/schema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              JSON Resume
            </a>{" "}
            standard
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BasicsForm />
      </main>
    </div>
  );
}
