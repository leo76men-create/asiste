import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coffee,
  Dog,
  ExternalLink,
  Film,
  Gamepad2,
  Gift,
  ImagePlus,
  ListTodo,
  Moon,
  Music2,
  Play,
  Plus,
  RotateCcw,
  Send,
  Shuffle,
  Sparkles,
  Star,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Screen =
  | 'home'
  | 'write'
  | 'rest'
  | 'quiet'
  | 'distract'
  | 'music'
  | 'entertainment'
  | 'trivia'
  | 'nerd'
  | 'game'
  | 'memory'
  | 'runner'
  | 'surprise'
  | 'organizer'
  | 'house';

type IconType = typeof Coffee;
type PhraseBook = Record<string, string[]>;

interface Config {
  nombre: string;
  tuNombre: string;
  starbucksUrl: string;
  appTitle: string;
  tagline?: string;
  brandLogo?: string;
  audio?: string;
  audioCarta?: string;
  audioMenu?: string;
  audioHarry?: string;
  audioPistas?: Record<string, string>;
  whatsapp?: string;
}

interface Carta {
  parrafos: string[];
  firma: string;
}

interface MusicItem {
  id: string;
  titulo: string;
  tipo?: string;
  consulta: string;
  url?: string;
  icono?: string;
}

interface MusicSituation {
  id: string;
  titulo: string;
  descripcion?: string;
  items: MusicItem[];
}

interface VideoItem {
  id: string;
  categoria: string;
  subcategoria?: string;
  titulo: string;
  url: string;
  minutos: number;
  placeholder?: boolean;
  prioridad?: number;
}

interface TriviaItem {
  tema: string;
  pregunta: string;
  opciones: string[];
  respuesta: number;
  explicacion: string;
}

interface Fact {
  categoria: string;
  titulo: string;
  texto: string;
}

interface SurpriseItem {
  id: string;
  titulo: string;
  peso: number;
  intro: string;
}

interface TequilaData {
  frases: string[];
  datos: string[];
  fotos: string[];
  roles?: Record<string, string>;
}

interface Content {
  config: Config;
  carta: Carta;
  frases: PhraseBook;
  musica: MusicItem[];
  musicaSituaciones: MusicSituation[];
  videos: VideoItem[];
  trivia: TriviaItem[];
  datos: Fact[];
  sorprende: SurpriseItem[];
  palabras: Record<string, string[]>;
  tequila: TequilaData;
}

const fallbackContent: Content = {
  config: {
    nombre: '[Xime]',
    tuNombre: '[Leo]',
    starbucksUrl: 'https://www.starbucks.com.mx/',
    appTitle: '',
    tagline: '',
    brandLogo: '',
    audioCarta: '',
      audioMenu: '',
      audioHarry: '',
      whatsapp: '',
    audioPistas: {},
  },
  carta: {
    parrafos: [
      'Hola, [[NOMBRE]].',
      'Feliz cumpleaños.',
      'Hice este pequeño espacio pensando en ti. No es una agenda ni una tarea más. Es un lugar para cuando quieras despejarte, escuchar algo, ver algo tonto, o pasar cinco minutos sin pensar en nada.',
      'Esto no está hecho para que tengas que venir a hablar conmigo.',
      'Este espacio es tuyo.',
    ],
    firma: '[[TU NOMBRE]]',
  },
  frases: { saludos: ['A ver, [[NOMBRE]].'], elecciones: ['Buena elección.'] },
  musica: [
    { id: 'yatra', titulo: 'Sebastián Yatra', consulta: 'Sebastian Yatra' },
    { id: 'danny', titulo: 'Danny Ocean', consulta: 'Danny Ocean' },
    { id: 'tranquilo', titulo: 'Algo tranquilo', consulta: 'soft chill playlist' },
  ],
  musicaSituaciones: [
    { id: 'tranquila', titulo: 'Cuando necesitas bajar revoluciones', items: [{ id: 'fallback-tranquila', titulo: 'Algo tranquilo', tipo: 'playlist', consulta: 'soft chill playlist' }] },
    { id: 'energia', titulo: 'Cuando necesitas un empujoncito', items: [{ id: 'fallback-energia', titulo: 'Algo para moverte', tipo: 'playlist', consulta: 'upbeat pop playlist' }] },
  ],
  videos: [],
  trivia: [
    {
      tema: 'Random',
      pregunta: '¿Qué puede dormir de pie?',
      opciones: ['Un caballo', 'Un pulpo', 'Un pez', 'Una abeja'],
      respuesta: 0,
      explicacion: 'Los caballos pueden descansar de pie.',
    },
  ],
  datos: [
    {
      categoria: 'Ingeniería',
      titulo: 'Una cosa a la vez',
      texto: 'Un prototipo solo necesita contestar una pregunta para ser útil.',
    },
  ],
  sorprende: [
    { id: 'dato', titulo: 'Dato curioso nerd', peso: 1, intro: 'Modo nerd activado.' },
    { id: 'absurda', titulo: 'Algo inútil', peso: 1, intro: 'Esto no tiene absolutamente ningún propósito.' },
  ],
  palabras: {},
  tequila: {
    fotos: [
      'assets/img/tequila/tequila1.png',
      'assets/img/tequila/tequila2.png',
      'assets/img/tequila/tequila3.png',
      'assets/img/tequila/tequila4.png',
      'assets/img/tequila/tequila5.png',
      'assets/img/tequila/tequila6.png',
    ],
    frases: ['Tequila aprueba esta decisión.', 'Tequila está orgullosa de ti.'],
    datos: [],
    roles: {
      '1': 'nariz de cerca · humor, errores y boop',
      '2': 'acostada de lado · descanso y compañía silenciosa',
      '3': 'mirando desde el piso · juicio y aprobación',
      '4': 'oscura, mirando a cámara · reveal de Sorpréndeme',
      '5': 'cuerpo completo · decoración',
      '6': 'recibiendo cariño · recompensa',
    },
  },
};

const initialSession = {
  timeAvailable: null as string | null,
  wantsCoffee: null as string | null,
  hasEaten: null as string | null,
  currentPath: null as Screen | null,
  lastExperience: null as string | null,
  lastPhrase: null as string | null,
  lastCategory: null as string | null,
  triviaTopic: null as string | null,
};

const sessionState = { ...initialSession };

const choiceDefinitions: Omit<ChoiceProps, 'onClick'>[] = [
  {
    id: 'write',
    icon: BookOpen,
    title: 'Tengo demasiadas cosas en la cabeza',
    description: 'Escribe si quieres. No tienes que hacerlo bonito.',
  },
  {
    id: 'rest',
    icon: Coffee,
    title: 'Necesito un descanso',
    description: 'Café, silencio o algo tranquilo.',
  },
  {
    id: 'distract',
    icon: Sparkles,
    title: 'Quiero distraerme',
    description: 'Algo breve, según el tiempo que tengas.',
  },
  {
    id: 'music',
    icon: Music2,
    title: 'Quiero música',
    description: 'Una búsqueda lista para dar play.',
  },
  {
    id: 'entertainment',
    icon: Film,
    title: 'Quiero ver algo',
    description: 'Disney, series, animales y más.',
  },
  {
    id: 'surprise',
    icon: Shuffle,
    title: 'Sorpréndeme',
    description: 'El algoritmo decide poquito.',
  },
];

function replacePersonal(text: string, config: Config) {
  return text
    .replaceAll('[[NOMBRE]]', config.nombre)
    .replaceAll('[[TU NOMBRE]]', config.tuNombre);
}

function storageGet(key: string) {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // The in-memory session remains usable in strict private mode.
    }
  }
}

function storageRemove(key: string) {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch {
    // Nothing to do when browser storage is blocked.
  }
}
function notifyVideoOpened() {
  window.dispatchEvent(new Event('asiste-video-opened'));
}
async function loadJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`data/${file}`);
    if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function loadContent(): Promise<Content> {
  const [config, carta, frases, musica, musicaSituaciones, videos, trivia, datos, sorprende, palabras, tequila] =
    await Promise.all([
      loadJson('config.json', fallbackContent.config),
      loadJson('carta.json', fallbackContent.carta),
      loadJson('frases.json', fallbackContent.frases),
      loadJson('musica.json', fallbackContent.musica),
      loadJson('musica_situaciones.json', fallbackContent.musicaSituaciones),
      loadJson('videos.json', fallbackContent.videos),
      loadJson('trivia.json', fallbackContent.trivia),
      loadJson('datos_curiosos.json', fallbackContent.datos),
      loadJson('sorprendeme.json', fallbackContent.sorprende),
      loadJson('palabras_clave.json', fallbackContent.palabras),
      loadJson('tequila.json', fallbackContent.tequila),
    ]);
  return { config, carta, frases, musica, musicaSituaciones, videos, trivia, datos, sorprende, palabras, tequila };
}

function pickPhrase(book: PhraseBook, key: string, config: Config) {
  const options = book[key] ?? book.elecciones ?? ['Buena elección.'];
  const available = options.filter((item) => item !== sessionState.lastPhrase);
  const phrase = available[Math.floor(Math.random() * Math.max(available.length, 1))] ?? options[0];
  sessionState.lastPhrase = phrase;
  return replacePersonal(phrase, config);
}

function normalize(text: string) {
  return text
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/watch') {
      return parsed.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

function emitVideoState(playing: boolean) {
  window.dispatchEvent(new CustomEvent('asiste-video-state', { detail: playing }));
}

let youTubeApiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youTubeApiPromise) return youTubeApiPromise;
  youTubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return youTubeApiPromise;
}

