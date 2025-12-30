export enum BookSet {
  CANH_DIEU = 'Cánh Diều',
  KET_NOI = 'Kết nối tri thức với cuộc sống',
  CHAN_TRO = 'Chân trời sáng tạo'
}

export enum Grade {
  LOP_1 = 'Lớp 1',
  LOP_2 = 'Lớp 2',
  LOP_3 = 'Lớp 3',
  LOP_4 = 'Lớp 4',
  LOP_5 = 'Lớp 5'
}

export interface LessonFormData {
  bookSet: BookSet;
  grade: Grade;
  subject: string;
  lessonName: string;
  periods: number;
  image: File | null;
}

export interface GenerationState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}
