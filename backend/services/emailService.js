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
                : status === "reviewing"
                    ? "Application Under Review"
                    : "Application Rejected";

        const message =
            status === "accepted" ?
                `<p>Congratulations, ${seekerName}!</p>
                    <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong style="color: green;">ACCEPTED</strong>.</p>
                    <p>Our HR team will contact you within 2-3 business days with onboarding details.</p>
                    <br>
                    <p>Best regards,<br>Hiring Team<br>${companyName}</p>`
                : status === "reviewing" ?
                    `<p>Hi ${seekerName},</p>
                        <p>Thank you for your interest in our job opening.</p>
                        <p>We have received your application and are currently <strong>reviewing</strong> it. We will get back to you within 2-3 business days.</p>
                        <br>
                        <p>Best regards,<br>${companyName}</p>`
                    : `<p>Dear ${seekerName},</p>
                        <p>Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                        <p>After careful review, we have decided to move forward with other candidates.</p>
                        <p>We wish you success in your job search.</p>
                        <br>
                        <p>Best regards,<br>${companyName}</p>`;

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