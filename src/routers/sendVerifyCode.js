const nodemailer = require('nodemailer');

// Hàm gửi mã xác nhận
async function sendVerifyCode(receiverMail) {
    // Cấu hình thông tin đăng nhập
    const emailSender = "nluecar240@gmail.com";
    const password = process.env.GMAIL_PASSCODE; // Cần bảo mật thông tin này trong thực tế
    const emailReceiver = receiverMail;

    // Tạo transporter với cấu hình SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSender,
            pass: password,
        },
    });

    // Hàm tạo mã xác nhận
    const generateVerificationCode = () => {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    };

    // Tạo mã xác nhận và nội dung email
    const verifyCode = generateVerificationCode();
    const mailOptions = {
        from: emailSender,
        to: emailReceiver,
        subject: "TechLinks: VERIFY CODE",
        text: `YOUR VERIFY CODE: ${verifyCode}`,
    };

    try {
        // Gửi email
        await transporter.sendMail(mailOptions);
        return verifyCode;
    } catch (error) {
        return false;
    }
}

module.exports = function(app) {
    app.post("/register/sendVerifyCode", async (req, res) => {
        let getTypeRequest = req.body.typeRequest
        let result
        if(getTypeRequest == "resend" && !req.cookies.verifyCode) {
            result = await sendVerifyCode(atob(req.cookies.email))            
        } else {
            result = await sendVerifyCode(req.body.email)
        }

        res.cookie("verifyCode", result,{
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + (60000))
        }).cookie("email", btoa(req.body.email), {
            httpOnly: true,
            secure: true,
        }).cookie("password", btoa(req.body.password), {
            httpOnly: true,
            secure: true,
        })


        if(result != false) {
            return res.json({
                status: "S",
                message: "Verify code has been sent"
            })

        } else {
            return res.json({
                status: "E",
                message: "Gmail không tồn tại"
            })
        }
    })
}