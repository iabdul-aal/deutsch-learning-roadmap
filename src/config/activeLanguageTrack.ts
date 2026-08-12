export interface LanguageTrack {
  id: string;
  name: string;
  shortName: string;
  nativeName: string;
  level: 'A1' | 'A2' | 'B1';
  active: boolean;
  status: 'COMPLETE' | 'ACTIVE_ROADMAP' | 'PLANNED';
}

export const CURRENT_TRACK_ID = 'german-a1-ar';

export const AVAILABLE_TRACKS: LanguageTrack[] = [
  {
    id: 'german-a1-ar',
    name: 'German A1 (Start Deutsch 1 and Academic DaF)',
    shortName: 'German A1 (Goethe and University)',
    nativeName: 'المرجع الشامل لالمانية A1',
    level: 'A1',
    active: true,
    status: 'COMPLETE'
  },
  {
    id: 'german-a2-ar',
    name: 'German A2 (Goethe A2 and Intermediate DaF)',
    shortName: 'German A2 (Goethe A2)',
    nativeName: 'خارطة طريق الالمانية A2 المتكاملة',
    level: 'A2',
    active: true,
    status: 'ACTIVE_ROADMAP'
  },
  {
    id: 'german-b1-ar',
    name: 'German B1 (Zertifikat B1 and University Prep)',
    shortName: 'German B1 (Goethe B1)',
    nativeName: 'مسار الالمانية B1 الأكاديمي والمهني',
    level: 'B1',
    active: true,
    status: 'ACTIVE_ROADMAP'
  }
];
