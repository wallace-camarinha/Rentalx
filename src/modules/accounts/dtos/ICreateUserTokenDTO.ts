interface ICreateUserTokenDTO {
  userId: string;
  expiresIn: Date;
  refreshToken: string;
}

export { ICreateUserTokenDTO };
