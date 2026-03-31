/**
 * Shared Avatar Options for BIZEN
 * Uses DiceBear CDN (https://dicebear.com) — no API key needed.
 * Format: https://api.dicebear.com/9.x/{style}/svg?seed={seed}&backgroundColor={hex}&radius=50
 *
 * Backward-compatible: old mascot PNG avatars still work via AvatarDisplay.
 */

export interface AvatarOption {
  type: 'dicebear' | 'mascot' | 'gradient' | 'character'
  id: string
  label: string
  style?: string
  seed?: string
  backgroundColor?: string
  gradient?: string
  character?: string
  pattern?: string
  color?: string
  abstract?: string
  colors?: string[]
  shape?: string
}

const DB = (id: string, label: string, style: string, seed: string, backgroundColor: string): AvatarOption => ({
  type: 'dicebear', id, label, style, seed, backgroundColor,
})

export const AVATAR_OPTIONS: AvatarOption[] = [

  // ── Aventurero (adventurer) ─────────────────────────────────────────────
  DB('adv-1',  'Valiente',    'adventurer', 'Felix',        'DBEAFE'),
  DB('adv-2',  'Exploradora', 'adventurer', 'Sofia',        'FCE7F3'),
  DB('adv-3',  'Capitán',     'adventurer', 'Marco',        'D1FAE5'),
  DB('adv-4',  'Pionero',     'adventurer', 'Diego',        'FEF3C7'),
  DB('adv-5',  'Inventora',   'adventurer', 'Luna',         'EDE9FE'),
  DB('adv-6',  'Guardián',    'adventurer', 'Hunter',       'FEE2E2'),
  DB('adv-7',  'Viajera',     'adventurer', 'Mia',          'F0FDF4'),
  DB('adv-8',  'Héroe',       'adventurer', 'Liam',         'FFF7ED'),
  DB('adv-9',  'Sabia',       'adventurer', 'Zoe',          'F5F3FF'),
  DB('adv-10', 'Campeón',     'adventurer', 'Carlos',       'ECFDF5'),
  DB('adv-11', 'Rebelde',     'adventurer', 'Rebel11',      'FEFCE8'),
  DB('adv-12', 'Leyenda',     'adventurer', 'Legend12',     'FDF2F8'),
  DB('adv-13', 'Titán',       'adventurer', 'Titan13',      'EFF6FF'),
  DB('adv-14', 'Estratega',   'adventurer', 'Strat14',      'FFF1F2'),
  DB('adv-15', 'Visionario',  'adventurer', 'Vision15',     'ECFEFF'),

  // ── Elegante (lorelei) ──────────────────────────────────────────────────
  DB('lor-1',  'Aurora',      'lorelei',    'Aurora',       'FEE2E2'),
  DB('lor-2',  'Cosmos',      'lorelei',    'Cosmos',       'E0F2FE'),
  DB('lor-3',  'Nova',        'lorelei',    'Nova',         'F0FDF4'),
  DB('lor-4',  'Zenith',      'lorelei',    'Zenith',       'F5F3FF'),
  DB('lor-5',  'Orión',       'lorelei',    'Orion',        'FFFBEB'),
  DB('lor-6',  'Selene',      'lorelei',    'Selene',       'FDF2F8'),
  DB('lor-7',  'Astrid',      'lorelei',    'Astrid',       'EFF6FF'),
  DB('lor-8',  'Celeste',     'lorelei',    'Celeste',      'FEFCE8'),
  DB('lor-9',  'Marina',      'lorelei',    'Marina',       'F0FDFA'),
  DB('lor-10', 'Iris',        'lorelei',    'Iris',         'FAF5FF'),
  DB('lor-11', 'Carmen',      'lorelei',    'Carmen11',     'FFF1F2'),
  DB('lor-12', 'Elena',       'lorelei',    'Elena12',      'ECFEFF'),
  DB('lor-13', 'Sofía',       'lorelei',    'Sofia13',      'F7FEE7'),
  DB('lor-14', 'Lucía',       'lorelei',    'Lucia14',      'FEF9C3'),
  DB('lor-15', 'Valentina',   'lorelei',    'Vale15',       'FEF2F2'),

  // ── Pixel (pixel-art) ───────────────────────────────────────────────────
  DB('pix-1',  'Pixelito',    'pixel-art',  'Bizen01',      'DBEAFE'),
  DB('pix-2',  'Bit',         'pixel-art',  'BitMaster',    'FEF9C3'),
  DB('pix-3',  'Retro',       'pixel-art',  'Retro99',      'FCE7F3'),
  DB('pix-4',  'NPC',         'pixel-art',  'NPC2025',      'D1FAE5'),
  DB('pix-5',  'Sprite',      'pixel-art',  'SpriteX',      'E0E7FF'),
  DB('pix-6',  'Gamer',       'pixel-art',  'GamerPro',     'FEE2E2'),
  DB('pix-7',  'Vóxel',       'pixel-art',  'Voxel42',      'FFF7ED'),
  DB('pix-8',  'Chip',        'pixel-art',  'ChipX8',       'F0FDF4'),
  DB('pix-9',  'Arcade',      'pixel-art',  'Arcade88',     'FDF4FF'),
  DB('pix-10', 'Byte',        'pixel-art',  'ByteCode',     'ECFDF5'),
  DB('pix-11', 'Quest',       'pixel-art',  'Quest11',      'FEFCE8'),
  DB('pix-12', 'Loop',        'pixel-art',  'Loop12',       'FDF2F8'),
  DB('pix-13', 'Render',      'pixel-art',  'Render13',     'EFF6FF'),
  DB('pix-14', 'Debug',       'pixel-art',  'Debug14',      'FFF1F2'),
  DB('pix-15', 'Stack',       'pixel-art',  'Stack15',      'ECFEFF'),

  // ── Minimal (notionists) ────────────────────────────────────────────────
  DB('not-1',  'Línea',       'notionists', 'Alice',        'F8FAFC'),
  DB('not-2',  'Trazo',       'notionists', 'Bob',          'F0FDF4'),
  DB('not-3',  'Boceto',      'notionists', 'Charlie',      'FFF7ED'),
  DB('not-4',  'Mínimo',      'notionists', 'Dave',         'FDF4FF'),
  DB('not-5',  'Esencia',     'notionists', 'Eve',          'ECFDF5'),
  DB('not-6',  'Forma',       'notionists', 'Frank',        'FEF2F2'),
  DB('not-7',  'Nube',        'notionists', 'Grace',        'EFF6FF'),
  DB('not-8',  'Duna',        'notionists', 'Hank',         'FEFCE8'),
  DB('not-9',  'Silueta',     'notionists', 'Ivy',          'F0FDFA'),
  DB('not-10', 'Arco',        'notionists', 'Jack',         'FAF5FF'),
  DB('not-11', 'Punto',       'notionists', 'Kai11',        'FFF1F2'),
  DB('not-12', 'Vector',      'notionists', 'Leo12',        'ECFEFF'),
  DB('not-13', 'Curva',       'notionists', 'Mia13',        'F7FEE7'),
  DB('not-14', 'Sombra',      'notionists', 'Nia14',        'FEF9C3'),
  DB('not-15', 'Marco',       'notionists', 'Oz15',         'FEF2F2'),

  // ── Dibujo (croodles) ───────────────────────────────────────────────────
  DB('cro-1',  'Garabato',    'croodles',   'Doodle1',      'FEE2E2'),
  DB('cro-2',  'Bosquejo',    'croodles',   'Sketch2',      'DBEAFE'),
  DB('cro-3',  'Rayón',       'croodles',   'Scribble3',    'D1FAE5'),
  DB('cro-4',  'Manchón',     'croodles',   'Blob4',        'FEF3C7'),
  DB('cro-5',  'Monigote',    'croodles',   'Stick5',       'EDE9FE'),
  DB('cro-6',  'Figura',      'croodles',   'Figure6',      'FCE7F3'),
  DB('cro-7',  'Caricatura',  'croodles',   'Cartoon7',     'F0FDF4'),
  DB('cro-8',  'Trazado',     'croodles',   'Drawn8',       'FFF7ED'),
  DB('cro-9',  'Mascota',     'croodles',   'Mascot9',      'FDF4FF'),
  DB('cro-10', 'Duende',      'croodles',   'Sprite10',     'ECFDF5'),
  DB('cro-11', 'Fantas',      'croodles',   'Ghost11',      'FEFCE8'),
  DB('cro-12', 'Diablillo',   'croodles',   'Imp12',        'FDF2F8'),
  DB('cro-13', 'Hada',        'croodles',   'Fairy13',      'EFF6FF'),
  DB('cro-14', 'Criatura',    'croodles',   'Critter14',    'FFF1F2'),
  DB('cro-15', 'Espíritu',    'croodles',   'Spirit15',     'ECFEFF'),

  // ── Robot (bottts) ──────────────────────────────────────────────────────
  DB('bot-1',  'RoboX',       'bottts',     'Robot1',       'DBEAFE'),
  DB('bot-2',  'Androide',    'bottts',     'Android2',     'D1FAE5'),
  DB('bot-3',  'Meka',        'bottts',     'Meka3',        'FEF3C7'),
  DB('bot-4',  'Cyborg',      'bottts',     'Cyborg4',      'FCE7F3'),
  DB('bot-5',  'Dron',        'bottts',     'Drone5',       'EDE9FE'),
  DB('bot-6',  'Unidad',      'bottts',     'Unit6',        'FEE2E2'),
  DB('bot-7',  'Nexo',        'bottts',     'Nexus7',       'F0FDF4'),
  DB('bot-8',  'Bóveda',      'bottts',     'Vault8',       'FFF7ED'),
  DB('bot-9',  'Ómega',       'bottts',     'Omega9',       'FDF4FF'),
  DB('bot-10', 'Pulsar',      'bottts',     'Pulsar10',     'ECFDF5'),
  DB('bot-11', 'Circuito',    'bottts',     'Circuit11',    'FEFCE8'),
  DB('bot-12', 'Núcleo',      'bottts',     'Core12',       'FDF2F8'),
  DB('bot-13', 'Señal',       'bottts',     'Signal13',     'EFF6FF'),
  DB('bot-14', 'Protocolo',   'bottts',     'Proto14',      'FFF1F2'),
  DB('bot-15', 'Sintético',   'bottts',     'Synth15',      'ECFEFF'),

  // ── Cara (micah) ────────────────────────────────────────────────────────
  DB('mic-1',  'Cara',        'micah',      'FaceA',        'FEE2E2'),
  DB('mic-2',  'Rostro',      'micah',      'FaceB',        'DBEAFE'),
  DB('mic-3',  'Visaje',      'micah',      'FaceC',        'D1FAE5'),
  DB('mic-4',  'Semblante',   'micah',      'FaceD',        'FEF3C7'),
  DB('mic-5',  'Expresión',   'micah',      'FaceE',        'EDE9FE'),
  DB('mic-6',  'Perfil',      'micah',      'FaceF',        'FCE7F3'),
  DB('mic-7',  'Efigie',      'micah',      'FaceG',        'F0FDF4'),
  DB('mic-8',  'Retrato',     'micah',      'FaceH',        'FFF7ED'),
  DB('mic-9',  'Imagen',      'micah',      'FaceI',        'FDF4FF'),
  DB('mic-10', 'Sombra',      'micah',      'FaceJ',        'ECFDF5'),
  DB('mic-11', 'Mirada',      'micah',      'FaceK',        'FEFCE8'),
  DB('mic-12', 'Gesto',       'micah',      'FaceL',        'FDF2F8'),
  DB('mic-13', 'Emoción',     'micah',      'FaceM',        'EFF6FF'),
  DB('mic-14', 'Faz',         'micah',      'FaceN',        'FFF1F2'),
  DB('mic-15', 'Ánimo',       'micah',      'FaceO',        'ECFEFF'),

  // ── Personas (personas) ─────────────────────────────────────────────────
  DB('per-1',  'Persona',     'personas',   'PersonA',      'DBEAFE'),
  DB('per-2',  'Individuo',   'personas',   'PersonB',      'FCE7F3'),
  DB('per-3',  'Sujeto',      'personas',   'PersonC',      'D1FAE5'),
  DB('per-4',  'Tipo',        'personas',   'PersonD',      'FEF3C7'),
  DB('per-5',  'Personaje',   'personas',   'PersonE',      'EDE9FE'),
  DB('per-6',  'Ícono',       'personas',   'PersonF',      'FEE2E2'),
  DB('per-7',  'Figura',      'personas',   'PersonG',      'F0FDF4'),
  DB('per-8',  'Modelo',      'personas',   'PersonH',      'FFF7ED'),
  DB('per-9',  'Avatar',      'personas',   'PersonI',      'FDF4FF'),
  DB('per-10', 'Entidad',     'personas',   'PersonJ',      'ECFDF5'),
  DB('per-11', 'Ser',         'personas',   'PersonK',      'FEFCE8'),
  DB('per-12', 'Alma',        'personas',   'PersonL',      'FDF2F8'),
  DB('per-13', 'Mente',       'personas',   'PersonM',      'EFF6FF'),
  DB('per-14', 'Espíritu',    'personas',   'PersonN',      'FFF1F2'),
  DB('per-15', 'Esencia',     'personas',   'PersonO',      'ECFEFF'),

  // ── Gente (open-peeps) ──────────────────────────────────────────────────
  DB('ope-1',  'Amigo',       'open-peeps', 'PeepA',        'FEE2E2'),
  DB('ope-2',  'Compañero',   'open-peeps', 'PeepB',        'DBEAFE'),
  DB('ope-3',  'Vecino',      'open-peeps', 'PeepC',        'D1FAE5'),
  DB('ope-4',  'Colega',      'open-peeps', 'PeepD',        'FEF3C7'),
  DB('ope-5',  'Conocido',    'open-peeps', 'PeepE',        'EDE9FE'),
  DB('ope-6',  'Socio',       'open-peeps', 'PeepF',        'FCE7F3'),
  DB('ope-7',  'Aliado',      'open-peeps', 'PeepG',        'F0FDF4'),
  DB('ope-8',  'Camarada',    'open-peeps', 'PeepH',        'FFF7ED'),
  DB('ope-9',  'Seguidor',    'open-peeps', 'PeepI',        'FDF4FF'),
  DB('ope-10', 'Miembro',     'open-peeps', 'PeepJ',        'ECFDF5'),
  DB('ope-11', 'Comunidad',   'open-peeps', 'PeepK',        'FEFCE8'),
  DB('ope-12', 'Ciudadano',   'open-peeps', 'PeepL',        'FDF2F8'),
  DB('ope-13', 'Habitante',   'open-peeps', 'PeepM',        'EFF6FF'),
  DB('ope-14', 'Nativo',      'open-peeps', 'PeepN',        'FFF1F2'),
  DB('ope-15', 'Residente',   'open-peeps', 'PeepO',        'ECFEFF'),
]

