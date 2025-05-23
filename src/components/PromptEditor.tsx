import { useState, useCallback } from 'react'
import { Input } from 'components/ui/input.tsx'
import { Textarea } from 'components/ui/textarea.tsx'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'components/ui/select.tsx'
import type { Block, BlockToken } from 'features/promptBuilder/state.ts'

const extractTokens = (text: string): { name: string }[] => {
  const regex = /\{([^{}]+)\}/g
  const result: { name: string }[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const tokenName = match[1].trim()
    if (!result.some(t => t.name === tokenName)) {
      result.push({ name: tokenName })
    }
  }
  return result
}

interface BlockEditorProps {
  block: Block
  /**
   * Optional callback whenever the user edits the template or tokens.
   * You’ll receive the updated template string and the full tokens array.
   */
  onChange?: (template: string, tokens: BlockToken[]) => void
}

export const PromptEditor: React.FC<BlockEditorProps> = ({ block, onChange }) => {
  const [template, setTemplate] = useState(block.prompt)
  const [tokens, setTokens] = useState<BlockToken[]>([...block.tokens])

  const updateTokensFromTemplate = useCallback((newTpl: string) => {
    const names = extractTokens(newTpl).map(t => t.name)
    const newTokens: BlockToken[] = names.map(name => {
      const existing = tokens.find(t => t.name === name)
      return existing
        ? { ...existing }
        : {
          name,
          label: name,
          type: 'string',
          helpLabel: '',
        }
    });

    setTokens(newTokens)
    onChange?.(newTpl, newTokens)
  }, [tokens, onChange])

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTpl = e.currentTarget.value
    setTemplate(newTpl)
    updateTokensFromTemplate(newTpl)
  }

  const handleTokenField =
    <K extends keyof Omit<BlockToken, 'name'>>(field: K) =>
      (name: string, value: BlockToken[K]) => {
        const updated = tokens.map(t =>
          t.name === name ? { ...t, [field]: value } : t
        )
        setTokens(updated)
        onChange?.(template, updated)
      }

  const handleLabelChange = handleTokenField('label')
  const handleTypeChange = handleTokenField('type')
  const handleHelpLabelChange = handleTokenField('helpLabel')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{block.label}</h3>

      <Textarea
        value={template}
        onChange={handleTemplateChange}
        placeholder="Edit prompt…"
        className="w-full focus:bg-white max-h-64"
      />

      {tokens.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Tokens</h4>
          <div className="flex flex-wrap gap-4">
            {tokens.map(token => (
              <div
                key={token.name}
                className="border border-gray-300 bg-gray-50 p-3 rounded-md min-w-[240px] space-y-2"
              >
                <div className="text-sm font-medium text-gray-700">
                  {token.name}
                </div>

                <Input
                  label="Label"
                  value={token.label}
                  onChange={e => handleLabelChange(token.name, e.currentTarget.value)}
                  placeholder="Field label"
                />

                <Select
                  value={token.type}
                  onValueChange={v => handleTypeChange(token.name, v as TokenType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="select">select</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  label="Help text"
                  value={token.helpLabel}
                  onChange={e =>
                    handleHelpLabelChange(token.name, e.currentTarget.value)
                  }
                  placeholder="(optional)"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
