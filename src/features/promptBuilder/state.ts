import { atom } from 'jotai'


export interface Token {
  name: string;
  label: string;
  helpLabel: string;
  type: 'string' | 'number' | 'select';
};

export type PromptId = string;

export interface Prompt {
  id: PromptId
  name?: string
  label?: string
  template: string;
  tokens: Token[];
}


export const __editedPromptId = atom<PromptId>('newPrompt');

export const defaultPrompt = {
  id: 'newPrompt',
  name: '',
  label: '',
  template: '',
  tokens: [],
}

export const __allPrompts = atom<Record<PromptId, Prompt>>({
  newPrompt: { ...defaultPrompt },
})

export const __editedPrompt = atom((get) => {
  const editedId = get(__editedPromptId);
  const allPrompts   = get(__allPrompts);

  return allPrompts[editedId];
});
