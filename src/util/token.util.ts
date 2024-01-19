import * as jwt from 'jsonwebtoken'

export const createAccessToken = (userId: number, isAdmin: boolean) => {
    return jwt.sign(
        { userId, isAdmin },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '20m',
        }
    )
}

export const createRefreshToken = (userId: number, isAdmin: boolean) => {
    return jwt.sign(
        { userId, isAdmin },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: '1d',
        }
    )
}

export const verifyAccessToken = (accessToken: string) => {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string)
}

export const verifyRefreshToken = (refreshToken: string) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)
}
