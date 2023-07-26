import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcyrptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextRequest){
    try {

        const reqBody = await request.json();
        const {email,password} = reqBody;
        console.log(reqBody);

        const user =  await User.findOne({email});

        if(!user){
            return NextResponse.json({error:"Provided Email is not registered"},{status:400})
        }

        // check if valid password

        const validPassword = await bcyrptjs.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({error:"Invalid Password"},{status:400})
        }

        const tokenData = {
            id:user._id,
            username:user.username,
            email:user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
   

        const response = NextResponse.json({
            message:"login successfull",
            Success:true
            })

            response.cookies.set("token", token, {
                httpOnly: true
              });

              return response;
        


        
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}