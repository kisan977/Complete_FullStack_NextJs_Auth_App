import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcyrptjs from 'bcryptjs';

connect();

// Email validation function
function isValidEmail(email: string): boolean {
    // Simple email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log(reqBody);

        // Check if the provided email is a genuine email format
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Not a valid email address" }, { status: 400 });
        }

        // check if user already exists by email
        const existingEmailUser = await User.findOne({ email });

        if (existingEmailUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // check if user already exists by username
        const existingUsernameUser = await User.findOne({ username });

        if (existingUsernameUser) {
            return NextResponse.json({ error: "User with this username already exists" }, { status: 400 });
        }

        // hash password
        const salt = await bcyrptjs.genSalt(10);
        const hashPassword = await bcyrptjs.hash(password, salt);

        // save user in db
        const newUser = new User({ username, email, password: hashPassword });

        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json({ message: "User Registration successful", Success: true, savedUser });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
