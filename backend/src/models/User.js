import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    fullName: { type: String, required: [true, "Full name is required."], trim: true, minlength: [2, "Full name must be at least 2 characters."], maxlength: [50, "Full name cannot exceed 50 characters."], },
    email: { type: String, required: [true, "Email is required."], unique: true, lowercase: true, trim: true, maxlength: [100, "Email cannot exceed 100 characters."], },
    password: { type: String, required: [true, "Password is required."], minlength: [8, "Password must be at least 8 characters."], select: false, },

},{timestamps:true,versionKey:false})

userSchema.pre("save",async function hashPasswordBeforeSave() {
    if(!this.isModified("password")){
        return 
    }

    const saltRounds = 12

    this.password = await bcrypt.hash(this.password, saltRounds)
})


userSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password)
}

export const User = mongoose.model("User", userSchema);