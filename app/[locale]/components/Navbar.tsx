import { type Locale } from "../../../i18n-config";
import NavDropdown from "./NavDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavDict {
  home: string;
  work: string;
  reviews: string;
  services: string;
  workflow: string;
  about: string;
  contact: string;
}

interface NavbarProps {
  locale: Locale;
  nav: NavDict;
}

export default function Navbar({ locale, nav }: NavbarProps) {
  const sections = [
    { id: "home", label: nav.home },
    { id: "work", label: nav.work },
    { id: "testimonials", label: nav.reviews },
    { id: "services", label: nav.services },
    { id: "process", label: nav.workflow },
    { id: "about", label: nav.about },
    { id: "contact", label: nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-zinc-100 bg-white/90 px-4 backdrop-blur-md md:px-8">
      {/* Logo */}
      <a
        href={`/${locale}`}
        className="text-sm font-semibold tracking-widest text-zinc-900 uppercase hover:text-indigo-600 transition-colors"
      >
        JG<span className="text-indigo-600">.</span>
      </a>

      {/* Nav + Language */}
      <div className="flex items-center gap-4">
        <NavDropdown sections={sections} />
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
