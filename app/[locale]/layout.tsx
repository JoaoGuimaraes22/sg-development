import type { Metadata } from "next";
import { type Locale } from "../../i18n-config";
import { getDictionary } from "../../get-dictionary";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

const SITE_URL = "https://your-domain.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const dict = await getDictionary(locale);

  const title = "João Guimarães — Web Designer & Developer";
  const description =
    locale === "pt"
      ? "Web Designer, Desenvolvedor e Estrategista de Marketing baseado em Portugal. Disponível para freelance."
      : "Web Designer, Developer & Marketing Strategist based in Portugal. Available for freelance.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        pt: `${SITE_URL}/pt`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: dict.hero.name,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
      locale: locale === "pt" ? "pt_PT" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "João Guimarães",
    jobTitle: "Web Designer, Developer & Marketing Strategist",
    url: `${SITE_URL}/${locale}`,
    email: "Jssgmrs22@gmail.com",
    sameAs: [
      "https://github.com/JoaoGuimaraes22",
      "https://www.linkedin.com/in/joão-sebastião-guimarães-4abaa7197/",
    ],
    knowsAbout: ["Web Design", "Web Development", "Digital Marketing", "SEO", "Branding"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Navbar locale={locale} nav={dict.nav} />
      {children}
      <ChatWidget locale={locale} />
    </>
  );
}
