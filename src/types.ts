export interface Project {
  id: string;
  name: string;
  tagline: string;
  prompt: string;
  features: string[];
  previewType: 'habit' | 'recipe' | 'focus' | 'finance';
  swiftCode: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  project?: Project;
}