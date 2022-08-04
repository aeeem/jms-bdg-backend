import * as response from 'src/helper/response'
import { User } from "@entity/user";
import { ErrorHandler } from "src/errorHandler";
import { E_ErrorType } from "src/errorHandler/enums";
import { compareHash, createHashPassword } from "src/helper/bcrypt";
import { createToken } from "src/helper/jwt";
import { LoginRequestParameter, RegisterRequestParameter } from "./auth.interface";



export const loginService = async (payload: LoginRequestParameter) => {
  try {
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) throw E_ErrorType.E_LOGIN_WRONG_NIP;

    const isPasswordMatch = await compareHash(payload.password, user.password);
    if (!isPasswordMatch) throw E_ErrorType.E_LOGIN_WRONG_PASSWORD

    const api_token = createToken({ id: user.id, email: user.email, role: user.roles });

    return response.success({data:{ 
      token: api_token,
      id: user.id,
      noInduk: user.noInduk,
      name: user.name,
      role: user.roles
    }, stat_msg:"SUCCESS"});
    
  } catch (e) {
    console.log(e)
    throw new ErrorHandler(e)
  }
}

export const registerUserService = async (payload: RegisterRequestParameter) => {
  try {
    const user = await User.findOne({ where: { email: payload.email } });
    if (user) throw E_ErrorType.E_USER_EXISTS;

    const hashedPassword = await createHashPassword(payload.password)

    if(hashedPassword instanceof Error) throw hashedPassword.message

    const newUser     = new User()
    newUser.email     = payload.email;
    newUser.name      = payload.name;
    newUser.noInduk   = "undefined"; // TODO
    newUser.password  = hashedPassword

    await newUser.save();

    return newUser;
  } catch (e) {
    throw new ErrorHandler(e)
  }
}