function YouTubePlayer({ videoId, title, autoplay }: { videoId: string; title: string; autoplay: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const latest = useRef({ videoId, autoplay });
  latest.current = { videoId, autoplay };

  useEffect(() => {
    let cancelled = false;
    void loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      const mount = document.createElement('div');
      hostRef.current.appendChild(mount);
      playerRef.current = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId: latest.current.videoId,
        playerVars: { rel: 0, playsinline: 1, autoplay: latest.current.autoplay ? 1 : 0 },
        events: {
          onReady: () => { readyRef.current = true; },
          onStateChange: (event: { data: number }) => {
            // 1 = reproduciendo, 3 = cargando (buffering)
            emitVideoState(event.data === 1 || event.data === 3);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      emitVideoState(false);
      try { playerRef.current?.destroy(); } catch { /* nada que hacer */ }
      playerRef.current = null;
      readyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    if (autoplay) player.loadVideoById(videoId);
    else player.cueVideoById(videoId);
  }, [videoId, autoplay]);

  return (
    <div className="video-player-wrap">
      <div ref={hostRef} className="video-player-frame" aria-label={title} />
      <p className="video-player-caption">{title}</p>
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id: string | null = null;
    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/watch') {
      id = parsed.searchParams.get('v');
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function shuffleQueue(length: number, avoidFirst?: number): number[] {
  const shuffled = shuffleArray(Array.from({ length }, (_, index) => index));
  if (avoidFirst !== undefined && shuffled.length > 1 && shuffled[0] === avoidFirst) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}
function PageHeader({ screen, onHome, config }: { screen: Screen; onHome: () => void; config: Config }) {
  const labels: Partial<Record<Screen, string>> = {
    write: 'papelito temporal',
    rest: 'descanso',
    quiet: 'pantalla tranquila',
    distract: 'distracción',
    entertainment: 'algo para ver',
    trivia: 'trivia sin examen',
    nerd: 'laboratorio',
    music: 'banda sonora',
    game: 'juego breve',
    surprise: 'azar amable',
    organizer: 'organizador opcional',
  };
  return (
    <header className="asiste-topbar">
      <button className="asiste-wordmark" onClick={onHome} aria-label="Volver al inicio">
        <BrandMark config={config} />
        <span>
          <strong>{config.appTitle}</strong>
          <span className="asiste-kicker" style={{ display: 'block' }}>{config.tagline || 'módulo personal'}</span>
        </span>
      </button>
      {screen !== 'home' && (
        <button className="asiste-home-button" onClick={onHome}>
          <ArrowLeft size={15} aria-hidden="true" /> Volver
        </button>
      )}
      {labels[screen] && <span className="asiste-kicker asiste-header-label">{labels[screen]}</span>}
    </header>
  );
}

function BrandMark({ config }: { config: Config }) {
  const [showFallback, setShowFallback] = useState(!config.brandLogo);
  return showFallback ? (
    <span className="asiste-mark asiste-mark-fallback" aria-hidden="true">✿</span>
  ) : (
    <img className="asiste-mark asiste-mark-image" src={config.brandLogo} alt="" onError={() => setShowFallback(true)} />
  );
}

interface ChoiceProps {
  id: string;
  icon: IconType;
  title: string;
  description: string;
  onClick: () => void;
}

function ChoiceCard({ icon: Icon, title, description, id, onClick }: ChoiceProps) {
  return (
    <button className="asiste-card asiste-choice" onClick={onClick} data-testid={`button-choice-${id}`}>
      <span className="choice-icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}

function Home({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [greeting, setGreeting] = useState('');
  const [booped, setBooped] = useState(false);
  useEffect(() => {
    setGreeting(pickPhrase(content.frases, 'saludos', content.config));
  }, [content]);
  return (
    <main className="asiste-main">
      <section className="asiste-hero">
        <div className="asiste-eyebrow">{greeting || `Buenas, ${content.config.nombre}`}</div>
        <h1 className="asiste-heading">¿Qué <span className="asiste-script">necesitas?</span></h1>
        <p className="asiste-subheading">Este pequeño lugar es tuyo. No tienes que hablar con nadie ni resolver nada.</p>
      </section>
      <section className="asiste-section" aria-labelledby="options-title">
        <div className="asiste-section-title"><h2 id="options-title">Elige una puerta</h2></div>
        <div className="asiste-grid">
          {choiceDefinitions.map((choice) => <ChoiceCard key={choice.id} {...choice} onClick={() => onNavigate(choice.id as Screen)} />)}
        </div>
      </section>
      <section className="asiste-section asiste-two-col">
        <div className="asiste-card asiste-note">
          <div className="asiste-eyebrow">nota</div>
          <p>No tienes que hacer nada con lo que pase por aquí.</p>
          <p className="asiste-muted-text">Lo que escribas no se guarda. El organizador solo aparece si tú lo eliges.</p>
        </div>
      </section>
      <button className="boop-trigger" onClick={() => setBooped(true)} aria-label="Boop secreto">·</button>
      {booped && <TequilaCallout content={content} number={1} text="Boop. Tequila estaba aquí." title="Easter egg encontrado." />}
    </main>
  );
}

function tequilaPhoto(content: Content, number: number) {
  return content.tequila.fotos[number - 1];
}

function TequilaImage({ content, number, alt, className = 'tequila-image' }: { content: Content; number: number; alt: string; className?: string }) {
  const [visible, setVisible] = useState(true);
  const src = tequilaPhoto(content, number);
  if (!src || !visible) return null;
  return <img className={className} src={src} alt={alt} onError={() => setVisible(false)} />;
}

function TequilaCallout({ content, number, text, title }: { content: Content; number: number; text: string; title?: string }) {
  return (
    <div className="tequila-callout">
      <TequilaImage content={content} number={number} alt={`Tequila, foto ${number}`} />
      <div>
        {title && <strong>{title}</strong>}
        <p>{text}</p>
      </div>
    </div>
  );
}

function TequilaReward({ content, onClose, number = 6, text = 'Tequila está orgullosa de ti.' }: { content: Content; onClose: () => void; number?: number; text?: string }) {
  return (
    <aside className="tequila-reward" role="status">
      <TequilaImage content={content} number={number} alt="Tequila" className="tequila-reward-image" />
      <div><strong>{text}</strong><button className="asiste-small-link" onClick={onClose}>cerrar</button></div>
    </aside>
  );
}

function LocalPhotoPicker({ label, photos, onChange }: { label: string; photos: string[]; onChange: (photos: string[]) => void }) {
  const addPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'));
    onChange([...photos, ...files.map((file) => URL.createObjectURL(file))]);
    event.target.value = '';
  };
  return (
    <div className="photo-picker">
      <label className="asiste-chip photo-picker-label">
        <ImagePlus size={14} /> {label}
        <input type="file" accept="image/*" multiple onChange={addPhotos} />
      </label>
      {photos.length > 0 && <div className="photo-picker-preview">{photos.map((photo, index) => <img src={photo} alt={`Foto agregada ${index + 1}`} key={photo} />)}</div>}
    </div>
  );
}

function FreeText({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<{ intro: string; question: string; options: { label: string; screen: Screen }[] } | null>(null);
  const [tequilaMessage, setTequilaMessage] = useState(false);
  const analyze = () => {
    const normalized = normalize(value.trim());
    setTequilaMessage(normalized.includes('esquite'));
    if (!normalized) {
      setResult({
        intro: 'No tienes que escribir nada.',
        question: '¿Qué prefieres hacer ahora?',
        options: [
          { label: 'Música', screen: 'music' },
          { label: 'Algo para ver', screen: 'entertainment' },
          { label: 'Dejar la pantalla tranquila', screen: 'quiet' },
        ],
      });
      return;
    }
    const matches = Object.entries(content.palabras).filter(([, words]) => words.some((word) => normalized.includes(normalize(word))));
    const category = matches[0]?.[0] ?? 'none';
    sessionState.lastCategory = category;
    if (category === 'escuela') {
      setResult({ intro: 'Ok, cerebro académico detectado.', question: '¿Quieres ordenar un poquito lo pendiente o prefieres olvidarte de eso un rato?', options: [{ label: 'Ayúdame a ordenar', screen: 'organizer' }, { label: 'Quiero olvidarme', screen: 'distract' }] });
    } else if (category === 'cansancio') {
      setResult({ intro: 'Creo que llevas muchas cosas encima.', question: '¿Quieres hacer algo con todo eso o prefieres no pensar en ello ahora?', options: [{ label: 'Ordenarlo un poco', screen: 'organizer' }, { label: 'No pensar en ello', screen: 'distract' }] });
    } else if (category === 'preocupacion') {
      setResult({ intro: 'Gracias por sacarlo de la cabeza.', question: '¿Quieres pensar un rato en eso o prefieres despejarte?', options: [{ label: 'Pensarlo un rato', screen: 'quiet' }, { label: 'Despejarme', screen: 'distract' }] });
    } else if (category === 'organizacion' || category === 'entrenamiento') {
      setResult({ intro: 'No tienes que resolverlo completo ahora.', question: '¿Qué te serviría más?', options: [{ label: 'Ordenarlo un poco', screen: 'organizer' }, { label: 'Olvidarme por ahora', screen: 'distract' }] });
    } else {
      setResult({ intro: 'No tienes que hacer nada con esto.', question: '¿Qué puerta te gustaría abrir?', options: [{ label: 'Música', screen: 'music' }, { label: 'Algo para ver', screen: 'entertainment' }, { label: 'Dejar la pantalla tranquila', screen: 'quiet' }] });
    }
    setValue('');
  };
  return (
    <main className="asiste-main" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="asiste-eyebrow">sin formato requerido</div>
      <h1 className="asiste-heading">Cuéntame <span className="asiste-script">si quieres.</span></h1>
      <p className="asiste-subheading">No tienes que escribirlo bonito, ni ordenado, ni completo. Todo se procesa aquí mismo y desaparece al cerrar.</p>
      {!result ? (
        <>
          <textarea className="asiste-input" style={{ minHeight: 240, marginTop: 26, resize: 'vertical', lineHeight: 1.7 }} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Escribe lo que tengas en la cabeza..." aria-label="Lo que tienes en la cabeza" />
          <div className="asiste-actions">
            <button className="asiste-btn asiste-btn-primary" onClick={analyze}><Send size={16} /> Listo</button>
            <button className="asiste-btn asiste-btn-ghost" onClick={() => onNavigate('distract')}>Mejor no escribir nada</button>
          </div>
        </>
      ) : (
        <section className="asiste-card asiste-note" style={{ marginTop: 28 }}>
          <div className="asiste-eyebrow">{result.intro}</div>
          <h2 style={{ fontSize: 22, margin: '8px 0 20px' }}>{result.question}</h2>
           {tequilaMessage && <TequilaCallout content={content} number={3} text="-50 puntos por seguir defendiendo el esquite amarillo." />}
          <div className="asiste-actions">{result.options.map((option) => <button className="asiste-btn asiste-btn-primary" key={option.label} onClick={() => onNavigate(option.screen)}>{option.label} <ChevronRight size={16} /></button>)}</div>
          <button className="asiste-small-link" onClick={() => setResult(null)} style={{ marginTop: 18 }}>Escribir otra cosa</button>
        </section>
      )}
    </main>
  );
}

function Rest({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [step, setStep] = useState<'choice' | 'coffee' | 'coffee-time' | 'food' | 'done'>('choice');
  const [foodQuestion, setFoodQuestion] = useState(() => Math.random() < 0.3);
  const [message, setMessage] = useState('');
  const chooseCoffee = (answer: string) => {
    sessionState.wantsCoffee = answer;
    if (answer === 'todavia') setStep('coffee-time');
    else {
      setMessage(answer === 'no' ? 'Perfecto.' : 'Bien. Café resuelto.');
      setStep(foodQuestion ? 'food' : 'done');
    }
  };
  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">una cosa a la vez</div>
      <h1 className="asiste-heading">{step === 'choice' ? <>¿Qué te gustaría <span className="asiste-script">hacer?</span></> : <>Un descanso <span className="asiste-script">chiquito.</span></>}</h1>
      <p className="asiste-subheading">{step === 'choice' ? 'Puedes descansar, distraerte o hacer algo tranquilo.' : 'El café es un detalle contextual, no una tarea.'}</p>
      {step === 'choice' && <div className="asiste-grid" style={{ marginTop: 28 }}>
        <button className="asiste-card asiste-choice" onClick={() => setStep('coffee')}><span className="choice-icon"><Coffee size={19} /></span><h3>Descansar</h3><p>Una pausa y una pregunta pequeña.</p></button>
        <button className="asiste-card asiste-choice" onClick={() => onNavigate('distract')}><span className="choice-icon"><Sparkles size={19} /></span><h3>Distraerme</h3><p>Algo según el tiempo que tengas.</p></button>
        <button className="asiste-card asiste-choice" onClick={() => onNavigate('quiet')}><span className="choice-icon"><Moon size={19} /></span><h3>Algo tranquilo</h3><p>Respiración visual opcional y cero mensajes motivacionales.</p></button>
      </div>}
      {step === 'coffee' && <section className="asiste-card asiste-note" style={{ marginTop: 28 }}><div className="asiste-eyebrow">pregunta opcional</div><h2>¿Ya tomaste café?</h2><div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={() => chooseCoffee('si')}>Sí</button><button className="asiste-btn asiste-btn-muted" onClick={() => chooseCoffee('todavia')}>Todavía no</button><button className="asiste-btn asiste-btn-ghost" onClick={() => chooseCoffee('no')}>No quiero café</button></div></section>}
      {step === 'coffee-time' && <section className="asiste-card asiste-note" style={{ marginTop: 28 }}><div className="asiste-eyebrow">sin presión</div><h2>¿Tienes tiempo de ir por uno?</h2><div className="asiste-actions"><a className="asiste-btn asiste-btn-primary" href={content.config.starbucksUrl} target="_blank" rel="noreferrer">Abrir Starbucks <ExternalLink size={15} /></a><button className="asiste-btn asiste-btn-ghost" onClick={() => { setMessage('Está bien. Puede esperar.'); setStep(foodQuestion ? 'food' : 'done'); }}>No por ahora</button></div></section>}
      {step === 'food' && <section className="asiste-card asiste-note" style={{ marginTop: 28 }}><div className="asiste-eyebrow">pregunta extra, solo si quieres</div><h2>¿Ya comiste?</h2><div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={() => { sessionState.hasEaten = 'si'; setMessage('Ok.'); setStep('done'); }}>Sí</button><button className="asiste-btn asiste-btn-ghost" onClick={() => { sessionState.hasEaten = 'no'; setMessage('Ok.'); setStep('done'); }}>No</button></div></section>}
       {step === 'done' && <section className="asiste-card asiste-note" style={{ marginTop: 28 }}><Coffee size={24} color="hsl(var(--accent))" /><h2>{message || 'Perfecto.'}</h2><TequilaCallout content={content} number={3} text="Tequila aprueba esta decisión." /><p>¿Quieres quedarte aquí o cambiar de aire?</p><div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={() => onNavigate('quiet')}>Algo tranquilo</button><button className="asiste-btn asiste-btn-ghost" onClick={() => onNavigate('distract')}>Despejarme</button></div></section>}
    </main>
  );
}

function Quiet({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showReward, setShowReward] = useState(false);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);
   useEffect(() => {
     if (running && seconds === 0 && minutes !== null) {
       setRunning(false);
       setShowReward(true);
     }
   }, [running, seconds, minutes]);
  const start = (value: number) => { setMinutes(value); setSeconds(value * 60); setRunning(true); };
  return (
    <main className="asiste-main" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="asiste-card asiste-note quiet-panel">
        <Moon size={25} color="hsl(var(--accent))" strokeWidth={1.5} aria-hidden="true" />
        <div className="asiste-eyebrow" style={{ marginTop: 25 }}>pantalla tranquila</div>
        <h1 className="asiste-heading">No tienes que <span className="asiste-script">hablar.</span></h1>
        <p className="asiste-subheading">La respiración visual es opcional. Puedes salir cuando quieras.</p>
         <TequilaCallout content={content} number={2} text="Tequila se queda aquí contigo, sin decir nada." />
        <div className="breathing-circle" aria-label="Círculo de respiración visual" />
        <div className="asiste-actions" style={{ justifyContent: 'center' }}>
          {[1, 2, 3].map((value) => <button className={`asiste-chip ${minutes === value ? 'is-active' : ''}`} key={value} onClick={() => start(value)}>{value} min</button>)}
        </div>
        {minutes !== null && <p className="asiste-kicker">{running ? `${Math.ceil(seconds / 60)} min · puedes salir en cualquier momento` : 'Terminó el tiempo elegido.'}</p>}
        <button className="asiste-btn asiste-btn-ghost" onClick={() => onNavigate('home')}>Volver cuando quieras</button>
         {showReward && <TequilaReward content={content} onClose={() => setShowReward(false)} />}
      </div>
    </main>
  );
}

function Distract({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [time, setTime] = useState<string | null>(sessionState.timeAvailable);
  const options = useMemo(() => {
    if (!time) return [];
    const max = time === '5' ? 5 : time === '10' ? 10 : time === '20' ? 20 : 999;
    const videos = content.videos.filter((item) => item.minutos <= max).slice(0, 3);
    const base = [
      { title: 'Un mini juego', text: 'Memoria de cartas, sin límite de tiempo.', icon: Gamepad2, screen: 'game' as Screen },
      { title: 'Perros', text: 'Una galería breve de caritas.', icon: Dog, screen: 'entertainment' as Screen },
      { title: 'Una trivia', text: 'Una pregunta que no afecta tu calificación.', icon: CircleHelp, screen: 'trivia' as Screen },
      { title: 'Un dato curioso', text: 'Mecánica, robots, carros o mecanismos.', icon: Wrench, screen: 'nerd' as Screen },
    ];
    const videoOptions = videos.map((item) => ({ title: item.titulo, text: `${item.minutos} min · búsqueda editable`, icon: Film, href: item.url }));
    return [...base, ...videoOptions].slice(0, 5);
  }, [content.videos, time]);
  if (!time) {
    return (
      <main className="asiste-main">
        <div className="asiste-eyebrow">distracción calibrada</div>
        <h1 className="asiste-heading">¿Cuánto <span className="asiste-script">tiempo</span> tienes?</h1>
        <p className="asiste-subheading">Solo es una referencia. Si cambias de idea a la mitad, el plan quedó cumplido.</p>
        <div className="asiste-toolbar" role="group" aria-label="Tiempo disponible">{[['5', '5 minutos'], ['10', '10 minutos'], ['20', '20 minutos'], ['all', 'Tengo bastante tiempo']].map(([id, label]) => <button className="asiste-chip" key={id} onClick={() => { sessionState.timeAvailable = id; setTime(id); }}>{label}</button>)}</div>
      </main>
    );
  }
  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">{time === 'all' ? 'sin reloj' : `${time} minutos disponibles`}</div>
      <h1 className="asiste-heading">Elige una <span className="asiste-script">distracción.</span></h1>
      <p className="asiste-subheading">Pocas opciones, ninguna obligación.</p>
      <div className="asiste-two-col" style={{ marginTop: 28 }}>
        {options.map((item) => 'href' in item ? <a className="asiste-card asiste-result" href={item.href} target="_blank" rel="noreferrer" onClick={notifyVideoOpened} key={item.title}><span className="choice-icon"><item.icon size={18} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ExternalLink size={16} /></a> :<button className="asiste-card asiste-result" onClick={() => { if (item.screen === 'trivia') sessionState.triviaTopic = null; onNavigate(item.screen); }} key={item.title}><span className="choice-icon"><item.icon size={18} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ChevronRight size={16} /></button>)}
      </div>
      <button className="asiste-small-link" onClick={() => { sessionState.timeAvailable = null; setTime(null); }} style={{ marginTop: 20 }}>Cambiar tiempo</button>
    </main>
  );
}

function Entertainment({ content, onNavigate, onCategoryChange }: { content: Content; onNavigate: (screen: Screen) => void; onCategoryChange?: (category: string) => void }) {
  const [category, setCategory] = useState<'disney' | 'series' | 'animals' | 'potter' | 'tequila' | 'custom'>('disney');
  const [disneySub, setDisneySub] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<VideoItem | null>(null);
  const [autoplayNext, setAutoplayNext] = useState(false);
  useEffect(() => {
    onCategoryChange?.(category);
    return () => onCategoryChange?.('');
  }, [category]);
  const [animal, setAnimal] = useState<'dog' | 'cat' | null>(null);
  const [count, setCount] = useState('1');
  const [animalUrls, setAnimalUrls] = useState<string[]>([]);
  const [localAnimalPhotos, setLocalAnimalPhotos] = useState<string[]>([]);
  const [localTequilaPhotos, setLocalTequilaPhotos] = useState<string[]>([]);
  const [customVideos, setCustomVideos] = useState<VideoItem[]>(() => {
    try { return JSON.parse(storageGet('asiste-contenido-personal') ?? '[]') as VideoItem[]; } catch { return []; }
  });
  const [showEditor, setShowEditor] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newMinutes, setNewMinutes] = useState('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const disneySubcategories = useMemo(
    () => Array.from(new Set(content.videos.filter((item) => item.categoria === 'Disney').map((item) => item.subcategoria).filter(Boolean))) as string[],
    [content.videos]
  );

  useEffect(() => {
    if (category === 'disney' && !disneySub && disneySubcategories.length > 0) {
      setDisneySub(disneySubcategories[0]);
    }
  }, [category, disneySub, disneySubcategories]);

  const videos = useMemo(() => (category === 'custom'
    ? customVideos
    : content.videos.filter((item) => {
        if (category === 'disney') return item.categoria === 'Disney' && item.subcategoria === disneySub;
        if (category === 'series') return item.categoria === 'Series';
        if (category === 'potter') return item.categoria === 'Harry Potter';
        return false;
      })
  ).slice().sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0)), [category, disneySub, customVideos, content.videos]);

  useEffect(() => {
    if (category === 'disney' || category === 'series' || category === 'potter') {
      const first = videos.find((item) => getYouTubeEmbedUrl(item.url));
      setNowPlaying(first ?? null);
      setAutoplayNext(false);
    } else {
      setNowPlaying(null);
    }
  }, [videos, category]);

  const fetchAnimals = async () => {
    if (!animal) return;
    setLoading(true); setError(false);
    try {
      if (animal === 'dog') {
        const response = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
        const data = await response.json();
        if (!response.ok || !data.message) throw new Error('dogs');
        setAnimalUrls(data.message);
      } else {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`);
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) throw new Error('cats');
        setAnimalUrls(data.map((item: { url: string }) => item.url));
      }
    } catch {
      setAnimalUrls([]); setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (animal) void fetchAnimals(); }, [animal]);
  const addCustomVideo = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const next = [...customVideos, { id: `personal-${Date.now()}`, categoria: 'Personalizado', titulo: newTitle.trim(), url: newUrl.trim(), minutos: Number(newMinutes) || 10 }];
    setCustomVideos(next);
    storageSet('asiste-contenido-personal', JSON.stringify(next));
    setNewTitle('');
    setNewUrl('');
    setNewMinutes('10');
  };
  const removeCustomVideo = (id: string) => {
    const next = customVideos.filter((item) => item.id !== id);
    setCustomVideos(next);
    storageSet('asiste-contenido-personal', JSON.stringify(next));
  };

  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">pantalla para ver</div>
      <h1 className="asiste-heading">Algo para <span className="asiste-script">ver.</span></h1>
      <p className="asiste-subheading">Las búsquedas son abiertas. Puedes dejar lo predefinido o armar tu propia selección.</p>
      <div className="asiste-toolbar" role="tablist" aria-label="Categorías de entretenimiento">
        {([['disney', 'Disney'], ['series', 'Series'], ['animals', 'Animales'], ['potter', 'Harry Potter'], ['tequila', 'Tequila'], ['custom', 'Mi selección']] as const).map(([id, label]) => <button className={`asiste-chip ${category === id ? 'is-active' : ''}`} onClick={() => { setCategory(id); setAnimal(null); setDisneySub(null); }} key={id} role="tab" aria-selected={category === id}>{label}</button>)}
      </div>
      {category === 'animals' ? (
        <section className="asiste-card asiste-note" style={{ marginTop: 18 }}>
          {!animal ? <><h2>¿Cuántos perros o gatos necesitas?</h2><p>También puedes agregar fotos propias, solo se quedan en esta visita.</p><div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={() => setAnimal('dog')}><Dog size={16} /> Perros</button><button className="asiste-btn asiste-btn-ghost" onClick={() => setAnimal('cat')}>Gatos</button></div><LocalPhotoPicker label="Agregar fotos de animales" photos={localAnimalPhotos} onChange={setLocalAnimalPhotos} /></> : <><div className="asiste-toolbar">{['1', '5', '10'].map((item) => <button className={`asiste-chip ${count === item ? 'is-active' : ''}`} key={item} onClick={() => setCount(item)}>{item}</button>)}<button className="asiste-chip" onClick={() => setCount(String(Math.ceil(Math.random() * 8)))}>Sorpréndeme</button></div>{loading && <div className="asiste-loading">Buscando caritas en la red pública...</div>}{error && <div className="asiste-error"><TequilaCallout content={content} number={1} text="Los animales están teniendo problemas técnicos. Tequila quizá tapó la cámara." /><button className="asiste-small-link" onClick={() => void fetchAnimals()}>Reintentar</button></div>}{(animalUrls.length > 0 || localAnimalPhotos.length > 0) && <div className="animal-gallery">{localAnimalPhotos.map((url) => <img src={url} alt="Foto propia de animal" key={url} />)}{animalUrls.map((url) => <img src={url} alt={animal === 'dog' ? 'Perro sorpresa' : 'Gato sorpresa'} key={url} />)}</div>}<LocalPhotoPicker label="Agregar más fotos" photos={localAnimalPhotos} onChange={setLocalAnimalPhotos} /><div className="asiste-actions"><button className="asiste-btn asiste-btn-muted" onClick={() => void fetchAnimals()}><RotateCcw size={15} /> Más</button><button className="asiste-small-link" onClick={() => setAnimal(null)}>Cambiar</button></div></>}
        </section>
      ) : category === 'tequila' ? (
        <section className="asiste-card asiste-note" style={{ marginTop: 18 }}><h2>Archivo de Tequila</h2><p>Estas fotos son detalles escondidos del espacio. Puedes sumar más desde tu dispositivo.</p><div className="tequila-gallery">{content.tequila.fotos.map((photo, index) => <img src={photo} alt={`Tequila, foto ${index + 1}`} key={photo} onError={(event) => { event.currentTarget.style.display = 'none'; }} />)}{localTequilaPhotos.map((photo, index) => <img src={photo} alt={`Foto extra de Tequila ${index + 1}`} key={photo} />)}</div><LocalPhotoPicker label="Agregar fotos de Tequila" photos={localTequilaPhotos} onChange={setLocalTequilaPhotos} /></section>
      ) : category === 'potter' ? (
        <section className="asiste-card asiste-note" style={{ marginTop: 18 }}>
          <h2>Una visita breve al mundo mágico</h2>
          <div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={() => { sessionState.triviaTopic = 'Harry Potter'; onNavigate('trivia'); }}>Trivia</button><button className="asiste-btn asiste-btn-ghost" onClick={() => onNavigate('house')}>Sortear casa</button></div>
          {nowPlaying && getYouTubeEmbedUrl(nowPlaying.url) && (
            <div className="video-player-wrap">
              {nowPlaying && getYouTubeId(nowPlaying.url) && (
                <YouTubePlayer videoId={getYouTubeId(nowPlaying.url) as string} title={nowPlaying.titulo} autoplay={autoplayNext} />
              )}
              <p className="video-player-caption">{nowPlaying.titulo}</p>
            </div>
          )}
          {videos.map((item) => {
            const embedUrl = getYouTubeEmbedUrl(item.url);
            if (embedUrl) {
              return (
                <button className={`asiste-small-link video-list-item-inline ${nowPlaying?.id === item.id ? 'is-active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', width: '100%' }} onClick={() => { setNowPlaying(item); setAutoplayNext(true); }} key={item.id}>
                  {item.titulo} <Play size={14} />
                </button>
              );
            }
            return (
              <a className="asiste-small-link" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }} href={item.url} target="_blank" rel="noreferrer" onClick={notifyVideoOpened} key={item.id}>
                {item.titulo} <ExternalLink size={14} />
              </a>
            );
          })}
        </section>
      ) : category === 'custom' ? (
        <section className="asiste-card asiste-note" style={{ marginTop: 18 }}><div className="organizer-heading"><div><h2>Mi selección</h2><p>Agrega o elimina lo que sí quieras encontrar aquí.</p></div><button className="asiste-chip" onClick={() => setShowEditor((value) => !value)}><Plus size={14} /> Agregar</button></div>{showEditor && <div className="custom-editor"><input className="asiste-input" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Título" aria-label="Título del contenido" /><input className="asiste-input" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} placeholder="URL o búsqueda pública" aria-label="URL del contenido" /><div className="asiste-actions"><input className="asiste-input" type="number" min="1" value={newMinutes} onChange={(event) => setNewMinutes(event.target.value)} aria-label="Minutos" /><button className="asiste-btn asiste-btn-primary" onClick={addCustomVideo}>Guardar</button></div></div>}{videos.length === 0 && <p className="asiste-muted-text">Todavía no agregas nada.</p>}{videos.map((item) => <div className="custom-content-row" key={item.id}><a className="asiste-card asiste-result" href={item.url} target="_blank" rel="noreferrer" onClick={notifyVideoOpened}><span className="choice-icon"><Film size={18} /></span><div><h3>{item.titulo}</h3><p>{item.minutos} min · contenido personal</p></div><ExternalLink size={16} /></a><button className="asiste-small-link" onClick={() => removeCustomVideo(item.id)} aria-label={`Eliminar ${item.titulo}`}><Trash2 size={14} /></button></div>)}</section>
      ) : (
        <section className="asiste-card asiste-note" style={{ marginTop: 18 }}>
          {category === 'disney' && disneySubcategories.length > 0 && (
            <div className="asiste-toolbar" role="tablist" aria-label="Subcategorías de Disney" style={{ marginTop: 0, marginBottom: 18 }}>
              {disneySubcategories.map((sub) => <button className={`asiste-chip ${disneySub === sub ? 'is-active' : ''}`} onClick={() => setDisneySub(sub)} key={sub}>{sub}</button>)}
            </div>
          )}
          <h2>{category === 'disney' ? (disneySub ?? 'Disney') : 'Serie de respaldo'}</h2>
          {videos.length === 0 && <p>Agrega contenido en `public/data/videos.json`.</p>}
          {nowPlaying && getYouTubeEmbedUrl(nowPlaying.url) && (
            <div className="video-player-wrap">
              {nowPlaying && getYouTubeId(nowPlaying.url) && (
                <YouTubePlayer videoId={getYouTubeId(nowPlaying.url) as string} title={nowPlaying.titulo} autoplay={autoplayNext} />
              )}
              <p className="video-player-caption">{nowPlaying.titulo}</p>
            </div>
          )}
          {videos.map((item) => {
            const embedUrl = getYouTubeEmbedUrl(item.url);
            if (embedUrl) {
              return (
                <button
                  className={`asiste-card asiste-result video-list-item ${nowPlaying?.id === item.id ? 'is-active' : ''}`}
                  style={{ marginTop: 10 }}
                  onClick={() => { setNowPlaying(item); setAutoplayNext(true); }}
                  key={item.id}
                >
                  <span className="choice-icon"><Film size={18} /></span>
                  <div><h3>{item.titulo}</h3><p>{item.subcategoria} · {item.minutos} min</p></div>
                  <Play size={16} />
                </button>
              );
            }
            return (
              <a className="asiste-card asiste-result" style={{ marginTop: 10 }} href={item.url} target="_blank" rel="noreferrer" onClick={notifyVideoOpened} key={item.id}>
                <span className="choice-icon"><Film size={18} /></span>
                <div><h3>{item.titulo}</h3><p>{item.subcategoria} · {item.minutos} min</p></div>
                <ExternalLink size={16} />
              </a>
            );
          })}
        </section>
      )}
    </main>
  );
}

