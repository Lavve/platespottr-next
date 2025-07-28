import type { IUser } from '@/types/user'
import { generateSlug } from '@/utils/generateSlug'

const generateUniqueSlugs = (count: number): string[] => {
  const slugs: string[] = []
  const usedSlugs = new Set<string>()

  while (slugs.length < count) {
    const slug = generateSlug()
    if (!usedSlugs.has(slug)) {
      slugs.push(slug)
      usedSlugs.add(slug)
    }
  }

  return slugs
}

const friendSlugs = generateUniqueSlugs(5)

export const defaultFriends: IUser[] = [
  {
    name: 'John',
    plates: [Date.now(), Date.now() - 1000 * 60 * 60 * 24 * 5, Date.now() - 1000 * 60 * 60 * 24 * 22],
    requesting: true,
    slug: friendSlugs[0],
  },
  {
    name: 'Doris',
    plates: [Date.now() - 1000 * 60 * 60 * 24 * 4, Date.now() - 1000 * 60 * 60 * 24 * 22],
    requesting: true,
    slug: friendSlugs[1],
  },
  {
    name: 'Ylva',
    plates: [
      Date.now(),
      Date.now() - 1000 * 60 * 60 * 24 * 2,
      Date.now() - 1000 * 60 * 60 * 24 * 5,
      Date.now() - 1000 * 60 * 60 * 24 * 5,
    ],
    friendSince: Date.now() - 1000 * 60 * 60 * 24 * 24,
    slug: friendSlugs[2],
  },
  {
    name: 'Helmut',
    plates: [
      Date.now(),
      Date.now() - 1000 * 60 * 60 * 24,
      Date.now() - 1000 * 60 * 60 * 24 * 3,
      Date.now() - 1000 * 60 * 60 * 24 * 9,
      Date.now() - 1000 * 60 * 60 * 24 * 27,
      Date.now() - 1000 * 60 * 60 * 24 * 28,
      Date.now() - 1000 * 60 * 60 * 24 * 30,
      Date.now() - 1000 * 60 * 60 * 24 * 31,
      Date.now() - 1000 * 60 * 60 * 24 * 32,
      Date.now() - 1000 * 60 * 60 * 24 * 56,
    ],
    friendSince: Date.now() - 1000 * 60 * 60 * 24 * 677,
    slug: friendSlugs[3],
  },
  {
    name: 'Roland',
    plates: [Date.now() - 1000 * 60 * 60 * 24 * 2, Date.now() - 1000 * 60 * 60 * 24 * 3],
    friendSince: Date.now() - 1000 * 60 * 60 * 24 * 105,
    slug: friendSlugs[4],
  },
]
