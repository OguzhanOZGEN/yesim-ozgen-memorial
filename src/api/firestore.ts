import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Note,
  NoteInput,
  GalleryImage,
  GalleryImageInput,
  ContactPerson,
  ResumeData,
  AchievementsData,
} from '@/types';

// Collection names
const COLLECTIONS = {
  NOTES: 'notes',
  GALLERY: 'gallery',
  CONTACTS: 'contacts',
  SETTINGS: 'settings',
};

// Helper to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: Timestamp | string): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// ==================== NOTES API ====================

export async function getApprovedNotes(): Promise<Note[]> {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const q = query(
    notesRef,
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToISO(doc.data().createdAt),
  })) as Note[];
}

export async function getPendingNotes(): Promise<Note[]> {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const q = query(
    notesRef,
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToISO(doc.data().createdAt),
  })) as Note[];
}

export async function getAllNotes(): Promise<Note[]> {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const q = query(notesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToISO(doc.data().createdAt),
  })) as Note[];
}

export async function submitNote(input: NoteInput): Promise<Note> {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const newNote = {
    name: input.name,
    message: input.message,
    imageUrl: input.imageUrl || null,
    createdAt: Timestamp.now(),
    status: 'pending',
  };
  const docRef = await addDoc(notesRef, newNote);
  return {
    id: docRef.id,
    ...newNote,
    createdAt: newNote.createdAt.toDate().toISOString(),
  } as Note;
}

export async function approveNote(id: string): Promise<Note | null> {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await updateDoc(noteRef, { status: 'approved' });
  const updated = await getDoc(noteRef);
  if (!updated.exists()) return null;
  return {
    id: updated.id,
    ...updated.data(),
    createdAt: timestampToISO(updated.data().createdAt),
  } as Note;
}

export async function rejectNote(id: string): Promise<boolean> {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await updateDoc(noteRef, { status: 'rejected' });
  return true;
}

export async function deleteNote(id: string): Promise<boolean> {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await deleteDoc(noteRef);
  return true;
}

export async function updateNotes(notes: Note[]): Promise<void> {
  const batch = writeBatch(db);
  notes.forEach((note, index) => {
    const noteRef = doc(db, COLLECTIONS.NOTES, note.id);
    batch.update(noteRef, { order: index });
  });
  await batch.commit();
}

// ==================== GALLERY API ====================

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const galleryRef = collection(db, COLLECTIONS.GALLERY);
  const q = query(galleryRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      imageUrl: data.imageUrl,
      order: data.order ?? index,
    } as GalleryImage;
  });
}

export async function addGalleryImage(input: GalleryImageInput): Promise<GalleryImage> {
  const galleryRef = collection(db, COLLECTIONS.GALLERY);
  // Get current count for order
  const snapshot = await getDocs(galleryRef);
  const order = snapshot.size;
  
  const newImage = {
    title: input.title,
    description: input.description || null,
    imageUrl: input.imageUrl,
    createdAt: Timestamp.now(),
    order,
  };
  const docRef = await addDoc(galleryRef, newImage);
  return {
    id: docRef.id,
    ...newImage,
    createdAt: newImage.createdAt.toDate().toISOString(),
  } as GalleryImage;
}

export async function updateGalleryImage(
  id: string,
  input: Partial<GalleryImageInput>
): Promise<GalleryImage | null> {
  const imageRef = doc(db, COLLECTIONS.GALLERY, id);
  await updateDoc(imageRef, input);
  const updated = await getDoc(imageRef);
  if (!updated.exists()) return null;
  return {
    id: updated.id,
    ...updated.data(),
  } as GalleryImage;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const imageRef = doc(db, COLLECTIONS.GALLERY, id);
  await deleteDoc(imageRef);
  return true;
}

export async function updateGalleryImages(images: GalleryImage[]): Promise<void> {
  const batch = writeBatch(db);
  images.forEach((image, index) => {
    const imageRef = doc(db, COLLECTIONS.GALLERY, image.id);
    batch.update(imageRef, { order: index });
  });
  await batch.commit();
}

// ==================== CONTACTS API ====================

export async function getContactPeople(): Promise<ContactPerson[]> {
  const contactsRef = collection(db, COLLECTIONS.CONTACTS);
  const q = query(contactsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      relation: data.relation,
      phone: data.phone,
      email: data.email,
      order: data.order ?? index,
    } as ContactPerson;
  });
}

