// Type definitions for the memorial website

export type NoteStatus = "pending" | "approved" | "rejected";

export interface Note {
  id: string;
  name: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  status: NoteStatus;
}

export interface NoteInput {
  name: string;
  message: string;
  imageUrl?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  tags?: string[];
  createdAt?: string;
}

export interface GalleryImageInput {
  title: string;
  description?: string;
  imageUrl: string;
  tags?: string[];
}

export interface ContactPerson {
  id: string;
  name: string;
  relation: string;
  phone?: string;
  email?: string;
}

export interface ResumeData {
  content: string;
  lastUpdated: string;
}

export interface AchievementsData {
  content: string;
  lastUpdated: string;
}
