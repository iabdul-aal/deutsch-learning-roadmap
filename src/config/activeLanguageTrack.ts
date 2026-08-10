export interface LanguageTrack {
  id: string;
  name: string;
  nativeName: string;
  level: 'A1' | 'A2' | 'B1';
  active: boolean;
  status: 'COMPLETE' | 'ACTIVE_ROADMAP' | 'PLANNED';
}

export const CURRENT_TRACK_ID = 'german-a1-ar';

export const AVAILABLE_TRACKS: LanguageTrack[] = [
  {
    id: 'german-a1-ar',
    name: 'German A1 (Start Deutsch 1 & FAU DaF)',
    nativeName: 'المرجع الشامل لالمانية A1',
    level: 'A1',
    active: true,
    status: 'COMPLETE'
  },
  {
    id: 'german-a2-ar',
    name: 'German A2 (Goethe A2 & Intermediate DaF)',
    nativeName: 'خارطة طريق الالمانية A2 المتكاملة',
    level: 'A2',
    active: true,
    status: 'ACTIVE_ROADMAP'
  },
  {
    id: 'german-b1-ar',
    name: 'German B1 (Zertifikat B1 & University Prep)',
    nativeName: 'مسار الالمانية B1 الأكاديمي والمهني',
    level: 'B1',
    active: true,
    status: 'ACTIVE_ROADMAP'
  }
];
