/**
 * "Choose who you are" — the two quizzes.
 *
 * Quiz 1 (identity): 10 questions drawn at random from a pool, answers shuffled each time.
 * Every answer leans toward a few traits; the god whose profile fits those traits best is chosen.
 *
 * Quiz 2 (level): 8 questions drawn at random from a pool. Every answer is worth 0–3 points
 * (hidden, and shuffled), and the total decides the level.
 */

export type TraitId = "command" | "fury" | "wisdom" | "passion" | "craft" | "wild" | "shadow" | "wit" | "hearth";

export type Weights = Partial<Record<TraitId, number>>;

export type Archetype = {
  /** Same id as the entry in gods.ts, so the dossier and story come from the real god. */
  godId: string;
  rank: "God" | "Goddess";
  /** Reads as "God of {domain}". */
  domain: string;
  /** One line shown under the title. */
  tagline: string;
  /** Why this reading fits the person. */
  reading: string;
  profile: Weights;
};

export const ARCHETYPES: Archetype[] = [
  {
    godId: "zeus",
    rank: "God",
    domain: "Thunder",
    tagline: "You hold the sky, and you keep your word.",
    reading: "You lead without being asked and people feel the weather change when you walk in. You are generous to those who are honest with you and hard on those who are not.",
    profile: { command: 3, fury: 2, wit: 1, passion: 1 },
  },
  {
    godId: "poseidon",
    rank: "God",
    domain: "the Sea",
    tagline: "Calm on top, enormous underneath.",
    reading: "Your moods have tides. You can be patient for a long time and then arrive all at once. You protect what you love and you do not forget a slight.",
    profile: { wild: 3, fury: 2, command: 1, passion: 1 },
  },
  {
    godId: "hades",
    rank: "God",
    domain: "the Underworld",
    tagline: "You keep what others are afraid to look at.",
    reading: "You are private, exact and fair. You do not need the crowd. You would rather rule a quiet realm well than a loud one badly.",
    profile: { shadow: 3, command: 2, wisdom: 1 },
  },
  {
    godId: "athena",
    rank: "Goddess",
    domain: "Wisdom and Strategy",
    tagline: "You win the war before it starts.",
    reading: "You think first, plan second and act once. People bring you problems because you find the clean way through.",
    profile: { wisdom: 3, craft: 1, command: 1, wit: 1 },
  },
  {
    godId: "apollo",
    rank: "God",
    domain: "Light and Prophecy",
    tagline: "You see the shape of things early.",
    reading: "You are drawn to music, order and clear sight. You care how things look and how they will turn out, and you are usually right about both.",
    profile: { wisdom: 2, craft: 2, command: 1, passion: 1 },
  },
  {
    godId: "artemis",
    rank: "Goddess",
    domain: "the Hunt",
    tagline: "Free, exact and hard to follow.",
    reading: "You are happiest outside, on your own terms. You are loyal to a few, wary of the rest and very good at being quiet until the right moment.",
    profile: { wild: 3, shadow: 1, fury: 1 },
  },
  {
    godId: "ares",
    rank: "God",
    domain: "War",
    tagline: "You do not flinch.",
    reading: "You feel things fast and fully. In a crisis you are the first one moving, and your courage is real even when your temper gets ahead of it.",
    profile: { fury: 4, passion: 1 },
  },
  {
    godId: "aphrodite",
    rank: "Goddess",
    domain: "Love",
    tagline: "You make people want to be closer.",
    reading: "You read what people want before they say it. Warmth, beauty and a little mischief are how you move through a room, and they work.",
    profile: { passion: 3, wit: 1, hearth: 1 },
  },
  {
    godId: "hephaestus",
    rank: "God",
    domain: "the Forge",
    tagline: "You make the things that last.",
    reading: "You show care by building. You are patient with hard problems, honest about your work and quietly proud of it.",
    profile: { craft: 3, hearth: 1, wisdom: 1 },
  },
  {
    godId: "hermes",
    rank: "God",
    domain: "Roads and Thieves",
    tagline: "Quick hands, quicker tongue.",
    reading: "You get in and out of every room, every deal and every argument with a joke. You carry news, connect people and always have a plan B.",
    profile: { wit: 3, wild: 1, passion: 1 },
  },
  {
    godId: "dionysus",
    rank: "God",
    domain: "Wine and Revelry",
    tagline: "You make the night worth staying up for.",
    reading: "You are warm, unpredictable and hard to bore. You break stiffness in a room and give people permission to be more themselves.",
    profile: { passion: 2, wild: 2, wit: 1 },
  },
  {
    godId: "demeter",
    rank: "Goddess",
    domain: "the Harvest",
    tagline: "You feed what you love, and you wait.",
    reading: "You are steady and giving, and you plan in seasons rather than days. Cross the people you care for and the whole field goes cold.",
    profile: { hearth: 3, wild: 2 },
  },
  {
    godId: "hecate",
    rank: "Goddess",
    domain: "Crossroads and Witchcraft",
    tagline: "You stand where the choices split.",
    reading: "You are at ease with ambiguity and with the dark. People find you when they are between one life and the next, and you light the way a little.",
    profile: { shadow: 3, wisdom: 1, wit: 1 },
  },
  {
    godId: "prometheus",
    rank: "God",
    domain: "Fire and Forethought",
    tagline: "You would give up comfort for a good idea.",
    reading: "You think ahead and you take the risk for the rest of us. You see how things could be better and cannot leave them alone.",
    profile: { wisdom: 2, wit: 1, craft: 1, fury: 1 },
  },
  {
    godId: "nemesis",
    rank: "Goddess",
    domain: "Retribution",
    tagline: "You keep the scales level.",
    reading: "You have a sharp sense of what is fair. You are slow to anger and very hard to talk out of it once the line has been crossed.",
    profile: { fury: 2, shadow: 1, wisdom: 1 },
  },
  {
    godId: "hestia",
    rank: "Goddess",
    domain: "the Hearth",
    tagline: "You are the reason the house feels like home.",
    reading: "You are calm, loyal and quietly central. Others come and go; you keep the fire. Nothing important starts without you, even when no one says so.",
    profile: { hearth: 3, wisdom: 1 },
  },
];

