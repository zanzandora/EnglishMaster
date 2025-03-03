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
  const formDataObject = Object.fromEntries(formData);

  if (isRegistering && !formData.get('gender')) {
    return setNotice('Choose a gender')
  }
  console.log('Raw dateOfBirth:', formDataObject.dateOfBirth);
  if (isRegistering && formDataObject.dateOfBirth) {
    const dateOfBirth = formDataObject.dateOfBirth as string;
    const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
    console.log('Formatted dateOfBirth:', formattedDate)
    if (formattedDate === 'Invalid Date') {
      return setNotice('Invalid date format');
    }
    formDataObject.dateOfBirth = formattedDate;
  } 
  else if (isRegistering && !formDataObject.dateOfBirth) {
    return setNotice('Date of birth is required');
  }


const res = await fetch(isRegistering ? '/register' : '/login', {
  
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formDataObject),
});

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