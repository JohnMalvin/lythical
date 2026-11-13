
import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },

        code: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6,
        },

        verified: {
            type: Boolean,
            default: false,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

verificationCodeSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const VerificationCode =
    mongoose.models.VerificationCode ||
    mongoose.model("VerificationCode", verificationCodeSchema);

export default VerificationCode;
