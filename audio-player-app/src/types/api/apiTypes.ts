type User = {
  username: string
  password: string
}

type RegisterResponse = {
  message: string
  user: {
    username: string
    password: string
  }
}

type LoginResponse = {
  message: string
  token: string
}

type MessageResponse = {
  message: string
}

export type {
  User,
  RegisterResponse,
  LoginResponse,
  MessageResponse
}