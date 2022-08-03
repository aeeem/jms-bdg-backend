import * as express from "express";
import { verifyToken } from "./helper/jwt";
import jwt from 'jsonwebtoken'

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
    if (securityName === "api_key") {
      let token:string;
      if (request.query && request.query.access_token) {
        token = String(request.query.access_token);
      }
  
      
      return new Promise((resolve, reject) => {

        if (!token)  reject(new Error("No token provided"));
        jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
          if (err)  reject(new Error("Token is unauthorized"));
           resolve(decoded);
        })
      })
      

    }
    
    return Promise.reject(new Error("Unknown security name"))

  // if (securityName === "jwt") {
  //   const token =
  //     request.body.token ||
  //     request.query.token ||
  //     request.headers["x-access-token"];

  //   return new Promise((resolve, reject) => {
  //     if (!token) {
  //       reject(new Error("No token provided"));
  //     }
  //     jwt.verify(token, "[secret]", function (err: any, decoded: any) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         // Check if JWT contains all required scopes
  //         if(scopes && scopes.length > 0) {
  //           for (let scope of scopes) {
  //             if (!decoded.scopes.includes(scope)) {
  //               reject(new Error("JWT does not contain required scope."));
  //             }
  //           }
  //           resolve(decoded);
  //         }else reject(new Error("JWT does not contain required scope.")) 
  //       }
  //     });
  //   });
  // }

}
