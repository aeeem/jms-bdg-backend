
export enum RoleLists{
  SuperAdmin = 'Super Administrator',
  Admin = 'Administrator',
  Kasir = 'Kasir',
  Pegawai = 'Pegawai'
}

export interface CreateEmployeeRequest {
  name: string
  email?: string
  noInduk: string
  birth_date?: Date
  phone_number: string
  role_id: number
}

export interface ChangeEmployeeRole {
  role_id: number
}
