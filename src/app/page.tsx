import { SiteHeader } from "@/components/SiteHeader";
import { ContactForm } from "@/components/ContactForm";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-4 py-16 text-white sm:py-24">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-gold/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent-teal/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-2 sm:px-6">
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
              Full Stack Internship Project
            </p>
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Because every woman deserves to say &ldquo;She Can.&rdquo;
            </h1>
            <p className="mt-4 max-w-xl text-lg text-brand-100">
              She Can Foundation connects women and girls with education, mentorship,
              and opportunities to build confident futures.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-semibold text-brand-900">
                Our mission
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We believe talent is universal, but opportunity is not. Through
                scholarships, skill-building workshops, and community support, we help
                women turn ambition into achievement.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { title: "Education", desc: "Scholarships and learning resources" },
                  { title: "Mentorship", desc: "Guidance from industry leaders" },
                  { title: "Community", desc: "A network that lifts each other up" },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-xl border border-brand-100 bg-white p-4 shadow-soft"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 font-semibold">
                      {item.title[0]}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-800">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div id="contact">
              <h2 className="font-display text-3xl font-semibold text-brand-900">
                Get in touch
              </h2>
              <p className="mt-2 mb-6 text-gray-600">
                Have a question, partnership idea, or want to volunteer? We&apos;d love to
                hear from you.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-100 bg-white py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} She Can Foundation. Built with purpose.</p>
      </footer>
    </div>
  );
}