function Music({ content }: { content: Content }) {
  const [customMusic, setCustomMusic] = useState<MusicItem[]>(() => {
    try { return JSON.parse(storageGet('asiste-musica-personal') ?? '[]') as MusicItem[]; } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newTaste, setNewTaste] = useState('');
  const addTaste = () => {
    if (!newTaste.trim()) return;
    const next = [...customMusic, { id: `gusto-${Date.now()}`, titulo: newTaste.trim(), tipo: 'mi gusto', consulta: newTaste.trim() }];
    setCustomMusic(next);
    storageSet('asiste-musica-personal', JSON.stringify(next));
    setNewTaste('');
  };
  const removeTaste = (id: string) => {
    const next = customMusic.filter((item) => item.id !== id);
    setCustomMusic(next);
    storageSet('asiste-musica-personal', JSON.stringify(next));
  };
  const MusicLink = ({ item }: { item: MusicItem }) => <a className="asiste-card asiste-result" href={item.url || `https://open.spotify.com/search/${encodeURIComponent(item.consulta)}`} target="_blank" rel="noreferrer" key={item.id}><span className="choice-icon"><Music2 size={18} /></span><div><h3>{item.titulo}</h3><p>{item.tipo || 'búsqueda en Spotify'}</p></div><span className="asiste-kicker">abrir <Play size={11} style={{ verticalAlign: 'middle' }} /></span></a>;
  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">banda sonora opcional</div>
      <h1 className="asiste-heading">Dale play a <span className="asiste-script">algo.</span></h1>
      <p className="asiste-subheading">No hay reproductor propio. Tú decides qué artista se queda y puedes agregar tus gustos.</p>
      <section className="asiste-card asiste-note" style={{ marginTop: 28 }}><div className="organizer-heading"><div><h2>Tus gustos</h2><p>Morat, artistas y búsquedas que tú agregues.</p></div><button className="asiste-chip" onClick={() => setShowAdd((value) => !value)}><Plus size={14} /> Agregar</button></div>{showAdd && <div className="custom-editor"><input className="asiste-input" value={newTaste} onChange={(event) => setNewTaste(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addTaste(); }} placeholder="Artista, canción o playlist" aria-label="Nuevo gusto musical" /><button className="asiste-btn asiste-btn-primary" onClick={addTaste}>Guardar</button></div>}<div className="asiste-two-col" style={{ marginTop: 18 }}>{[...content.musica, ...customMusic].map((item) => <div className="custom-content-row" key={item.id}><MusicLink item={item} />{customMusic.some((custom) => custom.id === item.id) && <button className="asiste-small-link" onClick={() => removeTaste(item.id)} aria-label={`Eliminar ${item.titulo}`}><Trash2 size={14} /></button>}</div>)}</div></section>
      <section className="asiste-section"><div className="asiste-section-title"><h2>Canciones para distintas situaciones</h2><span>editable en JSON</span></div>{content.musicaSituaciones.map((situation) => <div className="asiste-card asiste-note music-situation" key={situation.id}><h3>{situation.titulo}</h3>{situation.descripcion && <p className="asiste-muted-text">{situation.descripcion}</p>}<div className="asiste-two-col">{situation.items.map((item) => <MusicLink item={item} key={item.id} />)}</div></div>)}</section>
    </main>
  );
}

