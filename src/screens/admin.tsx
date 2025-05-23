import { TemplateList } from "@/features/promptBuilder/TemplateList"
import { BlockList } from 'features/promptBuilder/BlockList.tsx'
import { TemplateForm } from 'features/promptBuilder/TemplateForm/TemplateForm.tsx'

export const AdminPage = () => {

  return <div className="flex justify-center">
    <div className="w-full max-w-[1400px] h-screen grid grid-rows-1 grid-cols-[300px_1fr_300px] gap-0">
      <TemplateList />
      <TemplateForm />
     <div></div> {/*<BlockList />*/}
    </div>
  </div>
}
