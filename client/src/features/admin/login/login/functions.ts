export const checkPassword = (password: string, confirmPassword: string): string => {
  return password !== confirmPassword ? 'Mật khẩu phải trùng nhau' : ''
}

export const hashPassword = async (password: string): Promise<string> => {
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  else {
    const baseChars = "abcdef0123456789"
    let hash = ""
    let seed = 0

    for (let i = 0; i < password.length; i++)
      seed += password.charCodeAt(i) * (i + 1)

    for (let i = 0; i < 64; i++) {
      const charIndex = (seed + i * 17) % baseChars.length
      hash += baseChars[charIndex]
      seed = (seed * 31 + charIndex) % 100000 // Update seed for variation
    }

    return hash
  }
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

  const password = formData.get('password') as string
  const hashedPassword = await hashPassword(password)

  const res = await fetch(isRegistering ? '/register' : '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...Object.fromEntries(formData), password: hashedPassword }),
  })

  const resJson = await res.json()

  if (res.status === 200 && resJson.msg === 'success') {
    setNotice(`Sign ${isRegistering ? 'up' : 'in'} successful!`)
    if (!isRegistering) {
      setTimeout(() => {
        navigate('/admin'); 
      }, 1500); // Điều hướng đến trang admin
    } else {
      setIsRegistering(false);
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