export function getArchetype(godId: string | null | undefined) {
  return ARCHETYPES.find((entry) => entry.godId === godId) ?? null;
}

export function archetypeTitle(entry: Archetype) {
  return `${entry.rank} of ${entry.domain}`;
}

// ── Levels ───────────────────────────────────────────────────────────────────────

export type LevelId = "lesser" | "mid" | "high" | "legendary";

export type LevelInfo = {
  id: LevelId;
  label: string;
  /** Lowest percent of the possible score that reaches this level. */
  from: number;
  blurb: string;
};

export const LEVELS: LevelInfo[] = [
  {
    id: "lesser",
    label: "Lesser",
    from: 0,
    blurb: "A local power. A shrine, a spring, a crossroads. Small, close to the people, and just beginning.",
  },
  {
    id: "mid",
    label: "Mid",
    from: 30,
    blurb: "A power with a city. Real worshippers, real rivals, and a name that travels.",
  },
  {
    id: "high",
    label: "High",
    from: 55,
    blurb: "A power with a throne. Whole peoples pray to you and other gods choose their words around you.",
  },
  {
    id: "legendary",
    label: "Legendary",
    from: 75,
    blurb: "One of the great powers. Epics are written about you, and the cosmos has your shape in it.",
  },
];

export function getLevel(id: LevelId | null | undefined) {
  return LEVELS.find((entry) => entry.id === id) ?? null;
}

export function levelFromPercent(percent: number): LevelInfo {
  let result = LEVELS[0];
  for (const level of LEVELS) if (percent >= level.from) result = level;
  return result;
}

