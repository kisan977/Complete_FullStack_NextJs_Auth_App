import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request:NextRequest){
    try {
        //reqbody bata token lini
        const reqBody = await request.json()
        const{token} = reqBody
        console.log(token);

        //user tanni based on token from db

            
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        console.log(user)
        if(!user){
            return NextResponse.json({error:"Invalid Message"},{status:400})
        }

    
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save()

        return NextResponse.json({message:"email Verified",Success:true})

        
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}