import Link from "next/link";
import {
  getAllGames,
  getGameTypes,
  formatGameType,
  type Game,
} from "@/lib/games";

export const metadata = {
  title: "Jeux gratuits | Mini-jeux, quiz emoji, pendu et défis",
  description:
    "Découvre nos jeux gratuits : Emoji Quiz, Pendu, Mot mystère, Drapeaux, Plus ou moins et autres mini-jeux rapides à jouer en ligne.",
};

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickBalancedByType(items: Game[], limit = 16): Game[] {
  const byType = new Map<string, Game[]>();

  for (const item of shuffleArray(items)) {
    if (!byType.has(item.type)) {
      byType.set(item.type, []);
    }

    byType.get(item.type)!.push(item);
  }

  const types = shuffleArray(Array.from(byType.keys()));
  const result: Game[] = [];

  let index = 0;

  while (result.length < limit) {
    let added = false;

    for (const type of types) {
      const item = byType.get(type)?.[index];

      if (item) {
        result.push(item);
        added = true;

        if (result.length >= limit) break;
      }
    }

    if (!added) break;

    index++;
  }

  return result;
}

export default function GamesPage() {
  const games = getAllGames();
  const gameTypes = getGameTypes();

  const newGamesRaw = games.filter((game) => game.isNew);

  const newGames = pickBalancedByType(
    newGamesRaw.length ? newGamesRaw : games,
    16
  );

  const newGameSlugs = new Set(
    newGames.map((game) => game.slug)
  );

  const popularGamesRaw = games.filter(
    (game) =>
      game.isPopular && !newGameSlugs.has(game.slug)
  );

  const popularGames = pickBalancedByType(
    popularGamesRaw.length
      ? popularGamesRaw
      : games.filter(
          (game) => !newGameSlugs.has(game.slug)
        ),
    16
  );

  return (
    <main className="home">
      <section className="heroLandingSection heroLandingSectionGame">
        <div className="heroLandingContent">
          <h1 className="heroLandingTitle">
            Jeux gratuits en ligne
          </h1>

          <p className="heroLandingSub">
            Découvre nos mini-jeux gratuits : Emoji Quiz,
            Pendu, Mot mystère, Drapeaux, Plus ou moins
            et bien d'autres défis rapides à jouer en ligne.
          </p>

          {games[0] ? (
            <div className="heroCtas">
              <Link
                className="homeBtnPrimary"
                href={`/jeux/${games[0].slug}`}
              >
                Jouer maintenant
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">
            Choisis un type de jeu
          </h2>
        </div>

        {gameTypes.length > 0 ? (
          <div className="gamesTypesGrid">
            {gameTypes.map((gameType) => (
              <Link
                key={gameType.slug}
                href={gameType.href}
                className="catCard"
                style={{
                  backgroundImage: `url("${gameType.image ?? ""}")`,
                }}
                aria-label={`Jouer à ${gameType.title}`}
              >
                <span className="catCardOverlay" />
                <span className="catCardName">
                  {gameType.title}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="emptyState">
            Aucun type de jeu disponible pour le moment.
          </p>
        )}
      </section>

      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">
            Nouveaux jeux
          </h2>
        </div>

        {newGames.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {newGames.map((game) => (
                <Link
                  key={game.slug}
                  href={`/jeux/${game.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${
                      game.images?.cover ??
                      game.images?.thumbnail ??
                      ""
                    }")`,
                  }}
                  aria-label={`Jouer à ${game.title}`}
                >
                  <span className="quizBadge">
                    Nouveau
                  </span>

                  <span className="quizCategory">
                    {formatGameType(game.type)}
                  </span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">
                    {game.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">
            Aucun nouveau jeu pour le moment.
          </p>
        )}
      </section>

      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">
            Jeux populaires
          </h2>
        </div>

        {popularGames.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {popularGames.map((game) => (
                <Link
                  key={game.slug}
                  href={`/jeux/${game.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${
                      game.images?.cover ??
                      game.images?.thumbnail ??
                      ""
                    }")`,
                  }}
                  aria-label={`Jouer à ${game.title}`}
                >
                  <span className="quizCategory">
                    {formatGameType(game.type)}
                  </span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">
                    {game.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">
            Aucun autre jeu populaire pour le moment.
          </p>
        )}
      </section>

      <section className="homeSection homePart">
        <div className="sectionHead">
          <h2 className="sectionTitle">
            Tous les jeux
          </h2>
        </div>

        {games.length > 0 ? (
          <div className="row">
            <div className="rowTrack">
              {games.map((game) => (
                <Link
                  key={game.slug}
                  href={`/jeux/${game.slug}`}
                  className="quizCard"
                  style={{
                    backgroundImage: `url("${
                      game.images?.cover ??
                      game.images?.thumbnail ??
                      ""
                    }")`,
                  }}
                  aria-label={`Jouer à ${game.title}`}
                >
                  {game.isNew ? (
                    <span className="quizBadge">
                      Nouveau
                    </span>
                  ) : null}

                  <span className="quizCategory">
                    {formatGameType(game.type)}
                  </span>

                  <span className="quizCardOverlay" />

                  <span className="quizCardTitle">
                    {game.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="emptyState">
            Aucun jeu disponible pour le moment.
          </p>
        )}
      </section>

      <section className="homeSection homePart homeSeo">
        <h2 className="homeSeoTitle">
          Des jeux rapides, gratuits et amusants
        </h2>

        <p className="homeSeoText">
          Nos mini-jeux sont pensés pour être simples à
          lancer, rapides à jouer et faciles à partager. Que
          tu préfères les quiz emoji, les jeux de mots, les
          défis de culture générale ou les jeux de logique, tu
          peux tester tes connaissances et améliorer ton score
          à chaque partie.
        </p>
      </section>
    </main>
  );
}