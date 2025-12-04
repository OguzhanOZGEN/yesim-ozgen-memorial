import {
  Note,
  NoteInput,
  GalleryImage,
  GalleryImageInput,
  ContactPerson,
  ResumeData,
  AchievementsData,
} from "@/types";

// Helper to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// LocalStorage keys
const STORAGE_KEYS = {
  NOTES: "memorial_notes",
  GALLERY: "memorial_gallery",
  CONTACTS: "memorial_contacts",
  RESUME: "memorial_resume",
  ACHIEVEMENTS: "memorial_achievements",
  HERO: "memorial_hero",
};

// Initial mock data
const initialNotes: Note[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    message:
      "Yeşim Öğretmen, hayatıma dokunan nadir insanlardan biriydi. Bu fotoğraf okul gezimizden. Onun sayesinde matematiği sevdim. Nur içinde yatsın.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpARGpqjdCe5_xkcyRsyhdVzCLSSc3ti2Jgh6pkbX7eLrGUkzIcS48bVIgEJ19_z8mzGNw97sRpCAwI0oTSs2Q3NkZzFOQOz8QMtxEE6cZCeK5cKxgtwy3w-024zUbdndZTCI27mKrD9qnB3ve9bfzeJWfnYLunN5tf4iJ31DZJcl71Cxalc56-t1e47MLWY-OQbwy8zAPpgJAsnJYBv-XWSSS0JKKWAocn2ciMxiVvh0c-dUNhAd_A_iI2RTRE-7aqpwIVj3UGGY",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
  {
    id: "2",
    name: "Zeynep Kaya",
    message:
      "Her zaman güler yüzü ve bitmek bilmeyen enerjisiyle hatırlayacağım. Mekanı cennet olsun.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
  {
    id: "3",
    name: "Mehmet Öztürk",
    message:
      "İyi ki yollarımız kesişmiş. Öğrencilerine sadece ders değil, hayatı da öğreten bir insandı.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
  {
    id: "4",
    name: "Zeynep S.",
    message:
      "Hayatıma dokunan en özel insanlardan biriydiniz. Öğrettiklerinizle yolumu aydınlatmaya devam edeceksiniz. Nur içinde yatın.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSVh95LeJom_kfjgWAWkInMC9lpYtw1vZnu4uyH5PHVYHS4bf4G-CLQ0ATYzySZ0IjMiZrxNj1uMxH3tMlLSgR9mnnoCZ928SFWHxgmT7FnW8qBUPt4MDwmM0l5KHS917Sf2Kk2W0SDAcAgdQYdF-gvSwgDbvo4Fl2LXMqhaLjbb06riATnG-DJuy10F2O3tj1D9Ix0c-QUNBuTaED-Nz9eSCpMHtNVHtH30GwEJR01zitjhp8orsbwZnwHmB7nF4QRjdAkbWqM2A",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "5",
    name: "Elif Kaya",
    message:
      "Enerjiniz, güler yüzünüz ve bize kattıklarınız için minnettarız. Kalbimizde her zaman özel bir yeriniz olacak.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAU46zCQh4Pw5-1me2q1D24Fey3_0r4rjtyv4y12I0xM8wOIacjNQa_87FagvtfglDpU-j60GJbnnw4emTugdCZRwkDTIv6NNlLeMS4HnsMQSRVB81qEcGyLOlrq1Ca5ki9vCcSVqUFHZYP4mYeSU_fUc_xzCkuIu0QRDpjpV6Y3fBfcQ9n11JAf4EJhsRqvB-Fo_ovABeVltjxQlFI5Qetw3qvfJB9DQNfp15koi0V3R2qi_x0Iq52dmIeXXkI4HGEi-jUukiK2MY",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
];

const initialGallery: GalleryImage[] = [
  {
    id: "g1",
    title: "Sınıfta Gülümserken",
    description: "Yeşim Öğretmen sınıfta öğrencileriyle",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHmN-A_TNj8KEHVUXDiAVq3fgC_I0XA1f6EkjjG5UYEZkIDyf5tdNBLrhCHjDaslPed63iU-T-LZK3aJXVh4M16M3fEg2tOMcdqKqBBTu9nFEPimDIkrF28kHJWPPqG9USiyYvIttHeAT857xweiwzNpKgI8Eg2hEirU0wynKTucKtdMS6RvOVHOQftm7JeS8P1D9ZNvPtcITfvKEruQIuOrQc6HL1t_8IRYdnmkGu06XnwKeQF1VMJxzGDsjxj_K0DgIdT_Sl2TY",
  },
  {
    id: "g2",
    title: "Öğrencilerle Birlikte",
    description: "Okul gezisinden bir kare",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpARGpqjdCe5_xkcyRsyhdVzCLSSc3ti2Jgh6pkbX7eLrGUkzIcS48bVIgEJ19_z8mzGNw97sRpCAwI0oTSs2Q3NkZzFOQOz8QMtxEE6cZCeK5cKxgtwy3w-024zUbdndZTCI27mKrD9qnB3ve9bfzeJWfnYLunN5tf4iJ31DZJcl71Cxalc56-t1e47MLWY-OQbwy8zAPpgJAsnJYBv-XWSSS0JKKWAocn2ciMxiVvh0c-dUNhAd_A_iI2RTRE-7aqpwIVj3UGGY",
  },
  {
    id: "g3",
    title: "Boş Sınıf",
    description: "Yeşim Öğretmenin sınıfı",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeWRe-ZzFydXjwVe-wwqwH5euxYfI9qt40u_dXbObm_2aWvcZADlv5zt3Tmy18l56QECN-JU2fcFHZ8Fijl6S7KeE-r3LXcMNNGJIc-MP_pzZbjq74s-fftKaCQR0bqHtdcEX_gD6WEmoK7luwmxID5VSmf3CgdlyjKoCE3pjQy65jz0786hzitQlv-BPROoWkCd-3B_8IFEoyLVSm64as6mRSKbfKp8XJ4MksxfvWJ28_0F0OSkuJY64ClGnCNx2PGz43knNzE4o",
  },
  {
    id: "g4",
    title: "Doğal Bir An",
    description: "Günlük yaşamdan bir kare",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVMU9BU9uh3gPKkbYEh_CADuVYju1i_b6xDuiWl95fii3vP7CUYzAO5KeYTSJA9Gmm4SzyS6GPgz7CavhD0l6_xkl2KGF-ZY2GKBGOUuC1CxtstlzmL1DEqH_5LVzdBbgUuXYP_D3wBrEM37B5AxobXLtLqQmmcgbdPySYH6WobezROy998Jpnn1_qjMnJQQi4l2gSkfX5qCEXhYQoWyFXGU7oYKi6jZ92gqq_sjGqfEzJRtnhxKFjpDIDXTQvYIZxqeoLBU-TjQ8",
  },
  {
    id: "g5",
    title: "Mezuniyet Töreni",
    description: "2018 mezuniyet töreninden",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1Yof7DhJs9wJlm6d00oIZza_EiQZ2PGfhV1McNB70oQYN_Se9SWZn8KxZyOyvmxkpgOVZTAWUQcraJlq2TQdY-hGYxp5e4A_EyimEpv68QLoWoHQ-p8orvxK9_XltZQAfh27J4avp1f3cKce2Jy6XP2y2p87Aiv79n-5UytFMqORIN9_zhk-55yiaIPCcS1RR7lsHEhl75OEEfC7AXKmtRVCT7DddjkQtNsf9S3c-Ue6VCuW0NCTmleC8b0xvv2-Ge35Vh_exHeY",
  },
  {
    id: "g6",
    title: "Okul Gezisi",
    description: "Öğrencilerle gezi",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhcAp-V4FSr9AN-NuWv8ee5K-LQ6Yq601yK7auGlvIZO82wt3F7ADNuuEYrPMq7h1vFlom3aLsDAtE6CQ9v84MUpnKLLznD3PxwPaZV911TGZA_M5-bekF2KoK1cSBfnw3odrLsehIpuDEv2vxcdpptNp57_5eKJ_UPB1i1A6-9KNqjOmyHkf3TV0kbLYQ-bTlJXm9mVsEAnqvKrwwJ1Akic6Gx9KmuRwMMTL-tpd_FWX-Jb8mldNCj9nIPi3pGIYCZuMj_Gju49U",
  },
  {
    id: "g7",
    title: "Öğretmenler Günü Yemeği",
    description: "Meslektaşlarla kutlama",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZcJQClsOh2MNZtVJmyn1ij1Zb2v90iC_QnPVPKrZICfO27lKtrS1cAfMZGbXOl73kYDrFqYUJzpI31haHx6SgpICsRK2-KJV06urfAjURY0QyZlg-Mb-WKLhPSj69Z0b1sFgWFHoIK8A74735ujptHSlmuxQyg71zEFgiJeARqjTcDC0dFeW71w80yjBi-Cn10rCqAqN5ZPa_LhYtyKQw6T5qcbRgO97BXJv411vMmm58D5Dy7De_7c1LW9QhJcef140V4LK5aTs",
  },
  {
    id: "g8",
    title: "Kitaplar",
    description: "Yeşim Öğretmenin masasından",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOOqlQbR1YMLOPuKDg8vr2kk3xFOVsK88UbYUb2biw4OO0_xWDe2v_LK2s9xPn14LtYbFdjZDzBeT6MIjcRFkYfMcJX1d-u4JGxD6tGKQ4etLI0OpDAvj8a8L5nMQaSKlRYk50obXlfC34sXIbWO2JjCeeKF8B-TL2e0E_AvqvOQ96TIwZhcnTsbBdvQQgRjQlwbh-ukk7KVW-wbm4GzX0ufgqysC6Q8zCpTWOZaD788J9l9iBRu60RXkbu7eL2LYp9P9Da63-1Bk",
  },
];

const initialContacts: ContactPerson[] = [
  {
    id: "c1",
    name: "Ayşe Özgen",
    relation: "Annesi",
    phone: "+90 532 123 4567",
    email: "ayse.ozgen@email.com",
  },
  {
    id: "c2",
    name: "Mehmet Özgen",
    relation: "Babası",
    phone: "+90 533 234 5678",
    email: "mehmet.ozgen@email.com",
  },
  {
    id: "c3",
    name: "Fatma Özgen",
    relation: "Kız kardeşi",
    phone: "+90 534 345 6789",
    email: "fatma.ozgen@email.com",
  },
];

const initialResume: ResumeData = {
  content: `Yeşim Özgen, 1985 yılında İstanbul'da doğdu. Eğitim hayatına büyük bir tutkuyla bağlı olan Yeşim, Marmara Üniversitesi Eğitim Fakültesi'nden onur derecesiyle mezun oldu. Öğretmenlik kariyerine başladığı ilk günden itibaren öğrencilerine sadece bilgi aktarmakla kalmadı, aynı zamanda onlara ilham veren, yol gösteren bir rehber oldu.

Meslek hayatı boyunca yüzlerce öğrencinin hayatına dokundu. Derslerini her zaman yenilikçi ve ilgi çekici yöntemlerle işler, her bir öğrencisinin potansiyelini en üst seviyeye çıkarmak için çabalardı. Onun için öğretmenlik, bir meslekten çok bir yaşam biçimiydi.

Yeşim, sadece bir eğitimci değil, aynı zamanda yardımsever ve duyarlı bir insandı. Toplumsal projelere aktif olarak katılır, ihtiyaç sahibi çocuklar için düzenlenen kampanyalarda gönüllü olarak çalışırdı. Enerjisi, güler yüzü ve bitmek bilmeyen umuduyla çevresindeki herkese ışık saçardı.

Kısa yaşamına sayısız başarı ve iyilik sığdıran sevgili öğretmenimiz Yeşim Özgen'i her zaman sevgi, saygı ve minnetle anacağız.`,
  lastUpdated: new Date().toISOString(),
};

const initialAchievements: AchievementsData = {
  content: `**Eğitim Başarıları:**
- Marmara Üniversitesi Eğitim Fakültesi - Onur derecesiyle mezuniyet (2007)
- Yılın Öğretmeni Ödülü - İstanbul İl Milli Eğitim Müdürlüğü (2015)
- En İyi Yenilikçi Eğitim Projesi - Ulusal Eğitim Konferansı (2018)

**Mesleki Gelişim:**
- 500+ saat mesleki gelişim eğitimi
- Eğitimde teknoloji entegrasyonu sertifikası
- Özel eğitim yetkinlik belgesi

**Toplumsal Katkılar:**
- "Her Çocuk Okusun" kampanyası gönüllüsü (2010-2023)
- Köy okullarına kitap bağışı projesi kurucusu
- Dezavantajlı öğrenciler için ücretsiz ders programı organizatörü

**Yayınlar ve Projeler:**
- "Matematiği Sevdiren Yöntemler" - Eğitim dergisi makalesi (2016)
- İnteraktif öğrenme materyalleri geliştirme projesi
- Okul-aile işbirliği programı koordinatörlüğü`,
  lastUpdated: new Date().toISOString(),
};

interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const initialHero: HeroContent = {
  title: "Yeşim Özgen",
  subtitle: "Hayatı, dokunduğu kalpler ve geride bıraktığı ilham verici mirası hakkında kısa, içten bir giriş. O, sadece bir öğretmen değil, aynı zamanda bir yol göstericiydi.",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHL-8F5iqKvCZbU-AfhuInnxnW8MUVhDyx2jU34NxXy7j0u6_wdNNn_xn_Cqq4RH36mJ6bBT5pS9wuzaTd2NTkDBkWz7cQ0ZZGGHWjRBk9bjKYekTTreEKpCaOPYE8iVysXR9OooIU89yyQLzdQcjME5ACn8ERit0mkZQdzeu85kEIlWItlra7Yf9wDOdm1RJBAeHDs9g67NsM5-T-MJoGBCc2D9JJ5PyrIPCnN9fsI8SMr1pNYF5ig-rD2BiwiwWSQkU2PrE6pyc",
};

// Helper function to get data from localStorage or return initial data
function getData<T>(key: string, initial: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
  }
  return initial;
}

// Helper function to save data to localStorage
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// ==================== NOTES API ====================

export function getApprovedNotes(): Note[] {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  return notes
    .filter((note) => note.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getPendingNotes(): Note[] {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  return notes
    .filter((note) => note.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getAllNotes(): Note[] {
  return getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
}

export function submitNote(input: NoteInput): Note {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  const newNote: Note = {
    id: generateId(),
    name: input.name,
    message: input.message,
    imageUrl: input.imageUrl,
    createdAt: formatDate(new Date()),
    status: "pending",
  };
  notes.push(newNote);
  saveData(STORAGE_KEYS.NOTES, notes);

  // Send admin notification
  sendAdminNotification(newNote);

  return newNote;
}

export function approveNote(id: string): Note | null {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) return null;

  notes[noteIndex].status = "approved";
  saveData(STORAGE_KEYS.NOTES, notes);
  return notes[noteIndex];
}

export function rejectNote(id: string): boolean {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) return false;

  notes[noteIndex].status = "rejected";
  saveData(STORAGE_KEYS.NOTES, notes);
  return true;
}

export function deleteNote(id: string): boolean {
  const notes = getData<Note[]>(STORAGE_KEYS.NOTES, initialNotes);
  const filteredNotes = notes.filter((n) => n.id !== id);
  if (filteredNotes.length === notes.length) return false;

  saveData(STORAGE_KEYS.NOTES, filteredNotes);
  return true;
}

export function updateNotes(notes: Note[]): void {
  saveData(STORAGE_KEYS.NOTES, notes);
}

// ==================== GALLERY API ====================

export function getGalleryImages(): GalleryImage[] {
  return getData<GalleryImage[]>(STORAGE_KEYS.GALLERY, initialGallery);
}

export function addGalleryImage(input: GalleryImageInput): GalleryImage {
  const images = getData<GalleryImage[]>(STORAGE_KEYS.GALLERY, initialGallery);
  const newImage: GalleryImage = {
    id: generateId(),
    ...input,
    createdAt: formatDate(new Date()),
  };
  images.push(newImage);
  saveData(STORAGE_KEYS.GALLERY, images);
  return newImage;
}

export function updateGalleryImage(
  id: string,
  input: Partial<GalleryImageInput>
): GalleryImage | null {
  const images = getData<GalleryImage[]>(STORAGE_KEYS.GALLERY, initialGallery);
  const imageIndex = images.findIndex((img) => img.id === id);
  if (imageIndex === -1) return null;

  images[imageIndex] = { ...images[imageIndex], ...input };
  saveData(STORAGE_KEYS.GALLERY, images);
  return images[imageIndex];
}

export function deleteGalleryImage(id: string): boolean {
  const images = getData<GalleryImage[]>(STORAGE_KEYS.GALLERY, initialGallery);
  const filteredImages = images.filter((img) => img.id !== id);
  if (filteredImages.length === images.length) return false;

  saveData(STORAGE_KEYS.GALLERY, filteredImages);
  return true;
}

export function updateGalleryImages(images: GalleryImage[]): void {
  saveData(STORAGE_KEYS.GALLERY, images);
}

// ==================== CONTACTS API ====================

export function getContactPeople(): ContactPerson[] {
  return getData<ContactPerson[]>(STORAGE_KEYS.CONTACTS, initialContacts);
}

export function updateContactPeople(contacts: ContactPerson[]): void {
  saveData(STORAGE_KEYS.CONTACTS, contacts);
}

export function addContactPerson(
  contact: Omit<ContactPerson, "id">
): ContactPerson {
  const contacts = getData<ContactPerson[]>(
    STORAGE_KEYS.CONTACTS,
    initialContacts
  );
  const newContact: ContactPerson = {
    id: generateId(),
    ...contact,
  };
  contacts.push(newContact);
  saveData(STORAGE_KEYS.CONTACTS, contacts);
  return newContact;
}

export function updateContactPerson(
  id: string,
  updates: Partial<Omit<ContactPerson, "id">>
): ContactPerson | null {
  const contacts = getData<ContactPerson[]>(
    STORAGE_KEYS.CONTACTS,
    initialContacts
  );
  const contactIndex = contacts.findIndex((c) => c.id === id);
  if (contactIndex === -1) return null;

  contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
  saveData(STORAGE_KEYS.CONTACTS, contacts);
  return contacts[contactIndex];
}

export function deleteContactPerson(id: string): boolean {
  const contacts = getData<ContactPerson[]>(
    STORAGE_KEYS.CONTACTS,
    initialContacts
  );
  const filteredContacts = contacts.filter((c) => c.id !== id);
  if (filteredContacts.length === contacts.length) return false;

  saveData(STORAGE_KEYS.CONTACTS, filteredContacts);
  return true;
}

// ==================== RESUME API ====================

export function getResume(): ResumeData {
  return getData<ResumeData>(STORAGE_KEYS.RESUME, initialResume);
}

export function updateResume(content: string): ResumeData {
  const resume: ResumeData = {
    content,
    lastUpdated: formatDate(new Date()),
  };
  saveData(STORAGE_KEYS.RESUME, resume);
  return resume;
}

// ==================== ACHIEVEMENTS API ====================

export function getAchievements(): AchievementsData {
  return getData<AchievementsData>(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
}

export function updateAchievements(content: string): AchievementsData {
  const achievements: AchievementsData = {
    content,
    lastUpdated: formatDate(new Date()),
  };
  saveData(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  return achievements;
}

// ==================== HERO API ====================

export function getHeroContent(): HeroContent {
  return getData<HeroContent>(STORAGE_KEYS.HERO, initialHero);
}

export function updateHeroContent(content: Partial<HeroContent>): HeroContent {
  const current = getData<HeroContent>(STORAGE_KEYS.HERO, initialHero);
  const updated = { ...current, ...content };
  saveData(STORAGE_KEYS.HERO, updated);
  return updated;
}

// ==================== NOTIFICATION STUB ====================

export function sendAdminNotification(note: Note): void {
  // Stub function - in real implementation, this would send an email or push notification
  console.log("📧 Admin Notification: New note submitted");
  console.log("   From:", note.name);
  console.log("   Message:", note.message.substring(0, 100) + "...");
  console.log("   Has Image:", !!note.imageUrl);
  console.log("   Submitted at:", note.createdAt);
  console.log("   Status: Pending approval");
}

// ==================== UTILITY: RESET DATA ====================

export function resetAllData(): void {
  saveData(STORAGE_KEYS.NOTES, initialNotes);
  saveData(STORAGE_KEYS.GALLERY, initialGallery);
  saveData(STORAGE_KEYS.CONTACTS, initialContacts);
  saveData(STORAGE_KEYS.RESUME, initialResume);
  saveData(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
}
