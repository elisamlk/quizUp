export type ScienceTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image?: string;
};

export const scienceTopics: ScienceTopic[] = [
  {
    slug: "astronomie-espace",
    name: "Astronomie et espace",
    shortDescription:
      "Explore le Système solaire, les planètes, la Lune, le Soleil, les étoiles et les grandes missions spatiales.",
    seoTitle:
      "Quiz Astronomie et Espace - Planètes, étoiles et exploration spatiale",
    seoDescription:
      "Découvre nos quiz sur l'astronomie et l'espace : Système solaire, planètes, Soleil, Lune, Mars, constellations et exploration spatiale. Teste tes connaissances sur l'Univers et les grandes missions qui ont permis à l'humanité d'explorer l'espace.",
    intro:
      "De la surface de Mars aux constellations visibles dans le ciel, l'espace regorge de phénomènes fascinants. Retrouve ici tous nos quiz consacrés à l'astronomie, au Système solaire et à l'exploration spatiale. Planètes, Soleil, Lune, étoiles et grandes missions : découvre jusqu'où vont tes connaissances sur l'Univers.",
    image: "/images/sciences-topics/astronomie-espace.jpg",
  },

  {
    slug: "corps-humain-sante",
    name: "Corps humain et santé",
    shortDescription:
      "Teste tes connaissances sur le corps humain, les organes, le cerveau, l'ADN, la nutrition et la santé.",
    seoTitle:
      "Quiz Corps Humain et Santé - Anatomie, cerveau, ADN et nutrition",
    seoDescription:
      "Teste tes connaissances avec nos quiz sur le corps humain et la santé. Anatomie, organes, cerveau, ADN, nutrition, microbiologie et histoire de la médecine : découvre le fonctionnement du corps et les grandes notions scientifiques liées à la santé.",
    intro:
      "Le corps humain est une machine biologique d'une incroyable complexité. Du cerveau aux organes, en passant par l'ADN, la nutrition et les micro-organismes, découvre nos quiz consacrés au fonctionnement du corps et aux sciences de la santé. Une sélection pour apprendre, réviser et parfois découvrir des phénomènes étonnants.",
    image: "/images/sciences-topics/corps-humain-sante.jpg",
  },

  {
    slug: "physique-chimie",
    name: "Physique et chimie",
    shortDescription:
      "Révise les grandes notions de physique et de chimie à travers des quiz sur la matière, l'énergie, les forces et les phénomènes scientifiques.",
    seoTitle:
      "Quiz Physique et Chimie - Teste tes connaissances scientifiques",
    seoDescription:
      "Retrouve nos quiz de physique et de chimie pour tester tes connaissances sur l'électricité, les forces, les mouvements, la chaleur, la matière et les phénomènes scientifiques. Des questions accessibles pour réviser les notions essentielles et mieux comprendre les lois qui expliquent le monde qui nous entoure.",
    intro:
      "Pourquoi les objets tombent-ils ? Comment fonctionne l'électricité ? Que se passe-t-il lorsque la matière se transforme ? La physique et la chimie permettent d'expliquer une grande partie des phénomènes qui nous entourent. Retrouve ici nos quiz sur les forces, les mouvements, l'énergie, la chaleur, l'électricité, la matière et les expériences scientifiques.",
    image: "/images/sciences-topics/physique-chimie.jpg",
  },

  {
    slug: "sciences-du-vivant",
    name: "Sciences du vivant",
    shortDescription:
      "Explore les cellules, l'ADN, les micro-organismes, la nutrition et l'évolution du vivant.",
    seoTitle:
      "Quiz Sciences du Vivant - Cellules, ADN, microbiologie et biologie",
    seoDescription:
      "Découvre nos quiz sur les sciences du vivant et la biologie : cellules, ADN, hérédité, bactéries, virus, nutrition, anatomie et paléontologie. Teste tes connaissances sur les mécanismes du vivant et les phénomènes qui permettent de mieux comprendre les organismes et leur évolution.",
    intro:
      "Des cellules microscopiques aux organismes complexes, les sciences du vivant cherchent à comprendre comment la vie fonctionne et évolue. ADN, hérédité, cellules, bactéries, virus, nutrition ou fossiles : retrouve nos quiz de biologie et teste tes connaissances sur les mécanismes fondamentaux du vivant.",
    image: "/images/sciences-topics/sciences-du-vivant.jpg",
  },

  {
    slug: "decouvertes-mysteres",
    name: "Découvertes et mystères scientifiques",
    shortDescription:
      "Découvre les grandes avancées scientifiques, les phénomènes étonnants et les mystères que la science tente encore d'expliquer.",
    seoTitle:
      "Quiz Découvertes et Mystères Scientifiques - Sciences et grandes énigmes",
    seoDescription:
      "Explore nos quiz sur les grandes découvertes et les mystères scientifiques. Innovations, découvertes majeures, phénomènes étonnants, erreurs scientifiques et questions encore non résolues : teste ta culture scientifique et découvre les avancées qui ont changé notre compréhension du monde.",
    intro:
      "La science progresse autant grâce à ses découvertes qu'aux questions auxquelles elle ne sait pas encore répondre. Grandes avancées, technologies autrefois jugées impossibles, phénomènes étonnants, découvertes archéologiques et mystères non résolus : retrouve ici nos quiz consacrés aux découvertes qui ont bouleversé nos connaissances et aux énigmes qui continuent d'intriguer les scientifiques.",
    image: "/images/sciences-topics/decouvertes-mysteres.jpg",
  },
];

export function getScienceTopic(
  slug: string,
): ScienceTopic | undefined {
  return scienceTopics.find(
    (topic) => topic.slug === slug,
  );
}