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