/** Grouped for category tabs in the avatar picker */
export const AVATAR_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: 'Aventurero', ids: ['adv-1','adv-2','adv-3','adv-4','adv-5','adv-6','adv-7','adv-8','adv-9','adv-10','adv-11','adv-12','adv-13','adv-14','adv-15'] },
  { label: 'Elegante',   ids: ['lor-1','lor-2','lor-3','lor-4','lor-5','lor-6','lor-7','lor-8','lor-9','lor-10','lor-11','lor-12','lor-13','lor-14','lor-15'] },
  { label: 'Pixel',      ids: ['pix-1','pix-2','pix-3','pix-4','pix-5','pix-6','pix-7','pix-8','pix-9','pix-10','pix-11','pix-12','pix-13','pix-14','pix-15'] },
  { label: 'Minimal',    ids: ['not-1','not-2','not-3','not-4','not-5','not-6','not-7','not-8','not-9','not-10','not-11','not-12','not-13','not-14','not-15'] },
  { label: 'Dibujo',     ids: ['cro-1','cro-2','cro-3','cro-4','cro-5','cro-6','cro-7','cro-8','cro-9','cro-10','cro-11','cro-12','cro-13','cro-14','cro-15'] },
  { label: 'Robot',      ids: ['bot-1','bot-2','bot-3','bot-4','bot-5','bot-6','bot-7','bot-8','bot-9','bot-10','bot-11','bot-12','bot-13','bot-14','bot-15'] },
  { label: 'Cara',       ids: ['mic-1','mic-2','mic-3','mic-4','mic-5','mic-6','mic-7','mic-8','mic-9','mic-10','mic-11','mic-12','mic-13','mic-14','mic-15'] },
  { label: 'Personas',   ids: ['per-1','per-2','per-3','per-4','per-5','per-6','per-7','per-8','per-9','per-10','per-11','per-12','per-13','per-14','per-15'] },
  { label: 'Gente',      ids: ['ope-1','ope-2','ope-3','ope-4','ope-5','ope-6','ope-7','ope-8','ope-9','ope-10','ope-11','ope-12','ope-13','ope-14','ope-15'] },
]

/** Build a DiceBear image URL */
export function dicebearUrl(option: AvatarOption, sizePx = 128): string {
  if (option.type !== 'dicebear') return ''
  const params = new URLSearchParams({
    seed: option.seed || option.id,
    backgroundColor: option.backgroundColor || 'DBEAFE',
    size: String(sizePx),
  })
  return `https://api.dicebear.com/9.x/${option.style}/svg?${params.toString()}`
}

/** Returns the default DiceBear avatar for a new user seeded from their name */
export function getDefaultAvatar(name: string): AvatarOption {
  return DB('adv-default', 'Mi Avatar', 'adventurer', name || 'Bizen', 'DBEAFE')
}
