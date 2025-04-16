export interface Post {
  content: string;
  likes: number;
  docId: string;
  user: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  } | null;
  date: number;
  id?: string;
  reply?: Post[];
  [key: string]: any;
}