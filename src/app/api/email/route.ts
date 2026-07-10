import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, invoiceNumber, customerName, amount, htmlContent } = body

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      // Fallback: log email details (no API key configured)
      console.log(`[Email] To: ${to}, Subject: ${subject}, Invoice: ${invoiceNumber}`)
      return NextResponse.json({
        success: true,
        message: `Invoice ${invoiceNumber} email queued for ${to}`,
        note: "Set RESEND_API_KEY in .env to enable actual email delivery"
      })
    }

    // Send via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "MediSpot ERP <onboarding@resend.dev>",
        to: [to],
        subject: subject || `Invoice ${invoiceNumber} - MediSpot Pharma`,
        html: htmlContent || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">MediSpot Pharma Pvt. Ltd.</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Tax Invoice</p>
            </div>
            <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p>Dear <strong>${customerName}</strong>,</p>
              <p>Please find your invoice details below:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr style="background: #f3f4f6;">
                  <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold;">Invoice Number</td>
                  <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold;">Amount</td>
                  <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">₹${amount?.toLocaleString("en-IN") || "0"}</td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px;">Please process the payment at your earliest convenience.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #9ca3af; font-size: 12px;">
                MediSpot Pharma Pvt. Ltd. | 123 Nariman Point, Mumbai - 400021<br/>
                GST: 27AABCM1234A1Z5 | Drug License: MH-WS-000001
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json({ success: false, error: error.message || "Email send failed" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, message: `Invoice emailed to ${to}`, emailId: data.id })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
