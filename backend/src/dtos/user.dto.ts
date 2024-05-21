export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
}

export interface UserSessionDto {
  userId: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface TokenResponseDTO {
  id: string;
  email: string;
  token: string;
}

export interface LogoutResponseDTO {
  message: string;
}
