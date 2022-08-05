import * as express from "express";
import { verifyToken } from "./helper/jwt";
import { User } from "@entity/user";
import { E_ErrorType } from "./errorHandler/enums";



export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  try {
    if (securityName === "api_key") {
      const headerToken = request.headers['access_token']
      let token: string = ""
      if (request.headers && headerToken) {
        token = String(headerToken)
      }
      if (!token) throw "No token provided"
      const decoded: any = await verifyToken(token)
      if (decoded instanceof Error) throw decoded.message
      const user = await User.findOne({
        where: { id: decoded.id },
        relations: ['role', 'role.scopes']
      });
      if (!user) {
        throw E_ErrorType.E_USER_NOT_FOUND
      }
      const userScopes: any = user.role.scopes;
      const userScopeKeys = Object.keys(userScopes)
        .filter(key => !['id', 'created_at', 'updated_at'].includes(key) && userScopes[key] === true)
        .map(scope => (scope.replace(/_/g, ":")))

      const isScopeValid = scopes?.every(scope => userScopeKeys.includes(scope))
      if (!isScopeValid) throw E_ErrorType.E_USER_IS_NOT_AUTHORIZED
      return new Promise((resolve, reject) => {
        resolve(decoded)
      })
    }
  } catch (error: any) {
    return new Promise((resolve, reject) => {
      reject(new Error(error))
    })
  }
}




