import { __allPrompts, Prompt, PromptId } from 'features/promptBuilder/state.ts'
import { atom } from 'jotai'

export const __selectedPromptId = atom<PromptId | undefined>(undefined);

export const __selectedPrompt = atom<Prompt | null>((get) => {
  const allPrompts = get(__allPrompts);
  const selectedId = get(__selectedPromptId);


  console.warn('asdasd', selectedId ? allPrompts[selectedId] || null : null)
  return selectedId ? allPrompts[selectedId] || null : null
});
