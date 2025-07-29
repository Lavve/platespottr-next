import type { IUser } from '@/types/user'
import { generateSlug } from '@/utils/generateSlug'

export const defaultUser: IUser = {
  name: 'Cson',
  plates: [
    Date.now(),
    Date.now() - 1000 * 60 * 60 * 24 * 1,
    Date.now() - 1000 * 60 * 60 * 24 * 2,
    Date.now() - 1000 * 60 * 60 * 24 * 3,
    Date.now() - 1000 * 60 * 60 * 24 * 6,
    Date.now() - 1000 * 60 * 60 * 24 * 14,
    Date.now() - 1000 * 60 * 60 * 24 * 22,
    Date.now() - 1000 * 60 * 60 * 24 * 36,
  ],
  slug: generateSlug(),
  requesting: false,
}
