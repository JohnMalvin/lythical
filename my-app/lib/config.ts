export const config = {
    bcrypt: {
        saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS)
    }
};