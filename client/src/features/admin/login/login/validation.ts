export const showInvalidate = (e: React.FormEvent<HTMLInputElement>): void => {
  e.preventDefault()

  e.currentTarget.classList.remove('border-transparent')
  e.currentTarget.classList.add('border-red-500')
}

export const hideInvalidate = (e: React.FormEvent<HTMLInputElement>): void => {
  e.preventDefault()

  e.currentTarget.classList.remove('border-red-500')
  e.currentTarget.classList.add('border-transparent')
}