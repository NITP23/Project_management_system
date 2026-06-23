export function generateForgetPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td align="center" style="background:#2563eb;padding:30px;">
                  <div style="
                    width:70px;
                    height:70px;
                    line-height:70px;
                    border-radius:50%;
                    background:#ffffff;
                    font-size:36px;
                    text-align:center;
                  ">
                    🔒
                  </div>

                  <h1 style="margin:20px 0 0;color:#ffffff;font-size:28px;">
                    Password Reset
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin-top:0;color:#111827;">
                    Forgot your password?
                  </h2>

                  <p style="font-size:16px;line-height:1.7;color:#4b5563;">
                    We received a request to reset the password for your account.
                    Click the button below to create a new password.
                  </p>

                  <div style="text-align:center;margin:35px 0;">
                    <a
                      href="${resetPasswordUrl}"
                      style="
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 32px;
                        border-radius:8px;
                        font-size:16px;
                        font-weight:600;
                        display:inline-block;
                      "
                    >
                      🔑 PMS : Password reset Request
                    </a>
                  </div>

                  <div style="
                    background:#eff6ff;
                    border-left:4px solid #2563eb;
                    padding:15px;
                    border-radius:6px;
                    margin:25px 0;
                  ">
                    <p style="margin:0;color:#1e40af;font-size:14px;">
                      ⏳ This reset link will expire shortly for security reasons.
                    </p>
                  </div>

                  <p style="font-size:14px;color:#6b7280;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>

                  <p style="
                    word-break:break-all;
                    font-size:14px;
                    color:#2563eb;
                    background:#f9fafb;
                    padding:12px;
                    border-radius:6px;
                  ">
                    ${resetPasswordUrl}
                  </p>

                  <p style="font-size:14px;line-height:1.7;color:#6b7280;">
                    If you didn't request a password reset, you can safely ignore this email.
                    Your password will remain unchanged.
                  </p>

                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

                  <p style="font-size:12px;color:#9ca3af;text-align:center;">
                    🤖 This is an automated email. Please do not reply.
                  </p>

                  <p style="font-size:14px;color:#4b5563;text-align:center;">
                    <strong>Your Team</strong>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}




// * Request Accepted Email
//  */
export function generateRequestAcceptedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">✅ Supervisor Request Accepted</h2>
      <p>Your supervisor request has been accepted by <strong>${supervisorName}</strong>.</p>
      <p>You can now start working on your project and upload files.</p>
    </div>
  `;
}

/**
 * Request Rejected Email
 */
export function generateRequestRejectedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">❌ Supervisor Request Rejected</h2>
      <p>Your supervisor request has been rejected by <strong>${supervisorName}</strong>.</p>
      <p>You can try requesting another supervisor.</p>
    </div>
  `;
}
