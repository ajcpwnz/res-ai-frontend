import { Button } from '@/components/ui/button'
import { __nextChapterSummary, __story } from 'features/survey/state.ts'
import { useAtom } from 'jotai'
import { useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { http } from 'utils/http.ts'


export const StoryViewer = () => {
  const outer = useRef<HTMLDivElement>(null);

  const [story, setStory] = useAtom(__story)
  const [summary, setSummary] = useAtom(__nextChapterSummary)

  const [thinking, setIsThinking] = useState(false);

  const handleNextChapter = async () => {
    setIsThinking(true);
    try {
      const response = await http.post(`/stories/generate`, {summaryId: summary });
      if (response.data.result) {
        try {
          if(outer.current) {
            outer.current.scrollTop = 0;
          }
        } catch (e) {};

        setStory(response.data.result)
      }

      if(response.data.summaryId) {
        setSummary(response.data.summaryId);
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsThinking(false);
    }
  }

  return <div className={`w-[420px] aspect-2/3 bg-gray-100 rounded-xl p-4 flex flex-col justify-start items-start overflow-auto`} ref={outer}>
    <article className="prose">
      <Markdown>{story}</Markdown>
    </article>
    <div className="my-4 flex w-full space-x-2">
      {/*<Button className="flex-grow" variant="outline" onClick={() => setStory('')}>export</Button>*/}
      <Button className="flex-grow" variant="outline" onClick={() => setStory('')}>start over</Button>
      {
        summary
          ? <Button className="flex-grow" onClick={handleNextChapter} loading={thinking}>next chapter</Button>
          : null
      }
    </div>
  </div>
}
