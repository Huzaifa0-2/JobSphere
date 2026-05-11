const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendApplicationStatusEmail = async (
    to,
    jobTitle,
    status,
    companyName,
    seekerName
) => {

    try {

        const subject =
            status === "accepted"
                ? "Application Accepted"
                : "Application Rejected";

        const message =
            status === "accepted"
                ? `Congratulations, ${seekerName}!

                    Your application for ${jobTitle} at ${companyName} has been ACCEPTED.

                    Our HR team will contact you within 2-3 business days with onboarding details.

                    Best regards,
                    Hiring Team
                    ${companyName}`

                :
                `Hi ${seekerName},

                    Thank you for your interest in our job opening.    

                    We have received your application and are currently reviewing it. We will get back to you within 2-3 business days.

                    Best regards,
                    ${companyName}`;

        // : `Dear ${seekerName},

        //     Thank you for applying for ${jobTitle} at ${companyName}.

        //     After careful review, we have decided to move forward with other candidates.

        //     We wish you success in your job search.

        //     Best regards,
        //     Hiring Team
        //     ${companyName}`;

        await resend.emails.send({
            from: "JobSphere <onboarding@resend.dev>",
            to,
            subject,
            html: `
        <h2>${subject}</h2>
        <p>${message}</p>
      `
        });

        console.log("Email sent");

    } catch (error) {
        console.log("Email error:", error.message);
    }
};

module.exports = {
    sendApplicationStatusEmail
};