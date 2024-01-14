export interface UpdateUserParameter {
  noInduk: string
  roles?: string[]
  name: string
  birthDate?: Date | string
  phoneNumber: string
}

export interface ChangePasswordParameter {
  newPassword: string
}
