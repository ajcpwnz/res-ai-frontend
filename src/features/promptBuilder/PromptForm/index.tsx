import { Button } from 'components/ui/button.tsx'
import { Textarea } from 'components/ui/textarea.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select.tsx'
import { Input } from 'components/ui/input.tsx'
import { __selectedPromptId } from 'features/app/state.ts'
import { __allPrompts, __editedPrompt, __editedPromptId, defaultPrompt, Prompt } from 'features/promptBuilder/state.ts'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { http } from 'utils/http'

const extractTokens = (text: string): { name: string }[] => {
  const regex = /\{([^{}]+)\}/g
  const result: { name: string }[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const tokenName = match[1].trim()
    if (!result.some(token => token.name === tokenName)) {
      result.push({ name: tokenName })
    }
  }
  return result
}

export const PromptForm = () => {
  const edited = useAtomValue(__editedPrompt);
  const setEditedPrompt = useSetAtom(__editedPromptId);

  const editedTokens = edited.tokens || [];

  const [isThinking, setIsThinking] = useState(false)

  const setPrompts = useSetAtom(__allPrompts)
  const setSelectedPromptId = useSetAtom(__selectedPromptId);

  const [suggestedPrompt, setSuggestedPrompt] = useState('')

  const changeField = useCallback((field: keyof Prompt, value: any) => {
    if(edited) {

      setPrompts(old => {
        const oldEdited = old[edited.id];

        return {
          ...old,
          [edited.id]: {
            ...oldEdited,
            [field]: value
          }
        }
      })
    }
  }, [edited, setPrompts])

  const updateTokens = (template: string) => {
    const computedTokens = extractTokens(template);

    changeField('tokens', computedTokens.map(token => {
      const existing = editedTokens.find(t => t.name === token.name);

      return {
        name: token.name,
        type: existing ? existing.type : 'string',
        label: existing ? existing.label : token.name,
        helpLabel: existing ? existing.helpLabel : ''
      }
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.currentTarget.value

    changeField('template', newPrompt);
    updateTokens(newPrompt);
  }

  const handleTokenTypeChange = (name: string, newType: 'string' | 'number' | 'select') => {
    changeField('tokens', editedTokens.map(t => (t.name === name ? { ...t, type: newType } : t)))
  }

  const handleLabelChange = (name: string, newLabel: string) => {
    changeField('tokens', editedTokens.map(t => (t.name === name ? { ...t, label: newLabel } : t)));
  }

  const handlehelpLabelChange = (name: string, newhelpLabel: string) => {
    changeField('tokens', editedTokens.map(t => (t.name === name ? { ...t, helpLabel: newhelpLabel } : t)));
  }

  const resetForm = () => {
    setPrompts(old => ({
      ...old,
      'newPrompt': {...defaultPrompt}
    }));

    setEditedPrompt('newPrompt')
  }

  const handleImprove = async () => {
    setIsThinking(true)

    try {
      const { data: {result: suggestedPrompt} } = await http.post('/prompts/improve', { template: edited.template })
      setSuggestedPrompt(suggestedPrompt);
    } catch (error) {
      console.error(error)
    } finally {
      setIsThinking(false)
    }
  }

  const handleSave = async () => {
    setIsThinking(true)

    const payload = edited;

    try {
      const { data: resultPrompt } = await http.post('/prompts', payload)

      setPrompts(list => ({
        ...list,
        [resultPrompt.id]: resultPrompt
      }))
    } catch (error) {
      console.error(error)
    } finally {
      resetForm()
      setIsThinking(false)
    }
  }

  const handleRun = () => {
    setSelectedPromptId(edited.id);
  }

  const applySuggestion = () => {
    if(!suggestedPrompt) return;

    changeField('template', suggestedPrompt);
    updateTokens(suggestedPrompt);

    setSuggestedPrompt('');
  }

  const renderSuggestion = ( )  => {
    if(!suggestedPrompt) return null;

    return <div className="flex flex-col w-full rounded bg-blue-50 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <h3 className="text-base font-semibold mb-2">Suggested prompt:</h3>
          <p>{suggestedPrompt}</p>
        </div>
        <Button variant="default" onClick={applySuggestion}>apply</Button>
      </div>
    </div>
  }

  const tokenizePrompt = async () => {
    setIsThinking(true)

    const payload = { template: edited.template }

    try {
      const { data: {result: {template}} } = await http.post('/prompts/tokenize', payload)
      changeField('template', template);
      updateTokens(template);

    } catch (error) {
      console.error(error)
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-white p-4 rounded flex flex-col space-y-2">
      <h2 className="text-lg font-semibold mb-2">{edited.id === 'newPrompt' ? 'New Prompt' : 'Edit Prompt'}</h2>
      <Input
        placeholder="Label"
        value={edited.label}
        onChange={e => changeField('label', e.currentTarget.value)}
      />
      <Textarea
        placeholder="Prompt text"
        className="w-full"
        onChange={handleChange}
        value={edited.template}
      />
      {renderSuggestion()}
      {editedTokens.length > 0 && (
        <div className="flex flex-col w-full">
          <h3 className="text-base font-semibold mb-2">Tokens (form fields)</h3>
          <div className="flex flex-wrap gap-2">
            {editedTokens.map(token => (
              <div
                key={token.name}
                className="flex flex-col border border-gray-300 bg-gray-50 p-2 rounded-md shadow-sm min-w-[250px] space-y-2"
              >
                <span className="font-bold text-gray-800 text-sm">{token.name}</span>
                <div className="flex items-center justify-between space-x-2">
                  <Input
                    value={token.label}
                    onChange={(e) => handleLabelChange(token.name, e.currentTarget.value)}
                    placeholder="Form label"
                  />
                  <Select
                    value={token.type}
                    onValueChange={(value) =>
                      handleTokenTypeChange(token.name, value as 'string' | 'number' | 'select')
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="select">select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1">
                  <Input
                    value={token.helpLabel}
                    onChange={(e) => handlehelpLabelChange(token.name, e.currentTarget.value)}
                    placeholder="Sub label (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-2">
          <Button variant="outline" disabled={!edited.template.length} loading={isThinking} onClick={tokenizePrompt}>
            tokenize
          </Button>
          <Button variant="outline" disabled={!edited.template.length} loading={isThinking} onClick={handleImprove}>
            improve
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={!edited.template.length} onClick={handleRun}>
            run
          </Button>
          <Button variant="default" disabled={!edited.template.length} loading={isThinking} onClick={handleSave}>
            save
          </Button>
        </div>
      </div>
    </div>
  )
}