interface TriviaFeedback { number: number; text: string; }

const triviaCorrectGeneric: TriviaFeedback[] = [
  { number: 6, text: 'Tequila está orgullosa de ti.' },
  { number: 3, text: 'Tequila aprueba esta respuesta.' },
  { number: 2, text: 'Acertaste. Tequila ya se volvió a dormir.' },
  { number: 4, text: 'El algoritmo también lo hubiera dicho.' },
];

const triviaIncorrectGeneric: TriviaFeedback[] = [
  { number: 1, text: 'Tequila finge que no vio nada.' },
  { number: 5, text: 'Nadie es perfecto. Ni Tequila.' },
  { number: 3, text: 'Casi. Tequila tampoco lo sabía.' },
];

const triviaIncorrectRare: TriviaFeedback[] = [
  { number: 3, text: 'Como cuando dices que el esquite amarillo es mejor.' },
];

const triviaCorrectByTopic: Record<string, TriviaFeedback[]> = {
  'Harry Potter': [{ number: 4, text: 'Hermione estaría orgullosa.' }],
  Disney: [{ number: 2, text: 'Tequila también lo hubiera adivinado.' }],
};

const triviaIncorrectByTopic: Record<string, TriviaFeedback[]> = {
  'Harry Potter': [{ number: 1, text: 'Ni con el Mapa del Merodeador.' }],
};