export function fullTitle(entry: Archetype, level: LevelId | null | undefined) {
  const info = getLevel(level);
  return info ? `${info.label} ${archetypeTitle(entry)}` : archetypeTitle(entry);
}

// ── Quiz 1: who you are ──────────────────────────────────────────────────────────

export type IdentityQuestion = {
  id: string;
  prompt: string;
  options: Array<{ text: string; w: Weights }>;
};

export const IDENTITY_COUNT = 10;

export const IDENTITY_POOL: IdentityQuestion[] = [
  {
    id: "i1",
    prompt: "A storm is rolling in over the city. Where are you?",
    options: [
      { text: "On the roof, watching it arrive", w: { command: 2, fury: 1 } },
      { text: "Inside, lighting every lamp", w: { hearth: 2, craft: 1 } },
      { text: "Out in it, getting soaked on purpose", w: { wild: 2, passion: 1 } },
      { text: "At the window, working out where it will hit first", w: { wisdom: 2, shadow: 1 } },
    ],
  },
  {
    id: "i2",
    prompt: "Someone breaks a promise to you. What do you do?",
    options: [
      { text: "Say nothing, and remember it exactly", w: { shadow: 2, fury: 1 } },
      { text: "Confront them, loudly and right now", w: { fury: 2, passion: 1 } },
      { text: "Make sure the cost lands on them, fairly", w: { fury: 1, command: 1, wisdom: 1 } },
      { text: "Laugh, and quietly stop relying on them", w: { wit: 2, shadow: 1 } },
    ],
  },
  {
    id: "i3",
    prompt: "It is the weekend and nothing is planned. You choose...",
    options: [
      { text: "A long walk or ride, far from any road", w: { wild: 2, shadow: 1 } },
      { text: "A table full of friends and a long meal", w: { hearth: 2, passion: 1 } },
      { text: "The workshop, the notebook, the half-built thing", w: { craft: 2, wisdom: 1 } },
      { text: "Whatever the night turns into", w: { passion: 2, wit: 1 } },
    ],
  },
  {
    id: "i4",
    prompt: "You are handed a team with no leader. You...",
    options: [
      { text: "Take the lead and say who does what", w: { command: 2, fury: 1 } },
      { text: "Draw the plan on a board first", w: { wisdom: 2, craft: 1 } },
      { text: "Make sure everyone is fed and has a seat", w: { hearth: 2, wisdom: 1 } },
      { text: "Find the shortcut nobody else has noticed", w: { wit: 2, craft: 1 } },
    ],
  },
  {
    id: "i5",
    prompt: "Pick a place to spend a year.",
    options: [
      { text: "A cabin on a quiet shore", w: { wild: 2, hearth: 1 } },
      { text: "A marble city with a seat on the council", w: { command: 2, wisdom: 1 } },
      { text: "A cave with a library", w: { shadow: 2, wisdom: 1 } },
      { text: "A port town with a different language on every street", w: { wit: 2, wild: 1 } },
    ],
  },
  {
    id: "i6",
    prompt: "What would you hate to be called?",
    options: [
      { text: "Weak", w: { fury: 2, passion: 1 } },
      { text: "Boring", w: { passion: 2, wit: 1 } },
      { text: "Careless", w: { craft: 2, wisdom: 1 } },
      { text: "Unreliable", w: { hearth: 2, command: 1 } },
    ],
  },
  {
    id: "i7",
    prompt: "A stranger asks for help at midnight. You...",
    options: [
      { text: "Open the door and put the kettle on", w: { hearth: 2, passion: 1 } },
      { text: "Listen through the door and decide slowly", w: { shadow: 2, wisdom: 1 } },
      { text: "Help, and ask for something in return", w: { wit: 2, command: 1 } },
      { text: "Walk them wherever they need to go", w: { wild: 1, passion: 1, hearth: 1 } },
    ],
  },
  {
    id: "i8",
    prompt: "Which gift would you most like to be given?",
    options: [
      { text: "A perfect set of tools", w: { craft: 3 } },
      { text: "A crown, and the quiet that comes with it", w: { command: 2, shadow: 1 } },
      { text: "A night people talk about for years", w: { passion: 2, wit: 1 } },
      { text: "A map of every place nobody has been", w: { wild: 2, wisdom: 1 } },
    ],
  },
  {
    id: "i9",
    prompt: "What does your best idea usually look like?",
    options: [
      { text: "A trap that closes on its own", w: { wit: 2, shadow: 1 } },
      { text: "A long plan with no loose ends", w: { wisdom: 2, command: 1 } },
      { text: "A sudden feeling I can't ignore", w: { passion: 2, wild: 1 } },
      { text: "Something I can hold in my hands", w: { craft: 2, hearth: 1 } },
    ],
  },
  {
    id: "i10",
    prompt: "Someone is cruel to a friend of yours. You...",
    options: [
      { text: "Step in front, loud and ready", w: { fury: 2, passion: 1 } },
      { text: "Wait until they are alone, then speak calmly", w: { shadow: 2, fury: 1 } },
      { text: "Make a joke so sharp they never try it again", w: { wit: 2, fury: 1 } },
      { text: "Take your friend home and look after them", w: { hearth: 2, passion: 1 } },
    ],
  },
  {
    id: "i11",
    prompt: "Which sound do you like best?",
    options: [
      { text: "Thunder, far off", w: { command: 2, fury: 1 } },
      { text: "A lyre or a flute", w: { wisdom: 1, craft: 1, passion: 1 } },
      { text: "A fire crackling", w: { hearth: 2, craft: 1 } },
      { text: "Waves on rock", w: { wild: 2, fury: 1 } },
    ],
  },
  {
    id: "i12",
    prompt: "You have to pick one rule to live by.",
    options: [
      { text: "Keep your word", w: { command: 2, wisdom: 1 } },
      { text: "Everything has its price", w: { shadow: 1, fury: 1, wisdom: 1 } },
      { text: "Feel everything", w: { passion: 2, wild: 1 } },
      { text: "Leave things better than you found them", w: { craft: 1, hearth: 2 } },
    ],
  },
  {
    id: "i13",
    prompt: "How do you handle a secret?",
    options: [
      { text: "I keep it for life", w: { shadow: 2, hearth: 1 } },
      { text: "I trade it for something better", w: { wit: 2, command: 1 } },
      { text: "I tell one person and trust them", w: { passion: 1, hearth: 2 } },
      { text: "I decide who needs to know, and when", w: { wisdom: 2, command: 1 } },
    ],
  },
  {
    id: "i14",
    prompt: "Pick a weapon, or no weapon.",
    options: [
      { text: "A spear, balanced and honest", w: { fury: 2, passion: 1 } },
      { text: "A bow, and a good hiding place", w: { wild: 2, shadow: 1 } },
      { text: "A hammer, and an anvil", w: { craft: 2, hearth: 1 } },
      { text: "A sharp question", w: { wisdom: 2, wit: 1 } },
    ],
  },
  {
    id: "i15",
    prompt: "What does a good day end with?",
    options: [
      { text: "A job finished properly", w: { craft: 2, wisdom: 1 } },
      { text: "Everyone I love under one roof", w: { hearth: 3 } },
      { text: "A story I'll be telling next week", w: { wit: 2, passion: 1 } },
      { text: "Silence, and the stars", w: { shadow: 2, wild: 1 } },
    ],
  },
  {
    id: "i16",
    prompt: "A rival beats you fairly. You...",
    options: [
      { text: "Train until the next meeting", w: { fury: 2, passion: 1 } },
      { text: "Study exactly how they did it", w: { wisdom: 2, wit: 1 } },
      { text: "Congratulate them, then plan something else", w: { wit: 1, passion: 1, wild: 1 } },
      { text: "Say nothing and come back stronger", w: { shadow: 2, fury: 1 } },
    ],
  },
  {
    id: "i17",
    prompt: "Choose a season.",
    options: [
      { text: "Autumn, when the work pays off", w: { hearth: 2, wild: 1 } },
      { text: "Winter, when the world is quiet", w: { shadow: 2, wisdom: 1 } },
      { text: "Spring, when anything might begin", w: { passion: 2, wit: 1 } },
      { text: "Summer, long and bright", w: { command: 1, craft: 1, passion: 1 } },
    ],
  },
  {
    id: "i18",
    prompt: "What do you do when you are sure you are right and everybody disagrees?",
    options: [
      { text: "Stand where I am until they come around", w: { command: 2, fury: 1 } },
      { text: "Go and prove it with my own hands", w: { craft: 2, wisdom: 1 } },
      { text: "Do it anyway, and take what follows", w: { wisdom: 1, wit: 1, fury: 1 } },
      { text: "Let them go first and see what happens", w: { wit: 2, shadow: 1 } },
    ],
  },
  {
    id: "i19",
    prompt: "Pick an animal that fits you.",
    options: [
      { text: "An eagle", w: { command: 2, wisdom: 1 } },
      { text: "A stag in a forest", w: { wild: 2, shadow: 1 } },
      { text: "A fox", w: { wit: 2, wisdom: 1 } },
      { text: "A dog by the door", w: { hearth: 2, fury: 1 } },
    ],
  },
  {
    id: "i20",
    prompt: "What do you want to be remembered for?",
    options: [
      { text: "That I was fair", w: { fury: 1, wisdom: 1, command: 1 } },
      { text: "That I made something that outlived me", w: { craft: 2, hearth: 1 } },
      { text: "That I made life bigger for people", w: { passion: 2, wit: 1 } },
      { text: "That I was there when it mattered", w: { hearth: 2, shadow: 1 } },
    ],
  },
  {
    id: "i21",
    prompt: "A door in a wall you've never seen. You...",
    options: [
      { text: "Open it", w: { wild: 1, passion: 1, wit: 1 } },
      { text: "Walk around the wall first", w: { wisdom: 2, shadow: 1 } },
      { text: "Knock, and wait", w: { command: 1, hearth: 1, wisdom: 1 } },
      { text: "Take the hinges off", w: { craft: 2, wit: 1 } },
    ],
  },
  {
    id: "i22",
    prompt: "How do you feel about crowds?",
    options: [
      { text: "They're where I feel alive", w: { passion: 2, wit: 1 } },
      { text: "Fine, if I'm the one at the front", w: { command: 2, fury: 1 } },
      { text: "I'd rather be one-on-one", w: { hearth: 1, shadow: 1, wisdom: 1 } },
      { text: "I avoid them", w: { shadow: 2, wild: 1 } },
    ],
  },
  {
    id: "i23",
    prompt: "What kind of power do you trust?",
    options: [
      { text: "The kind that is earned", w: { craft: 1, command: 1, wisdom: 1 } },
      { text: "The kind nobody sees coming", w: { shadow: 2, wit: 1 } },
      { text: "The kind that protects", w: { hearth: 2, fury: 1 } },
      { text: "The kind that is loud", w: { fury: 2, passion: 1 } },
    ],
  },
  {
    id: "i24",
    prompt: "Pick a first move in a new place.",
    options: [
      { text: "Find the highest point", w: { command: 2, wild: 1 } },
      { text: "Find the kitchen", w: { hearth: 2, passion: 1 } },
      { text: "Find the person who knows everybody", w: { wit: 2, command: 1 } },
      { text: "Find the library", w: { wisdom: 2, shadow: 1 } },
    ],
  },
];

