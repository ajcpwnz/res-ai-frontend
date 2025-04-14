import { Button } from 'components/ui/button.tsx'
import {  __selectedPromptId } from 'features/app/state.ts'
import { useSetAtom } from 'jotai'
import { Play, Trash2, SquarePen } from 'lucide-react'
import { useCallback, useState } from 'react'
import { http } from 'utils/http.ts'
import { __allPrompts, __editedPromptId, Prompt, PromptId } from '../state'


function parseTemplate(template: string) {
  const regex = /(\{[^{}]+\})/g
  const parts = template.split(regex)
  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <span className="bg-blue-100 text-blue-800 px-1 mx-[1px] rounded" key={index}>
        {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}


export const PromptListItem = ({prompt}: {prompt: Prompt}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const setPrompts = useSetAtom(__allPrompts);
  const setPromptId = useSetAtom(__selectedPromptId);
  const setEditedPromptId = useSetAtom(__editedPromptId);


  const selectPrompt = useCallback((promptId: PromptId) => {
    setPromptId(promptId);
  }, [])

  const editPrompt  = useCallback((promptId: PromptId) => {
    setEditedPromptId(promptId);
  }, [])


  const deletePrompt = async (id: string) => {
    setIsDeleting(true)
    try {
      const result = await http.delete(`/prompts/${id}`);
      if(result.status === 200) {
        setPrompts(old => {
          const copy = {...old};
          delete copy[id];
          return copy;
        })
      }
    } catch(error) {
      console.error(error);
    } finally {
      setIsDeleting(false)
    }
  }
  return <li className="py-2 px-4 bg-white border rounded">
    <div className="flex items-center justify-between">
      <div className="flex-col flex-grow flex">
        <p className="font-bold">{prompt.label ?? prompt.name}</p>
        <p>{parseTemplate(prompt.template)}</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => selectPrompt(prompt.id)}><Play/> run</Button>
        <Button variant="outline" onClick={() => editPrompt(prompt.id)}><SquarePen/></Button>
        <Button variant="destructive" loading={isDeleting} onClick={() => deletePrompt(prompt.id)}><Trash2/></Button>
      </div>
    </div>
  </li>
}
