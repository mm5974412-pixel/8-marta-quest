export type Theme = 'pastel' | 'cats' | 'corporate' | 'meme-lite';
export type Mode = 'cute' | 'cute_meme';

export interface Postcard {
  id: string;
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
  message: string;
  compliments: string[];
  theme: Theme;
  mode: Mode;
  quiz_seed: number;
  secret_word?: string;
  view_count: number;
}

export interface QuestState {
  currentStep: number;
  task1_answer?: string;
  task2_answer?: string;
  task3_clicks: number;
}

export type TaskCorrectAnswer = 'spring' | 'joy' | 'clicked';
