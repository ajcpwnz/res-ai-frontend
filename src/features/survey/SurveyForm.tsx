import { Button } from 'components/ui/button.tsx'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select.tsx'
import { __selectedPrompt } from 'features/app/state.ts'
import { Token } from 'features/promptBuilder/state.ts'
import { __isThinkingAboutStory, __nextChapterSummary, __story } from 'features/survey/state.ts'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { LoaderPinwheel } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { http } from 'utils/http.ts'

function renderPreview(template: string, fields: Record<string, string>) {
  const regex = /(\{[^{}]+\})/g
  const parts = template.split(regex)
  return parts.map((part, index) => {
    if (regex.test(part)) {
      const tokenName = part.slice(1, -1).trim()
      const filled = fields[tokenName]
      if (filled) {
        return (
          <span key={index} className="bg-green-100 text-green-900 px-1 mx rounded">
            {filled}
          </span>
        )
      }
      return (
        <span key={index} className="bg-blue-100 text-blue-800 px-1 mx-1 rounded">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export const SurveyForm = () => {
  const [thinking, setThinking] = useAtom(__isThinkingAboutStory);
  const selectedPrompt = useAtomValue(__selectedPrompt)
  const setStory = useSetAtom(__story)
  const setSummary = useSetAtom(__nextChapterSummary);


  const [totalChapters, setTotalChapters] = useState<string>('2')
  const [done, setDone] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentField, setCurrentField] = useState<Token | null>(null)
  const [currentFieldValue, setCurrentFieldValue] = useState<string>('')
  const [fields, setFields] = useState<Record<string, string>>({})

  useEffect(() => {
    if (selectedPrompt) {
      setCurrentField(selectedPrompt.tokens[currentIndex])
      setCurrentFieldValue(fields[selectedPrompt.tokens[currentIndex]?.name] || '')
    }
  }, [selectedPrompt, currentIndex, fields]);

  const updateField = useCallback((value: string) => {
    setCurrentFieldValue(value)
  }, [])

  const handleNext = () => {
    if (!currentField) return
    setFields(old => ({
      ...old,
      [currentField.name]: currentFieldValue
    }))
    if (selectedPrompt?.tokens[currentIndex + 1]) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setDone(true)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setFields(old => ({
        ...old,
        [currentField!.name]: currentFieldValue
      }))
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleGenerate = async (gpt: 'openai' | 'claude') => {
    if (!selectedPrompt) return
    setThinking(true);

    const payload = {
      promptId: selectedPrompt.id,
      template: selectedPrompt.template,
      fields,
      gpt,
      chapter: 1,
      totalChapters: Number(totalChapters),
    }

    try {
      const response = await http.post(`/stories/generate`, payload)
      if (response.data.result) {
        setStory(response.data.result)
      }

      if(response.data.summaryId) {
        setSummary(response.data.summaryId);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setThinking(false)
    }
  }

  const renderPlaceholder = () => {
    return <p className="font-extrabold text-xl text-center">Run a prompt from the right panel to get started</p>
  }

  const renderForm = () => {
    if (thinking) {
      return (
        <div className="flex w-full h-full items-center justify-center flex-col">
          <p className="font-extrabold text-xl text-center mb-10">Working on it</p>
          <div className="animate-pulse">
            <LoaderPinwheel className="size-10 animate-spin" />
          </div>
        </div>
      )
    }
    return currentField ? (
      <div className="flex flex-col w-full space-y-4">
        <div className="flex w-full justify-between items-center">
          <p className="font-extrabold text-xl text-center flex-grow">{selectedPrompt?.label}</p>
          <Select
            value={totalChapters}
            onValueChange={(value) =>
              setTotalChapters(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder=""/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">short story</SelectItem>
              <SelectItem value="2">2 chapters</SelectItem>
              <SelectItem value="3">3 chapters</SelectItem>
              <SelectItem value="4">4 chapters</SelectItem>
              <SelectItem value="5">5 chapters</SelectItem>
              <SelectItem value="6">6 chapters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {done
          ? null
          : <p className="text-center text-sm">
              Field {currentIndex + 1} of {selectedPrompt?.tokens.length}
            </p>
        }
        <div className="flex flex-col w-full space-y-4">
          {done ? (
            <p>Ready to generate</p>
          ) : (
            <div className="flex flex-col w-full space-y-2">
              <Label htmlFor={currentField.name} className="flex flex-col items-start">
                <span>{currentField?.label}</span>
                {currentField?.helpLabel ? (
                  <span className="text-sm text-gray-500">{currentField?.helpLabel}</span>
                ) : null}
              </Label>
              <Input
                id={currentField.name}
                key={currentField.name}
                type={currentField.type}
                value={currentFieldValue}
                // @ts-ignore
                onChange={e => updateField(e.target.value)}
              />
              <div className="flex w-full justify-between">
                <Button variant="outline" disabled={currentIndex === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="default" disabled={!currentFieldValue.length} onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}
          <div className="bg-white p-4 rounded flex flex-col space-y-2">
            <p>{selectedPrompt && renderPreview(selectedPrompt.template, fields)}</p>
          </div>
          {done ? (
            <div className="flex flex-col w-full space-y-2">
              <Button variant="default" onClick={() => handleGenerate('openai')}>
                generate w/ openai
              </Button>
              <Button variant="default" onClick={() => handleGenerate('claude')}>
                generate w/ claude
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    ) : null
  }

  return (
    <div
      className={`w-[420px] aspect-2/3 bg-gray-100 rounded-xl p-4 flex flex-col border-4 border-blue-700 ${
        selectedPrompt ? 'justify-start items-start' : 'justify-center items-center'
      }`}
    >
      {selectedPrompt ? renderForm() : renderPlaceholder()}
    </div>
  )
}
