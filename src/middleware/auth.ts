import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const SECRET_KEY: Secret =
  "Y0u-Kn0w-517-H4pp3n5-50m371m35-3v3n-7h0u9h-W3-W15h-1t-D1d-N07-6u7-W3-4r3-H3r3-70-H3lp-H0w3v3r-W3-C4n";


export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("You need to be logged in");
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;
    //todo check if user exists in database otherwise throw error

    next();
  } catch (err) {
    res.status(401).send("Please authenticate");
  }
};
