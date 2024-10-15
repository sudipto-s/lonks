export const OTP_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Your OTP Code</title>
   <style>
      body {
         background-color: #f7f7f7;
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 0;
         color: #333;
      }
      .email-container {
         width: 95%;
         max-width: 600px;
         margin: 20px auto;
         background-color: #ffffff;
         border-radius: 8px;
         overflow: hidden;
         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
         background-color: #007bff;
         padding: 20px;
         text-align: center;
         color: white;
      }
      .header h1 {
         margin: 0;
      }
      .content {
         padding: 30px;
         text-align: center;
      }
      .content h2 {
         color: #007bff;
         margin-bottom: 20px;
      }
      .content p {
         font-size: 16px;
         line-height: 1.5;
         margin-bottom: 30px;
      }
      .otp-code {
         font-size: 24px;
         font-weight: bold;
         padding: 15px 30px;
         background-color: #f1f1f1;
         border-radius: 8px;
         display: inline-block;
         letter-spacing: 5px;
         margin-bottom: 40px;
      }
      .footer {
         background-color: #007bff;
         color: white;
         text-align: center;
         padding: 15px;
      }
      .footer p {
         margin: 0;
         font-size: 14px;
      }
      .footer a {
         color: white;
         text-decoration: underline;
      }
      @media (max-width: 600px) {
         .content {
               padding: 20px;
         }
      }
   </style>
</head>
<body>
   <div class="email-container">
      <div class="header">
         <h1>Lonks OTP Verification</h1>
      </div>
      <div class="content">
         <h2>Verify Your Email</h2>
         <p>Thank you for registering at Lonks! Use the following OTP to verify your email address and complete your registration:</p>
         <div class="otp-code">[[OTP]]</div>
         <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email or contact support.</p>
      </div>
      <div class="footer">
         <p>&copy;
            <script>document.write(new Date().getFullYear())</script>
            Lonks. All rights reserved. Need help?
            <a href="//linkedin.com/in/sudipto-singha">Contact Us</a>
         </p>
      </div>
   </div>
</body>
</html>`