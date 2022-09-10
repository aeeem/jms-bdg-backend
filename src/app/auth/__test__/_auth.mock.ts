
export const LoginPayloadMock = {
  superAdmin: {
    noInduk : '123',
    password: '123123'
  },
  wrongNip: {
    noInduk : '991238567214',
    password: 'superadmin'
  },
  wrongPassword: {
    noInduk : '123',
    password: 'wrongpassword'
  },
  emptyNip: {
    noInduk : '',
    password: 'superadmin'
  },
  emptyPassword: {
    noInduk : '123',
    password: ''
  },
  emptyNipAndPassword: {
    noInduk : '',
    password: ''
  }
}