export async function updateContactPeople(contacts: ContactPerson[]): Promise<void> {
  const batch = writeBatch(db);
  contacts.forEach((contact, index) => {
    const contactRef = doc(db, COLLECTIONS.CONTACTS, contact.id);
    batch.update(contactRef, { order: index });
  });
  await batch.commit();
}

export async function addContactPerson(
  contact: Omit<ContactPerson, 'id'>
): Promise<ContactPerson> {
  const contactsRef = collection(db, COLLECTIONS.CONTACTS);
  const snapshot = await getDocs(contactsRef);
  const order = snapshot.size;
  
  const newContact = {
    ...contact,
    order,
  };
  const docRef = await addDoc(contactsRef, newContact);
  return {
    id: docRef.id,
    ...newContact,
  } as ContactPerson;
}

export async function updateContactPerson(
  id: string,
  updates: Partial<Omit<ContactPerson, 'id'>>
): Promise<ContactPerson | null> {
  const contactRef = doc(db, COLLECTIONS.CONTACTS, id);
  await updateDoc(contactRef, updates);
  const updated = await getDoc(contactRef);
  if (!updated.exists()) return null;
  return {
    id: updated.id,
    ...updated.data(),
  } as ContactPerson;
}

export async function deleteContactPerson(id: string): Promise<boolean> {
  const contactRef = doc(db, COLLECTIONS.CONTACTS, id);
  await deleteDoc(contactRef);
  return true;
}

// ==================== RESUME API ====================

export async function getResume(): Promise<ResumeData> {
  const resumeRef = doc(db, COLLECTIONS.SETTINGS, 'resume');
  const snapshot = await getDoc(resumeRef);
  
  if (!snapshot.exists()) {
    // Return default
    return {
      content: '',
      lastUpdated: new Date().toISOString(),
    };
  }
  
  return {
    content: snapshot.data().content || '',
    lastUpdated: timestampToISO(snapshot.data().lastUpdated || Timestamp.now()),
  };
}

export async function updateResume(content: string): Promise<ResumeData> {
  const resumeRef = doc(db, COLLECTIONS.SETTINGS, 'resume');
  const data = {
    content,
    lastUpdated: Timestamp.now(),
  };
  await setDoc(resumeRef, data);
  return {
    content,
    lastUpdated: data.lastUpdated.toDate().toISOString(),
  };
}

// ==================== ACHIEVEMENTS API ====================

export async function getAchievements(): Promise<AchievementsData> {
  const achievementsRef = doc(db, COLLECTIONS.SETTINGS, 'achievements');
  const snapshot = await getDoc(achievementsRef);
  
  if (!snapshot.exists()) {
    return {
      content: '',
      lastUpdated: new Date().toISOString(),
    };
  }
  
  return {
    content: snapshot.data().content || '',
    lastUpdated: timestampToISO(snapshot.data().lastUpdated || Timestamp.now()),
  };
}

export async function updateAchievements(content: string): Promise<AchievementsData> {
  const achievementsRef = doc(db, COLLECTIONS.SETTINGS, 'achievements');
  const data = {
    content,
    lastUpdated: Timestamp.now(),
  };
  await setDoc(achievementsRef, data);
  return {
    content,
    lastUpdated: data.lastUpdated.toDate().toISOString(),
  };
}

// ==================== HERO API ====================

interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export async function getHeroContent(): Promise<HeroContent> {
  const heroRef = doc(db, COLLECTIONS.SETTINGS, 'hero');
  const snapshot = await getDoc(heroRef);
  
  if (!snapshot.exists()) {
    return {
      title: 'Yeşim Özgen',
      subtitle: 'Hayatı, dokunduğu kalpler ve geride bıraktığı ilham verici mirası hakkında kısa, içten bir giriş.',
      imageUrl: '',
    };
  }
  
  return snapshot.data() as HeroContent;
}

export async function updateHeroContent(content: Partial<HeroContent>): Promise<HeroContent> {
  const heroRef = doc(db, COLLECTIONS.SETTINGS, 'hero');
  const current = await getHeroContent();
  const updated = { ...current, ...content };
  await setDoc(heroRef, updated);
  return updated;
}

