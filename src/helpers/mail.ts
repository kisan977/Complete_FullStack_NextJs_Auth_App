import bcyrptjs  from 'bcryptjs';
import nodemailer from 'nodemailer'
import User from '@/models/userModel'

//how to send email

export const sendEmail = async({email,emailType,userId}:any)=>{

    try {

        //hashed token generate garni
        const hashedToken = await bcyrptjs.hash(userId.toString(),10)

        //user find garni 

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,{
                verifyToken:hashedToken, verifyTokenExpiry:Date.now()+360000
            })
        }
        else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,{
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry:Date.now()+ 360000
            })
        }


        //nodemailer ley generate gareko transport launi
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user:`${process.env.user}` ,
              pass:`${process.env.pass}`
            }
          });


          const mailOptions = {
            from:"basyalkisan123@gmail.com",
            to:email,
            subject:emailType === "VERIFY" ? "verify your email":"Reset Your Password",
            html: 
            ` <p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY"? "verfiy your email": "reset your password"}
            or copy paste link below <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`

            
          }

          const mailresponse = await transport.sendMail(mailOptions);
          return mailresponse;
 
    } catch (error:any) {
        throw new Error(error.message)
    }

}


