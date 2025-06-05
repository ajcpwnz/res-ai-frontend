import { __authorizedUser } from 'features/auth/state.ts'
import { __selectedProperty } from 'features/flow/state.ts'
import { useSetAtom } from 'jotai'
import { getProfile, LoginPayload, loginUser as loginUserService, RegisterPayload, registerUser } from 'utils/api'
import { useNavigate } from 'react-router'

export const useLogin = () => {
  const setUser = useSetAtom(__authorizedUser)
  const setSelectedProperty = useSetAtom(__selectedProperty);

  const navigate = useNavigate()

  const loginUser = async (form: LoginPayload) => {
    const { token } = await loginUserService({
      email: form.email,
      password: form.password
    })

    localStorage.setItem('jwt_token', token)

    const user = await getProfile()

    setUser(user)

    navigate('/');
  }

  const logoutUser = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setSelectedProperty(null);
    navigate('/');
  }

  return { loginUser, logoutUser }
}


export const useSignup = () => {
  const { loginUser } = useLogin()

  const signupUser = async (form: RegisterPayload) => {
    await registerUser(form)

    await loginUser(form)
  }
  return { signupUser }
}
