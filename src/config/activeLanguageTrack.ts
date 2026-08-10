export interface LanguageTrack {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  active: boolean;
  status: string;
}

export const CURRENT_TRACK_ID = 'german-a1-ar';

export const AVAILABLE_TRACKS: LanguageTrack[] = [
  {
    id: 'german-a1-ar',
    name: 'German A1 (Arabic Speaker Track)',
    nativeName: 'الألمانية للمتحدثين بالعربية',
    flag: '🇩🇪',
    active: true,
    status: 'COMPLETE'
  },
  {
    id: 'spanish-a1-en',
    name: 'Spanish A1 (English Track)',
    nativeName: 'Español para Principiantes',
    flag: '🇪🇸',
    active: false,
    status: 'PLANNED'
  },
  {
    id: 'french-a1-en',
    name: 'French A1 (English Track)',
    nativeName: 'Français Débutant',
    flag: '🇫🇷',
    active: false,
    status: 'PLANNED'
  }
];