function pickTriviaFeedback(isCorrect: boolean, tema: string): TriviaFeedback {
  const topicPool = isCorrect ? triviaCorrectByTopic[tema] : triviaIncorrectByTopic[tema];
  let pool = isCorrect ? triviaCorrectGeneric : triviaIncorrectGeneric;
  if (topicPool && Math.random() < 0.5) pool = topicPool;
  if (!isCorrect && Math.random() < 0.12) pool = triviaIncorrectRare;
  return pool[Math.floor(Math.random() * pool.length)];
}

function Trivia({ content }: { content: Content }) {
  const topic = sessionState.triviaTopic;
  const pool = useMemo(() => {
    const filtered = topic ? content.trivia.filter((item) => item.tema === topic) : content.trivia;
    return filtered.length > 0 ? filtered : content.trivia;
  }, [content.trivia, topic]);

  const [queue, setQueue] = useState<number[]>(() => shuffleQueue(pool.length));
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<TriviaFeedback | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    setQueue(shuffleQueue(pool.length));
    setPosition(0);
    setAnswer(null);
    setFeedback(null);
    setShowReward(false);
  }, [pool]);

  const currentIndex = queue[position] ?? 0;
  const current = pool[currentIndex] ?? fallbackContent.trivia[0];

  const selectAnswer = (index: number) => {
    setAnswer(index);
    const isCorrect = index === current.respuesta;
    setFeedback(pickTriviaFeedback(isCorrect, current.tema));
    setShowReward(true);
  };

  const nextQuestion = () => {
    setAnswer(null);
    setFeedback(null);
    setShowReward(false);
    setPosition((value) => {
      const next = value + 1;
      if (next >= queue.length) {
        setQueue(shuffleQueue(pool.length, currentIndex));
        return 0;
      }
      return next;
    });
  };

  return (
    <main className="asiste-main" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="asiste-eyebrow">{current.tema} · sin examen</div>
      <h1 className="asiste-heading">Una pregunta <span className="asiste-script">inofensiva.</span></h1>
       <section className="asiste-card asiste-note" style={{ marginTop: 26 }}><h2 style={{ fontSize: 21 }}>{current.pregunta}</h2><div className="asiste-actions">{current.opciones.map((option, index) => <button className={`asiste-chip ${answer === index ? 'is-active' : ''}`} onClick={() => selectAnswer(index)} key={option}>{option}</button>)}</div>{answer !== null && <p className="trivia-feedback">{answer === current.respuesta ? 'Correcto. Sistema estable.' : `Casi. Era: ${current.opciones[current.respuesta]}.`} {current.explicacion}</p>}<button className="asiste-small-link" onClick={nextQuestion} style={{ marginTop: 12 }}>Otra pregunta <ArrowRight size={14} /></button></section>
       {showReward && feedback && <TequilaReward content={content} onClose={() => setShowReward(false)} number={feedback.number} text={feedback.text} />}
    </main>
  );
}

