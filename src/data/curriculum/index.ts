// src/data/curriculum/index.ts
import { guitarCurriculum } from './guitar';
import { pianoCurriculum } from './piano';
import { drumCurriculum } from './drum';

export const curriculum = {
  gitar: guitarCurriculum,
  piyano: pianoCurriculum,
  bateri: drumCurriculum
} as const;

export type InstrumentType = keyof typeof curriculum;
