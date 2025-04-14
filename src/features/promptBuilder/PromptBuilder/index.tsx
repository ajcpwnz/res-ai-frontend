import { getAllPrompts } from 'features/promptBuilder/api.ts'
import { PromptListItem } from 'features/promptBuilder/PromptBuilder/PromptListItem.tsx'
import { PromptForm } from 'features/promptBuilder/PromptForm'
import { __allPrompts } from 'features/promptBuilder/state'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { keify } from 'utils/flow.ts'

export const PromptBuilder = () => {
  const [prompts, setPrompts] = useAtom(__allPrompts)
  const promptList = Object.keys(prompts).filter(id => id !== 'newPrompt')

  useEffect(() => {
    getAllPrompts().then((data) => {
      setPrompts(old => ({
        ...old,
        ...(keify(data) || {})
      }));
    })
  }, [setPrompts])

  return (
    <div className="h-full w-full flex flex-col">
      <PromptForm/>

      <div className="flex-1 overflow-y-auto mt-6">
        <h2 className="text-lg font-semibold mb-2">Saved Prompts</h2>
        {promptList.length === 0 ? (
          <p className="text-gray-500">No prompts yet...</p>
        ) : (
          <ul className="space-y-2">
            {promptList.map((promptId) => {
              const prompt = prompts[promptId]
              if (prompt) {
                return (
                  <PromptListItem prompt={prompt} key={prompt.id}/>
                )
              }
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