// ==================== SEED INITIAL DATA ====================

export async function seedInitialData(): Promise<void> {
  // Check if data already exists
  const notesSnapshot = await getDocs(collection(db, COLLECTIONS.NOTES));
  if (notesSnapshot.size > 0) {
    console.log('Data already exists, skipping seed');
    return;
  }

  console.log('Seeding initial data...');

  // Seed hero
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'hero'), {
    title: 'Yeşim Özgen',
    subtitle: 'Hayatı, dokunduğu kalpler ve geride bıraktığı ilham verici mirası hakkında kısa, içten bir giriş. O, sadece bir öğretmen değil, aynı zamanda bir yol göstericiydi.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHL-8F5iqKvCZbU-AfhuInnxnW8MUVhDyx2jU34NxXy7j0u6_wdNNn_xn_Cqq4RH36mJ6bBT5pS9wuzaTd2NTkDBkWz7cQ0ZZGGHWjRBk9bjKYekTTreEKpCaOPYE8iVysXR9OooIU89yyQLzdQcjME5ACn8ERit0mkZQdzeu85kEIlWItlra7Yf9wDOdm1RJBAeHDs9g67NsM5-T-MJoGBCc2D9JJ5PyrIPCnN9fsI8SMr1pNYF5ig-rD2BiwiwWSQkU2PrE6pyc',
  });

  // Seed resume
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'resume'), {
    content: `Yeşim Özgen, 1985 yılında İstanbul'da doğdu. Eğitim hayatına büyük bir tutkuyla bağlı olan Yeşim, Marmara Üniversitesi Eğitim Fakültesi'nden onur derecesiyle mezun oldu.

Meslek hayatı boyunca yüzlerce öğrencinin hayatına dokundu. Derslerini her zaman yenilikçi ve ilgi çekici yöntemlerle işler, her bir öğrencisinin potansiyelini en üst seviyeye çıkarmak için çabalardı.

Yeşim, sadece bir eğitimci değil, aynı zamanda yardımsever ve duyarlı bir insandı. Toplumsal projelere aktif olarak katılır, ihtiyaç sahibi çocuklar için düzenlenen kampanyalarda gönüllü olarak çalışırdı.`,
    lastUpdated: Timestamp.now(),
  });

  // Seed achievements
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'achievements'), {
    content: `**Eğitim Başarıları:**
- Marmara Üniversitesi Eğitim Fakültesi - Onur derecesiyle mezuniyet (2007)
- Yılın Öğretmeni Ödülü - İstanbul İl Milli Eğitim Müdürlüğü (2015)

**Mesleki Gelişim:**
- 500+ saat mesleki gelişim eğitimi
- Eğitimde teknoloji entegrasyonu sertifikası

**Toplumsal Katkılar:**
- "Her Çocuk Okusun" kampanyası gönüllüsü
- Köy okullarına kitap bağışı projesi kurucusu`,
    lastUpdated: Timestamp.now(),
  });

  // Seed notes
  const initialNotes = [
    {
      name: 'Ahmet Yılmaz',
      message: 'Yeşim Öğretmen, hayatıma dokunan nadir insanlardan biriydi. Bu fotoğraf okul gezimizden. Onun sayesinde matematiği sevdim. Nur içinde yatsın.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpARGpqjdCe5_xkcyRsyhdVzCLSSc3ti2Jgh6pkbX7eLrGUkzIcS48bVIgEJ19_z8mzGNw97sRpCAwI0oTSs2Q3NkZzFOQOz8QMtxEE6cZCeK5cKxgtwy3w-024zUbdndZTCI27mKrD9qnB3ve9bfzeJWfnYLunN5tf4iJ31DZJcl71Cxalc56-t1e47MLWY-OQbwy8zAPpgJAsnJYBv-XWSSS0JKKWAocn2ciMxiVvh0c-dUNhAd_A_iI2RTRE-7aqpwIVj3UGGY',
      createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      status: 'approved',
    },
    {
      name: 'Zeynep Kaya',
      message: 'Her zaman güler yüzü ve bitmek bilmeyen enerjisiyle hatırlayacağım. Mekanı cennet olsun.',
      imageUrl: null,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
      status: 'approved',
    },
    {
      name: 'Mehmet Öztürk',
      message: 'İyi ki yollarımız kesişmiş. Öğrencilerine sadece ders değil, hayatı da öğreten bir insandı.',
      imageUrl: null,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      status: 'approved',
    },
  ];

  for (const note of initialNotes) {
    await addDoc(collection(db, COLLECTIONS.NOTES), note);
  }

  // Seed gallery
  const initialGallery = [
    { title: 'Sınıfta Gülümserken', description: 'Yeşim Öğretmen sınıfta öğrencileriyle', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHmN-A_TNj8KEHVUXDiAVq3fgC_I0XA1f6EkjjG5UYEZkIDyf5tdNBLrhCHjDaslPed63iU-T-LZK3aJXVh4M16M3fEg2tOMcdqKqBBTu9nFEPimDIkrF28kHJWPPqG9USiyYvIttHeAT857xweiwzNpKgI8Eg2hEirU0wynKTucKtdMS6RvOVHOQftm7JeS8P1D9ZNvPtcITfvKEruQIuOrQc6HL1t_8IRYdnmkGu06XnwKeQF1VMJxzGDsjxj_K0DgIdT_Sl2TY', order: 0 },
    { title: 'Öğrencilerle Birlikte', description: 'Okul gezisinden bir kare', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpARGpqjdCe5_xkcyRsyhdVzCLSSc3ti2Jgh6pkbX7eLrGUkzIcS48bVIgEJ19_z8mzGNw97sRpCAwI0oTSs2Q3NkZzFOQOz8QMtxEE6cZCeK5cKxgtwy3w-024zUbdndZTCI27mKrD9qnB3ve9bfzeJWfnYLunN5tf4iJ31DZJcl71Cxalc56-t1e47MLWY-OQbwy8zAPpgJAsnJYBv-XWSSS0JKKWAocn2ciMxiVvh0c-dUNhAd_A_iI2RTRE-7aqpwIVj3UGGY', order: 1 },
    { title: 'Boş Sınıf', description: 'Yeşim Öğretmenin sınıfı', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWRe-ZzFydXjwVe-wwqwH5euxYfI9qt40u_dXbObm_2aWvcZADlv5zt3Tmy18l56QECN-JU2fcFHZ8Fijl6S7KeE-r3LXcMNNGJIc-MP_pzZbjq74s-fftKaCQR0bqHtdcEX_gD6WEmoK7luwmxID5VSmf3CgdlyjKoCE3pjQy65jz0786hzitQlv-BPROoWkCd-3B_8IFEoyLVSm64as6mRSKbfKp8XJ4MksxfvWJ28_0F0OSkuJY64ClGnCNx2PGz43knNzE4o', order: 2 },
    { title: 'Doğal Bir An', description: 'Günlük yaşamdan bir kare', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVMU9BU9uh3gPKkbYEh_CADuVYju1i_b6xDuiWl95fii3vP7CUYzAO5KeYTSJA9Gmm4SzyS6GPgz7CavhD0l6_xkl2KGF-ZY2GKBGOUuC1CxtstlzmL1DEqH_5LVzdBbgUuXYP_D3wBrEM37B5AxobXLtLqQmmcgbdPySYH6WobezROy998Jpnn1_qjMnJQQi4l2gSkfX5qCEXhYQoWyFXGU7oYKi6jZ92gqq_sjGqfEzJRtnhxKFjpDIDXTQvYIZxqeoLBU-TjQ8', order: 3 },
  ];

  for (const image of initialGallery) {
    await addDoc(collection(db, COLLECTIONS.GALLERY), { ...image, createdAt: Timestamp.now() });
  }

  // Seed contacts
  const initialContacts = [
    { name: 'Ayşe Özgen', relation: 'Annesi', phone: '+90 532 123 4567', email: 'ayse.ozgen@email.com', order: 0 },
    { name: 'Mehmet Özgen', relation: 'Babası', phone: '+90 533 234 5678', email: 'mehmet.ozgen@email.com', order: 1 },
    { name: 'Fatma Özgen', relation: 'Kız kardeşi', phone: '+90 534 345 6789', email: 'fatma.ozgen@email.com', order: 2 },
  ];

  for (const contact of initialContacts) {
    await addDoc(collection(db, COLLECTIONS.CONTACTS), contact);
  }

  console.log('Initial data seeded successfully!');
}
