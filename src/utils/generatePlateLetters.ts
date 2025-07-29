import { alphabet, inappropriateWords } from '@/constants/regplate'

export const generateRandomLetters = (number: number) => {
  let attempts = 0
  const maxAttempts = 100

  while (attempts < maxAttempts) {
    const randomLetters = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
      ''
    )

    const isInappropriate = inappropriateWords.some(
      word => randomLetters.includes(word) || word.includes(randomLetters)
    )

    const endsWithO = randomLetters.endsWith('O')

    if (!isInappropriate && !endsWithO && number > 0) {
      return randomLetters
    }

    attempts++
  }

  return 'ABC'
}
