import { PromptBuilder } from 'features/promptBuilder/PromptBuilder'
import { __story } from 'features/survey/state.ts'
import {SurveyForm} from 'features/survey/SurveyForm.tsx'
import { useAtomValue } from 'jotai'
import { StoryViewer } from './features/survey/StoryViewer'

const App = () => {
  const story = useAtomValue(__story);

  return (
    <div className="grid w-screen h-screen grid-rows-1 grid-cols-[500px_1fr] gap-0">
      <div className="flex h-full items-center justify-center ">
        {story ? <StoryViewer /> : <SurveyForm />}
      </div>
      <div className="bg-gray-100 h-full flex items-center justify-center p-4">
        <PromptBuilder />
      </div>
    </div>
  )
}

export default App
