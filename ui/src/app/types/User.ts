interface User {
  id?: number | undefined,
  username?: string | undefined,
  user_type?: number | undefined,
  verified?: boolean | undefined,
  verification_method?: number | undefined,
  verification_value?: string | undefined,
  lesson_current?: number | undefined,
  lesson_current_progress?: number | undefined,
  monster_hash?: string | undefined,
  auth_key?: string | undefined
}

export { User };