// ── Quiz 2: your level ───────────────────────────────────────────────────────────

export type LevelQuestion = {
  id: string;
  prompt: string;
  /** Four answers, worth 0–3. Shown in a random order, points hidden. */
  options: Array<{ text: string; points: 0 | 1 | 2 | 3 }>;
};

export const LEVEL_COUNT = 8;

export const LEVEL_POOL: LevelQuestion[] = [
  {
    id: "l1",
    prompt: "A city asks you to be its patron. You...",
    options: [
      { text: "Say no. Small shrines are enough", points: 0 },
      { text: "Accept, and visit when you can", points: 1 },
      { text: "Accept, and take an active role in its decisions", points: 2 },
      { text: "Accept, and make it the centre of the known world", points: 3 },
    ],
  },
  {
    id: "l2",
    prompt: "Another god challenges you in public. You...",
    options: [
      { text: "Quietly step aside", points: 0 },
      { text: "Answer, and hope it ends there", points: 1 },
      { text: "Meet them and win in front of everyone", points: 2 },
      { text: "Let them finish, then leave them nothing to stand on", points: 3 },
    ],
  },
  {
    id: "l3",
    prompt: "How much should a god be worshipped?",
    options: [
      { text: "A little. Mostly I want to be left alone", points: 0 },
      { text: "By the people who actually need me", points: 1 },
      { text: "By a whole people", points: 2 },
      { text: "By everyone, in every language", points: 3 },
    ],
  },
  {
    id: "l4",
    prompt: "A hero asks for your blessing. You...",
    options: [
      { text: "Wish them well from a distance", points: 0 },
      { text: "Give a small sign", points: 1 },
      { text: "Walk with them for a while", points: 2 },
      { text: "Reshape the road ahead of them", points: 3 },
    ],
  },
  {
    id: "l5",
    prompt: "You can leave a mark on the world. It is...",
    options: [
      { text: "A spring where travellers rest", points: 0 },
      { text: "A temple with your name on it", points: 1 },
      { text: "A law that people live by", points: 2 },
      { text: "A constellation", points: 3 },
    ],
  },
  {
    id: "l6",
    prompt: "What are you willing to give up for power?",
    options: [
      { text: "Nothing. It isn't worth it", points: 0 },
      { text: "A little comfort", points: 1 },
      { text: "Old friendships", points: 2 },
      { text: "Whatever the throne asks", points: 3 },
    ],
  },
  {
    id: "l7",
    prompt: "A war starts that you did not choose. You...",
    options: [
      { text: "Shelter the people near you", points: 0 },
      { text: "Pick a side quietly", points: 1 },
      { text: "Pick a side openly and fight", points: 2 },
      { text: "Decide how it ends", points: 3 },
    ],
  },
  {
    id: "l8",
    prompt: "Your name is spoken. How far does it carry?",
    options: [
      { text: "The valley", points: 0 },
      { text: "The coast", points: 1 },
      { text: "The sea and its far shores", points: 2 },
      { text: "The sky and everything under it", points: 3 },
    ],
  },
  {
    id: "l9",
    prompt: "A rival offers a truce. You...",
    options: [
      { text: "Take it gratefully", points: 0 },
      { text: "Take it, and keep a guard up", points: 1 },
      { text: "Take it on better terms", points: 2 },
      { text: "Refuse. You're not done", points: 3 },
    ],
  },
  {
    id: "l10",
    prompt: "A thousand years from now, mortals say...",
    options: [
      { text: "\"There was a good god once, near the old well\"", points: 0 },
      { text: "\"They kept the harvests safe in the north\"", points: 1 },
      { text: "\"Their temple was the finest in the land\"", points: 2 },
      { text: "\"Their poem is still read in every school\"", points: 3 },
    ],
  },
  {
    id: "l11",
    prompt: "How do you treat mortals who annoy you?",
    options: [
      { text: "Ignore them", points: 0 },
      { text: "Test them gently", points: 1 },
      { text: "Make a point of it", points: 2 },
      { text: "Make an example of them for generations", points: 3 },
    ],
  },
  {
    id: "l12",
    prompt: "You are given one gift by the Fates. You take...",
    options: [
      { text: "A long, quiet life", points: 0 },
      { text: "A great friend", points: 1 },
      { text: "A great rival", points: 2 },
      { text: "A great story", points: 3 },
    ],
  },
  {
    id: "l13",
    prompt: "A mountain is in your way. You...",
    options: [
      { text: "Go around", points: 0 },
      { text: "Wait for the weather to change", points: 1 },
      { text: "Climb it", points: 2 },
      { text: "Move it", points: 3 },
    ],
  },
  {
    id: "l14",
    prompt: "Where do you sit when the gods gather?",
    options: [
      { text: "At the back, near the door", points: 0 },
      { text: "At the long table, among friends", points: 1 },
      { text: "Near the head of the table", points: 2 },
      { text: "At the head", points: 3 },
    ],
  },
  {
    id: "l15",
    prompt: "How do you answer a prayer?",
    options: [
      { text: "When I happen to hear it", points: 0 },
      { text: "When I'm able", points: 1 },
      { text: "Always, with a clear answer", points: 2 },
      { text: "Before it's finished", points: 3 },
    ],
  },
  {
    id: "l16",
    prompt: "What do you do with failure?",
    options: [
      { text: "Retreat and rest", points: 0 },
      { text: "Learn and try something smaller", points: 1 },
      { text: "Learn and try again", points: 2 },
      { text: "Build the next attempt on top of it, bigger", points: 3 },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────────

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A fresh set of questions, in random order, each with shuffled answers. */
export function drawIdentityQuiz(): IdentityQuestion[] {
  return shuffle(IDENTITY_POOL)
    .slice(0, IDENTITY_COUNT)
    .map((question) => ({ ...question, options: shuffle(question.options) }));
}

export function drawLevelQuiz(): LevelQuestion[] {
  return shuffle(LEVEL_POOL)
    .slice(0, LEVEL_COUNT)
    .map((question) => ({ ...question, options: shuffle(question.options) }));
}

/**
 * Some traits show up in more answers than others. Scaling each trait by how often it appears in the pool
 * keeps every god reachable (otherwise a rare trait like "wild" could never win).
 */
const TRAIT_SCALE: Record<string, number> = (() => {
  const sums: Record<string, number> = {};
  for (const question of IDENTITY_POOL) {
    for (const option of question.options) {
      for (const [trait, value] of Object.entries(option.w)) sums[trait] = (sums[trait] ?? 0) + (value ?? 0);
    }
  }
  const values = Object.values(sums);
  const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const scale: Record<string, number> = {};
  for (const [trait, sum] of Object.entries(sums)) scale[trait] = mean / sum;
  return scale;
})();

/** Picks the god whose profile fits the answers best (cosine-style match, so no god wins just by having more points). */
export function scoreIdentity(chosen: Weights[]): Archetype {
  const total: Record<string, number> = {};
  for (const weights of chosen) {
    for (const [trait, value] of Object.entries(weights)) total[trait] = (total[trait] ?? 0) + (value ?? 0) * (TRAIT_SCALE[trait] ?? 1);
  }
  let best = ARCHETYPES[0];
  let bestScore = -Infinity;
  for (const entry of ARCHETYPES) {
    let dot = 0;
    let norm = 0;
    for (const [trait, value] of Object.entries(entry.profile)) {
      dot += (total[trait] ?? 0) * (value ?? 0);
      norm += (value ?? 0) * (value ?? 0);
    }
    const score = dot / Math.sqrt(norm || 1) + Math.random() * 0.001;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
}

export function scoreLevel(points: number[]): { level: LevelInfo; percent: number } {
  const max = points.length * 3;
  const percent = max === 0 ? 0 : Math.round((points.reduce((sum, value) => sum + value, 0) / max) * 100);
  return { level: levelFromPercent(percent), percent };
}
