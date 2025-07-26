import { wordList1, wordList2, wordList3 } from '@/constants/slugs'

export const generateSlug = () => {
  const word1 = wordList1[Math.floor(Math.random() * wordList1.length)].toUpperCase()
  const word2 = wordList2[Math.floor(Math.random() * wordList2.length)].toUpperCase()
  const word3 = wordList3[Math.floor(Math.random() * wordList3.length)].toUpperCase()
  return `${word1}-${word2}-${word3}`
}