function Nerd({ content }: { content: Content }) {
  const [queue, setQueue] = useState<number[]>(() => shuffleQueue(content.datos.length));
  const [position, setPosition] = useState(0);
  const currentIndex = queue[position] ?? 0;
  const current = content.datos[currentIndex] ?? fallbackContent.datos[0];

  const next = () => {
    setPosition((value) => {
      const nextValue = value + 1;
      if (nextValue >= queue.length) {
        setQueue(shuffleQueue(content.datos.length, currentIndex));
        return 0;
      }
      return nextValue;
    });
  };

  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">ok, esto ya se puso nerd</div>
      <h1 className="asiste-heading">Modo <span className="asiste-script">nerd.</span></h1>
      <p className="asiste-subheading">Datos cortitos de cosas que hacen clic en la cabeza.</p>
      <section className="asiste-card asiste-note" style={{ marginTop: 26 }}><div className="choice-icon"><Wrench size={19} /></div><div className="asiste-eyebrow" style={{ marginTop: 16 }}>{current.categoria}</div><h2>{current.titulo}</h2><p>{current.texto}</p><button className="asiste-btn asiste-btn-primary" onClick={next}>Otro dato <ArrowRight size={15} /></button></section>
    </main>
  );
}

const memoryPhotos = [
  'assets/img/tequila/memoria/memoria1.png',
  'assets/img/tequila/memoria/memoria2.png',
  'assets/img/tequila/memoria/memoria3.png',
  'assets/img/tequila/memoria/memoria4.png',
];

function shuffledMemoryCards() {
  return [...memoryPhotos, ...memoryPhotos].sort(() => Math.random() - 0.5);
}

function GameHub({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <main className="asiste-main">
      <div className="asiste-eyebrow">juegos breves</div>
      <h1 className="asiste-heading">Un rato de <span className="asiste-script">juego.</span></h1>
      <p className="asiste-subheading">Nada con puntajes que importen. Elige uno.</p>
      <div className="asiste-grid" style={{ marginTop: 28 }}>
        <button className="asiste-card asiste-choice" onClick={() => onNavigate('memory')}>
          <span className="choice-icon"><Gamepad2 size={19} /></span>
          <h3>Memoria</h3>
          <p>Memoria de cartas con fotos de Tequila.</p>
        </button>
        <button className="asiste-card asiste-choice" onClick={() => onNavigate('runner')}>
          <span className="choice-icon"><Dog size={19} /></span>
          <h3>Tequila corredora</h3>
          <p>Salta obstáculos. Sin internet, sin problema.</p>
        </button>
        <a className="asiste-card asiste-choice" href="https://www.friv.com/" target="_blank" rel="noreferrer" onClick={notifyVideoOpened}>
          <span className="choice-icon"><ExternalLink size={19} /></span>
          <h3>Más juegos</h3>
          <p>Un atajo externo, por si quieres algo distinto.</p>
        </a>
      </div>
    </main>
  );
}

interface RunnerObstacle { id: number; x: number; }

function TequilaRunner() {
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(storageGet('asiste-runner-best') || 0));
  const [jumpY, setJumpY] = useState(0);
  const [obstacles, setObstacles] = useState<RunnerObstacle[]>([]);
  const velocityRef = useRef(0);
  const isJumpingRef = useRef(false);
  const speedRef = useRef(4);
  const frameRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef(0);
  const idCounter = useRef(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const jump = () => {
    if (status !== 'playing' || isJumpingRef.current) return;
    isJumpingRef.current = true;
    velocityRef.current = 13;
  };

  const start = () => {
    setScore(0);
    setObstacles([]);
    speedRef.current = 2.5;
    isJumpingRef.current = false;
    velocityRef.current = 0;
    setJumpY(0);
    setStatus('playing');
  };

  useEffect(() => {
    if (status !== 'playing') return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 16.67;
      lastTime = time;

      if (isJumpingRef.current) {
        velocityRef.current -= 0.45 * delta;
        setJumpY((y) => {
          const next = y + velocityRef.current;
          if (next <= 0) {
            isJumpingRef.current = false;
            velocityRef.current = 0;
            return 0;
          }
          return next;
        });
      }

      speedRef.current = Math.min(speedRef.current + 0.0008 * delta, 6.5);

      setObstacles((prev) => {
        const stageWidth = stageRef.current?.clientWidth ?? 600;
        const moved = prev
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - speedRef.current * delta }))
          .filter((obstacle) => obstacle.x > -40);
        lastSpawnRef.current += delta;
        const spawnThreshold = 90 - Math.min(speedRef.current * 3, 25);
        if (lastSpawnRef.current > spawnThreshold) {
          lastSpawnRef.current = 0;
          idCounter.current += 1;
          moved.push({ id: idCounter.current, x: stageWidth + 20 });
        }
        return moved;
      });

      setScore((value) => value + delta * 0.12);
      frameRef.current = window.requestAnimationFrame(loop);
    };

    frameRef.current = window.requestAnimationFrame(loop);
    return () => { if (frameRef.current) window.cancelAnimationFrame(frameRef.current); };
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') return;
    const tequilaLeft = 40;
    const tequilaRight = tequilaLeft + 42;
    const hit = obstacles.some((obstacle) => {
      const overlapsX = obstacle.x + 24 > tequilaLeft && obstacle.x < tequilaRight;
      const overlapsY = jumpY < 34;
      return overlapsX && overlapsY;
    });
    if (hit) {
      setStatus('over');
      setBest((value) => {
        const rounded = Math.floor(score);
        const next = Math.max(value, rounded);
        storageSet('asiste-runner-best', String(next));
        return next;
      });
    }
  }, [obstacles, jumpY, status, score]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === 'Space') { event.preventDefault(); status === 'playing' ? jump() : start(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [status]);

  return (
    <main className="asiste-main" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="asiste-eyebrow">sin internet, sin problema</div>
      <h1 className="asiste-heading">Tequila <span className="asiste-script">corredora.</span></h1>
      <p className="asiste-subheading">Toca la pantalla o usa la barra espaciadora para saltar.</p>
      <div className="asiste-card asiste-note" style={{ marginTop: 24, textAlign: 'center' }}>
        <div className="runner-score">puntos · {Math.floor(score)} &nbsp;&nbsp; mejor · {best}</div>
        <div
          className="runner-stage"
          ref={stageRef}
          onClick={() => (status === 'playing' ? jump() : start())}
          role="button"
          tabIndex={0}
          aria-label="Área del juego, toca para saltar o empezar"
        >
          <div className="runner-ground" />
          <img
            src="assets/img/tequila/tequila_runner.png"
            alt="Tequila corriendo"
            className="runner-tequila"
            style={{ transform: `translateY(${-jumpY}px)` }}
          />
          {obstacles.map((obstacle) => (
            <div className="runner-obstacle" key={obstacle.id} style={{ left: obstacle.x }} />
          ))}
          {status === 'idle' && <div className="runner-overlay">Toca para empezar</div>}
          {status === 'over' && <div className="runner-overlay">Se acabó. Toca para otra vuelta.</div>}
        </div>
        <button className="asiste-btn asiste-btn-ghost" onClick={start} style={{ marginTop: 16 }}>
          <RotateCcw size={15} /> Reiniciar
        </button>
      </div>
    </main>
  );
}

function MemoryGame({ content }: { content: Content }) {
  const [cards, setCards] = useState(shuffledMemoryCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const reset = () => { setCards(shuffledMemoryCards()); setFlipped([]); setMatched([]); setMoves(0); setShowReward(false); };
  const clickCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      if (cards[next[0]] === cards[next[1]]) {
         const nextMatched = [...matched, ...next];
         setMatched(nextMatched); setFlipped([]);
         if (nextMatched.length === cards.length) setShowReward(true);
      } else {
        window.setTimeout(() => setFlipped([]), 650);
      }
    }
  };
  return (
    <main className="asiste-main" style={{ maxWidth: 650, margin: '0 auto' }}>
      <div className="asiste-eyebrow">juego breve</div><h1 className="asiste-heading">Memoria <span className="asiste-script">suave.</span></h1><p className="asiste-subheading">Sin récord, sin ranking, sin motivo para hacerlo perfecto.</p>
      <div className="asiste-card asiste-note" style={{ marginTop: 25, textAlign: 'center' }}><div className="asiste-kicker">movimientos · {moves}</div><div className="asiste-memory">{cards.map((photo, index) => { const isVisible = flipped.includes(index) || matched.includes(index); return <button className={`memory-card ${isVisible ? 'is-flipped' : ''} ${matched.includes(index) ? 'is-matched' : ''}`} onClick={() => clickCard(index)} key={index} aria-label={`Carta ${index + 1}`}>{isVisible && <img src={photo} alt="Tequila" className="memory-card-image" />}</button>; })}</div>{matched.length === cards.length && <p className="trivia-feedback">Listo. Tequila aprueba este resultado.</p>}<button className="asiste-btn asiste-btn-ghost" onClick={reset}><RotateCcw size={15} /> Reiniciar</button></div>
       {showReward && <TequilaReward content={content} onClose={() => setShowReward(false)} />}
    </main>
  );
}

