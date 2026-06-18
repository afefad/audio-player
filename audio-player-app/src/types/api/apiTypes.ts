export type User = {
  username: string
  password: string
}

export type RegisterResponse = {
  message: string
  user: {
    username: string
    password: string
  }
}

export type LoginResponse = {
  message: string
  token: string
}

export type MessageResponse = {
  message: string
}
