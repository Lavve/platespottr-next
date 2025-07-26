import type { IUser } from '@/types/user'
import { generateSlug } from '@/utils/generateSlug'

export const defaultUser: IUser = {
  name: 'Cson',
  plates: [
    Date.now(),
    Date.now() - 1000 * 60 * 60 * 24,
    Date.now() - 1000 * 60 * 60 * 24 * 2,
    Date.now() - 1000 * 60 * 60 * 24 * 3,
    Date.now() - 1000 * 60 * 60 * 24 * 4,
    Date.now() - 1000 * 60 * 60 * 24 * 5,
    Date.now() - 1000 * 60 * 60 * 24 * 7,
  ],
  slug: generateSlug(),
  requesting: false,
}