function Surprise({ content, onNavigate }: { content: Content; onNavigate: (screen: Screen) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SurpriseItem | null>(null);
  const spin = () => {
    setSpinning(true);
    window.setTimeout(() => {
      const options = content.sorprende.filter((item) => item.id !== sessionState.lastExperience);
      const total = options.reduce((sum, item) => sum + item.peso, 0);
      let pick = Math.random() * Math.max(total, 1);
      const selected = options.find((item) => { pick -= item.peso; return pick <= 0; }) ?? options[0] ?? fallbackContent.sorprende[0];
      sessionState.lastExperience = selected.id;
      setResult(selected);
      setSpinning(false);
    }, 900);
  };
  const openResult = () => {
    if (!result) return;
    const destinations: Record<string, Screen> = { perros: 'entertainment', gatos: 'entertainment', disney: 'entertainment', trivia: 'trivia', memoria: 'memory', dato: 'nerd', harry: 'entertainment', 'soy-luna': 'entertainment', zombies: 'entertainment', yatra: 'music', danny: 'music' };
    const destination = destinations[result.id];
    if (destination === 'trivia') sessionState.triviaTopic = null;
    if (destination) onNavigate(destination);
    else spin();
  };
  return (
    <main className="asiste-main" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="asiste-eyebrow">azar amable</div><h1 className="asiste-heading">Que decida la <span className="asiste-script">ruleta.</span></h1><p className="asiste-subheading">No son instrucciones, solo una chispa.</p>
      <section className="asiste-card asiste-note" style={{ textAlign: 'center', marginTop: 28 }}><div className={`asiste-wheel ${spinning ? 'is-spinning' : ''}`} aria-hidden="true" /><p>{result?.intro || 'La ruleta está esperando una señal.'}</p>{result && <><h2>{result.titulo}</h2><div className="asiste-actions" style={{ justifyContent: 'center' }}><button className="asiste-btn asiste-btn-primary" onClick={openResult}>{['absurda', 'easter'].includes(result.id) ? 'Otra' : 'Abrir'} {['absurda', 'easter'].includes(result.id) ? <Shuffle size={16} /> : <ArrowRight size={16} />}</button><button className="asiste-btn asiste-btn-ghost" onClick={spin}>Otra</button></div></>} {!result && <button className="asiste-btn asiste-btn-primary" onClick={spin} disabled={spinning}><Sparkles size={16} /> {spinning ? 'girando...' : 'Sorpréndeme'}</button>}</section>
       {result?.id === 'perros' && <TequilaCallout content={content} number={4} text="Tequila ha seleccionado perros para ti." title="El algoritmo te está viendo." />}
    </main>
  );
}

function Organizer({ content }: { content: Content }) {
  const [enabled, setEnabled] = useState(() => storageGet('asiste-organizer') === 'on');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>(() => { try { return JSON.parse(storageGet('asiste-pendientes') ?? '[]'); } catch { return []; } });
  const [timer, setTimer] = useState(0);
  const [showReward, setShowReward] = useState(false);
  useEffect(() => { if (!timer) return; const interval = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(interval); }, [timer]);
  const persist = (next: { text: string; done: boolean }[]) => { setTasks(next); storageSet('asiste-pendientes', JSON.stringify(next)); };
  const add = () => { if (!task.trim()) return; persist([...tasks, { text: task.trim(), done: false }]); setTask(''); };
  return (
    <main className="asiste-main" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="asiste-eyebrow">solo si te sirve</div><h1 className="asiste-heading">Una cosa <span className="asiste-script">a la vez.</span></h1><p className="asiste-subheading">Se guarda solo en este dispositivo y únicamente porque tú activaste esta parte.</p>
       <section className="asiste-card asiste-note" style={{ marginTop: 25 }}><div className="organizer-heading"><div><h2 style={{ fontSize: 18, margin: 0 }}>Pendientes locales</h2><p style={{ fontSize: 13, marginTop: 5 }}>Sin calendario, metas ni estadísticas.</p></div><button className={`asiste-chip ${enabled ? 'is-active' : ''}`} onClick={() => { const next = !enabled; setEnabled(next); storageSet('asiste-organizer', next ? 'on' : 'off'); }}>{enabled ? 'activo' : 'activar'}</button></div>{enabled && <><div style={{ display: 'flex', gap: 8, marginTop: 18 }}><input className="asiste-input" value={task} onChange={(event) => setTask(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') add(); }} placeholder="pendiente pequeño" aria-label="Nuevo pendiente" /><button className="asiste-btn asiste-btn-primary" onClick={add}><Check size={16} /></button></div><div style={{ marginTop: 12 }}>{tasks.length === 0 ? <><TequilaCallout content={content} number={5} text="Nada pendiente. Tequila descansa." /></> : tasks.map((item, index) => <div className={`asiste-task ${item.done ? 'is-done' : ''}`} key={`${item.text}-${index}`}><label><input type="checkbox" checked={item.done} onChange={() => { if (!item.done) setShowReward(true); persist(tasks.map((taskItem, taskIndex) => taskIndex === index ? { ...taskItem, done: !taskItem.done } : taskItem)); }} /><span>{item.text}</span></label><button className="asiste-small-link" onClick={() => persist(tasks.filter((_, taskIndex) => taskIndex !== index))} aria-label={`Borrar ${item.text}`}><Trash2 size={14} /></button></div>)}</div><div className="asiste-actions" style={{ marginTop: 18 }}><button className="asiste-btn asiste-btn-muted" onClick={() => setTimer(timer ? 0 : 25 * 60)}><Clock3 size={15} /> {timer ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Temporizador 25 min'}</button><button className="asiste-small-link" onClick={() => { const pending = tasks.find((item) => !item.done); if (pending) window.alert(`Uno solo: ${pending.text}`); }}>Elegir uno solo para empezar</button></div></>}</section>
       {showReward && <TequilaReward content={content} onClose={() => setShowReward(false)} />}
    </main>
  );
}

function OptionalAudio({ path }: { path?: string }) {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!path) return;
    void fetch(path, { method: 'HEAD' }).then((response) => {
      const contentType = response.headers.get('content-type') ?? '';
      if (response.ok && !contentType.includes('text/html')) setAvailable(true);
    }).catch(() => setAvailable(false));
  }, [path]);
  if (!available || !path) return null;
  return (
    <div className="optional-audio">
      <audio src={path} controls={false} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button className="asiste-chip" onClick={(event) => {
        const audio = event.currentTarget.previousElementSibling as HTMLAudioElement | null;
        if (!audio) return;
        if (audio.paused) void audio.play(); else audio.pause();
      }} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
        <Music2 size={14} /> {playing ? 'Pausar' : 'Música'}
      </button>
    </div>
  );
}

function Letter({ content, onOpen }: { content: Content; onOpen: () => void }) {
  const [ready, setReady] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [lanternsVisible, setLanternsVisible] = useState(true);

  const lanterns = useMemo(
    () =>
      Array.from({ length: 100 }).map(() => ({
        left: Math.random() * 94,
        top: Math.random() * 100,
        size: 34 + Math.random() * 40,
        duration: 6 + Math.random() * 4.5,
        delay: Math.random() * 3.6,
        drift: (Math.random() - 0.5) * 70,
        rise: 110 + Math.random() * 50,
      })),
    []
  );

  useEffect(() => {
    void document.fonts?.ready.finally(() => setReady(true));
    const signature = new Image();
    signature.onload = () => setSignatureUrl('assets/img/firma.png');
    signature.src = 'assets/img/firma.png';
  }, []);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setLanternsVisible(false), 11500);
    return () => window.clearTimeout(hideTimer);
  }, []);

  return (
    <main className={`asiste-letter-wrap asiste-main ${ready ? 'is-ready' : ''}`}>
      {lanternsVisible && (
        <div className="lantern-intro" aria-hidden="true">
          {lanterns.map((lantern, index) => (
            <img
              key={index}
              className="lantern-intro-item"
              src="assets/img/linterna.png"
              alt=""
              style={{
                position: 'absolute',
                left: `${lantern.left}%`,
                top: `${lantern.top}%`,
                width: `${lantern.size}px`,
                animationDuration: `${lantern.duration}s`,
                animationDelay: `${lantern.delay}s`,
                ['--drift' as string]: `${lantern.drift}px`,
                ['--rise' as string]: `${lantern.rise}vh`,
              }}
            />
          ))}
        </div>
      )}
      <article className="asiste-letter">
        <div className="letter-seal"><Gift size={29} strokeWidth={1.4} aria-hidden="true" /></div>
        <div className="letter-title-row">
          <h1>Para ti, <span className="asiste-script">{replacePersonal('[[NOMBRE]]', content.config)}.</span></h1>
          <img className="letter-hat-decoration" src="assets/img/tequila/tequi_hat.png" alt="Tequila con sombrero de fiesta" />
        </div>
        <div className="letter-copy">{content.carta.parrafos.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{replacePersonal(paragraph, content.config)}</p>)}</div>
        {signatureUrl ? <img className="letter-signature-image" src={signatureUrl} alt={`Firma de ${content.config.tuNombre}`} /> : <div className="letter-signature">{replacePersonal(content.carta.firma, content.config)}</div>}
        <div className="asiste-actions"><button className="asiste-btn asiste-btn-primary" onClick={onOpen}>Entrar <ArrowRight size={16} /></button></div>
        
      </article>
    </main>
  );
}

