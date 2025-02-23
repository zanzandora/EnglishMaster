export const checkPassword = (password: string, confirmPassword: string): string => {
  return password !== confirmPassword ? 'Mật khẩu phải trùng nhau' : ''
}

export const submitForm = async (
  e: React.FormEvent<HTMLFormElement>,
  isRegistering: boolean,
  setNotice: React.Dispatch<React.SetStateAction<string>>,
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: string) => void
) => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)

  if (isRegistering && !formData.get('gender')) {
    return setNotice('Choose a gender')
  }

  const res = await fetch(isRegistering ? '/register' : '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...Object.fromEntries(formData) }),
  })

  const resJson = await res.json()

  if (res.status === 200 && resJson.msg === 'success') {
    setNotice(`Sign ${isRegistering ? 'up' : 'in'} successful!`)
    if (!isRegistering) {
      setTimeout(() => {
        navigate('/admin')
      }, 1500) // Điều hướng đến trang admin
    } else {
      setIsRegistering(false)
    }
  }
  else
    setNotice(resJson.msg)
}

export const blueTextBottom = (
  setNotice: React.Dispatch<React.SetStateAction<string>>,
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsRegistering((state) => !state)
  setNotice('')
}