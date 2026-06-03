import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerBrand">
           <Link href="/" className="siteBrand">
            <Image
              src="/images/logo/logo.svg"
              alt="QuizUp"
              width={100}
              height={50}
              priority
            />
          </Link>
  

          <p className="footerDesc">
            Des quiz gratuits pour tester tes connaissances : culture générale,
            histoire, géographie, science, cinéma et bien plus encore.
          </p>
        </div>

        <nav className="footerCol" aria-label="Explorer">
          <h2>Explorer</h2>

          <Link href="/">Accueil</Link>
          <Link href="/quiz">Tous les quiz</Link>
          <Link href="/categorie/culture-generale">Quiz culture générale</Link>
          <Link href="/personalite">Tests de personnalité</Link>
                <Link href="/jeux">Jeux</Link>
        </nav>

        <nav className="footerCol" aria-label="Catégories">
          <h2>Catégories</h2>

          <Link href="/categorie/culture-generale">Culture générale</Link>
          <Link href="/categorie/histoire">Histoire</Link>
          <Link href="/categorie/geographie">Géographie</Link>
          <Link href="/categorie/sciences">Sciences</Link>
          <Link href="/categorie/cinema">Cinéma</Link>
        </nav>

        <nav className="footerCol" aria-label="Informations sur le site">
          <h2>Site</h2>

          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/conditions">Conditions d&apos;utilisation</Link>
          <Link href="/politique-confidentialite">
            Politique de confidentialité
          </Link>
        </nav>
      </div>

      <div className="footerBottom">
        <div>© {new Date().getFullYear()} QuizUp</div>

        <div className="footerLegal">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