function BirthdayIntro({ content, onOpen }: { content: Content; onOpen: () => void }) {
  return (
    <main className="birthday-intro asiste-main">
      <h1>Feliz cumpleaños, <span className="asiste-script">{replacePersonal('[[NOMBRE]]', content.config)}.</span></h1>
      <p>Hay algo aquí que hice pensando en ti.</p>
      <button className="asiste-btn asiste-btn-primary" onClick={onOpen}>Abrir <ArrowRight size={16} /></button>
    </main>
  );
}

interface HouseInfo {
  id: string;
  nombre: string;
  colorA: string;
  colorB: string;
  rasgo: string;
  foto: string;
}

const houses: HouseInfo[] = [
  { id: 'gryffindor', nombre: 'Gryffindor', colorA: '#740001', colorB: '#D3A625', rasgo: 'valiente hasta cuando no hace falta.', foto: 'assets/img/tequila/casas/gryffindor.png' },
  { id: 'ravenclaw', nombre: 'Ravenclaw', colorA: '#0E1A40', colorB: '#946B2D', rasgo: 'con la respuesta correcta y sin que se la pidan.', foto: 'assets/img/tequila/casas/ravenclaw.png' },
  { id: 'hufflepuff', nombre: 'Hufflepuff', colorA: '#FFDB00', colorB: '#372E29', rasgo: 'leal incluso cuando nadie está mirando.', foto: 'assets/img/tequila/casas/hufflepuff.png' },
  { id: 'slytherin', nombre: 'Slytherin', colorA: '#1A472A', colorB: '#AAAAAA', rasgo: 'ambiciosa y con un plan para todo.', foto: 'assets/img/tequila/casas/slytherin.png' },
];

function HouseSorting() {
  const [sorting, setSorting] = useState(false);
  const [result, setResult] = useState<HouseInfo | null>(null);
  const sort = () => {
    setSorting(true);
    setResult(null);
    window.setTimeout(() => {
      const options = houses.filter((house) => house.id !== sessionState.lastCategory);
      const pick = options[Math.floor(Math.random() * options.length)] ?? houses[0];
      sessionState.lastCategory = pick.id;
      setResult(pick);
      setSorting(false);
    }, 1400);
  };
  return (
    <main className="asiste-main" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="asiste-eyebrow">el sombrero decide</div>
      <h1 className="asiste-heading">Sorteo de <span className="asiste-script">casa.</span></h1>
      <p className="asiste-subheading">Solo por diversión. No es un test de personalidad, es un botón.</p>
      <section className="asiste-card asiste-note house-sorting" style={{ marginTop: 26, textAlign: 'center' }}>
        <div className={`house-hat ${sorting ? 'is-thinking' : ''}`} aria-hidden="true">🎩</div>
        {!result && !sorting && <button className="asiste-btn asiste-btn-primary" onClick={sort}><Shuffle size={16} /> Ponte el sombrero</button>}
        {sorting && <p className="asiste-kicker">Pensándolo bien...</p>}
        {result && (
          <>
            <div className="house-result" style={{ background: `linear-gradient(135deg, ${result.colorA}, ${result.colorB})` }}>
              <img src={result.foto} alt={`Tequila vestida de ${result.nombre}`} className="house-tequila-photo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
              <h2>{result.nombre}</h2>
              <p>Tequila también quedó ahí: {result.rasgo}</p>
            </div>
            <button className="asiste-btn asiste-btn-ghost" onClick={sort} style={{ marginTop: 18 }}><RotateCcw size={15} /> Sortear otra vez</button>
          </>
        )}
      </section>
    </main>
  );
}

function AppShell() {
  const [content, setContent] = useState<Content | null>(null);
  const [screen, setScreen] = useState<Screen>('home');
  const [opening, setOpening] = useState<'intro' | 'letter' | 'home' | null>(null);
  const [entertainmentCategory, setEntertainmentCategory] = useState('');
  const [muted, setMuted] = useState(() => storageGet('asiste-muted') === '1');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTrackRef = useRef<string | null>(null);

  const activeTrack = useMemo(() => {
    if (!content) return null;
    if (opening === 'letter') return content.config.audioCarta || null;
    if (opening !== 'home') return null;
    const pistas = content.config.audioPistas || {};
    if (screen === 'entertainment' && entertainmentCategory === 'potter') {
      return pistas['entertainment-potter'] || content.config.audioHarry || pistas.home || content.config.audioMenu || null;
    }
    if (screen === 'house') {
      return pistas.house || content.config.audioHarry || pistas.home || content.config.audioMenu || null;
    }
    return pistas[screen] || pistas.home || content.config.audioMenu || null;
  }, [content, opening, screen, entertainmentCategory]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeTrack === lastTrackRef.current) {
      audio.muted = muted;
      return;
    }
    lastTrackRef.current = activeTrack;
    if (!activeTrack) {
      audio.pause();
      return;
    }
    audio.src = activeTrack;
    audio.loop = true;
    audio.muted = muted;
    void audio.play().catch(() => {});
  }, [activeTrack, muted]);

  useEffect(() => { storageSet('asiste-muted', muted ? '1' : '0'); }, [muted]);

  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => setVideoPlaying(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener('asiste-video-state', handler);
    return () => window.removeEventListener('asiste-video-state', handler);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;
    if (videoPlaying) audio.pause();
    else if (!document.hidden) void audio.play().catch(() => {});
  }, [videoPlaying, activeTrack]);

  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden || videoPlaying) {
        audio.pause();
      } else if (activeTrack && !muted) {
        void audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [activeTrack, muted, videoPlaying]);
  useEffect(() => {
    void loadContent().then(setContent);
    let cancelled = false;
    const loadHandwriting = async () => {
      for (const [path, format] of [['assets/fonts/miletra.ttf', 'truetype'], ['assets/fonts/miletra.otf', 'opentype']] as const) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          const contentType = response.headers.get('content-type') ?? '';
          if (!response.ok || contentType.includes('text/html')) continue;
          const font = new FontFace('Mi Letra', `url(${path}) format('${format}')`);
          await font.load();
          if (!cancelled) document.fonts.add(font);
          break;
        } catch {
          // Missing optional handwriting assets use the Caveat fallback.
        }
      }
    };
    void loadHandwriting();
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') storageRemove('carta_vista');
    setOpening(params.get('carta') === '1' ? 'letter' : storageGet('carta_vista') === '1' ? 'home' : 'intro');
    return () => { cancelled = true; };
  }, []);
  const navigate = (next: Screen) => { sessionState.currentPath = next; setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
if (!content || opening === null) {
  return (
    <>
      <div className="asiste-app asiste-preparing" aria-label="Cargando Asiste" />
      <audio ref={audioRef} />
    </>
  );
}

  let body: ReactNode;
if (opening === 'intro') {
  body = <div className="asiste-app"><div className="asiste-shell"><BirthdayIntro content={content} onOpen={() => setOpening('letter')} /></div></div>;
} else if (opening === 'letter') {
  body = <div className="asiste-app"><div className="asiste-shell"><Letter content={content} onOpen={() => { storageSet('carta_vista', '1'); setOpening('home'); setScreen('home'); }} /></div></div>;
} else {
  body = (
    <div className="asiste-app">
      <div className="asiste-shell">
        <PageHeader screen={screen} onHome={() => navigate('home')} config={content.config} />
        {screen === 'home' && <Home content={content} onNavigate={navigate} />}
        {screen === 'write' && <FreeText content={content} onNavigate={navigate} />}
        {screen === 'rest' && <Rest content={content} onNavigate={navigate} />}
        {screen === 'quiet' && <Quiet content={content} onNavigate={navigate} />}
        {screen === 'distract' && <Distract content={content} onNavigate={navigate} />}
        {screen === 'music' && <Music content={content} />}
        {screen === 'entertainment' && <Entertainment content={content} onNavigate={navigate} onCategoryChange={setEntertainmentCategory} />}
        {screen === 'trivia' && <Trivia content={content} />}
        {screen === 'nerd' && <Nerd content={content} />}
        {screen === 'game' && <GameHub onNavigate={navigate} />}
        {screen === 'memory' && <MemoryGame content={content} />}
        {screen === 'runner' && <TequilaRunner />}
        {screen === 'surprise' && <Surprise content={content} onNavigate={navigate} />}
        {screen === 'house' && <HouseSorting />}
        {screen === 'organizer' && <Organizer content={content} />}
        <footer className="asiste-footer-links">
          {screen !== 'home' && <button className="asiste-small-link" onClick={() => navigate('home')}><ArrowLeft size={13} /> Inicio</button>}
          <button className="asiste-small-link" onClick={() => setOpening('letter')}><Gift size={13} /> Leer la carta</button>
        </footer>
      </div>
    </div>
  );
}

return (
  <>
    {body}
    <audio ref={audioRef} />
    {opening === 'home' && (
      <>
        <button className="asiste-mute-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        {content.config.whatsapp && (
          <a className="spidey-corner" href={`https://wa.me/${content.config.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Un atajo escondido">
            <img src="assets/img/spidey.png" alt="" />
          </a>
        )}
      </>
    )}
  </>
);
}

function Router() {
  return (
    <ErrorBoundary resetKey={window.location.pathname}>
      <Switch>
        <Route path="/" component={AppShell} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;