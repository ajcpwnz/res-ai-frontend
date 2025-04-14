import { atom } from 'jotai'


export const __isThinkingAboutStory = atom(false);

export const __nextChapterSummary = atom<string | null>(null);

export const __story = atom<string | null>(null);
