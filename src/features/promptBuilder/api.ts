import { http } from '../../utils/http'

export const getAllPrompts = async () => {
  const { data } = await http.get('/prompts')

  return data
}
