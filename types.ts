export interface Charm {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  shape: 'sphere' | 'cube' | 'heart' | 'star';
  description?: string;
  position?: [number, number, number];
}

export interface CartItem extends Charm {
  quantity: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum ViewState {
  INTRO = 'INTRO',
  BRACELET = 'BRACELET',
  BUILDER = 'BUILDER',
  QUIZ = 'QUIZ',
}