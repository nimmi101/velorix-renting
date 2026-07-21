import nodemailer from 'nodemailer';

// Configure SMTP transporter
// Note: If credentials in .env are placeholder, we bypass nodemailer and print to console log
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const isConfigured = user && !user.includes('your_email') && pass && !pass.includes('your_app_password');

  if (!isConfigured) {
    console.log('Nodemailer SMTP not configured or using placeholders. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user, pass }
  });
};

// @desc    Send receipt/invoice on booking confirmation
export const sendBookingConfirmationEmail = async (booking) => {
  const transporter = createTransporter();

  const formattedStartDate = new Date(booking.startDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedEndDate = new Date(booking.endDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const emailHtml = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E5E5; border-radius: 12px; background-color: #FCFCFC;">
      <h2 style="font-family: 'Outfit', Arial, sans-serif; color: #121212; border-bottom: 2px solid #D32F2F; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
        VELORIX RESERVATION INVOICE
      </h2>
      <p style="font-size: 16px; color: #333333;">Dear <strong>${booking.user.name}</strong>,</p>
      <p style="font-size: 14px; color: #555555; line-height: 1.5;">
        Thank you for booking with VELORIX. Your reservation is confirmed! Below are your booking specifications and details:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #F5F5F7;">
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold; width: 40%;">Reservation ID</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${booking._id}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Vehicle</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${booking.vehicle.brand} ${booking.vehicle.name} (${booking.vehicle.category})</td>
        </tr>
        <tr style="background-color: #F5F5F7;">
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Pickup Location</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${booking.pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Drop Location</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${booking.dropLocation}</td>
        </tr>
        <tr style="background-color: #F5F5F7;">
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Pickup Date</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${formattedStartDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Return Date</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${formattedEndDate}</td>
        </tr>
        <tr style="background-color: #F5F5F7;">
          <td style="padding: 10px; border: 1px solid #E5E5E5; font-weight: bold;">Driver Option</td>
          <td style="padding: 10px; border: 1px solid #E5E5E5;">${booking.driverOption ? 'Professional Driver Included' : 'Self-Drive'}</td>
        </tr>
      </table>

      <h3 style="font-family: 'Outfit', Arial, sans-serif; color: #121212; margin-top: 25px;">Pricing Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #555555;">Base Rental Charge</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${booking.pricingBreakdown.baseRentalCost}</td>
        </tr>
        ${booking.driverOption ? `
        <tr>
          <td style="padding: 8px 0; color: #555555;">Driver Allowance Charges</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${booking.pricingBreakdown.driverCost}</td>
        </tr>` : ''}
        ${booking.pricingBreakdown.extrasCost > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #555555;">Additional Services Fee</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${booking.pricingBreakdown.extrasCost}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; color: #555555;">Refundable Security Deposit</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${booking.pricingBreakdown.securityDeposit}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #555555;">State Tax (18% GST)</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${booking.pricingBreakdown.tax}</td>
        </tr>
        <tr style="border-top: 2px solid #121212; font-size: 16px; font-weight: bold; color: #121212;">
          <td style="padding: 12px 0;">Total Amount Paid</td>
          <td style="padding: 12px 0; text-align: right; color: #D32F2F;">$${booking.pricingBreakdown.totalAmount}</td>
        </tr>
      </table>

      <div style="margin-top: 30px; padding: 15px; border-radius: 8px; background-color: #FFEBEE; color: #B71C1C; font-size: 12px;">
        <strong>Terms & Conditions Note:</strong> Please present a valid Driving License and matching Identification document (Passport / ID Card) at the pickup terminal. If self-drive, security deposit is held on check-in.
      </div>

      <p style="font-size: 12px; color: #999999; margin-top: 30px; text-align: center;">
        Velorix Luxury Rentals, LLC. &copy; ${new Date().getFullYear()} All Rights Reserved.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('\n--- SIMULATED CONFIRMATION EMAIL DISPATCH ---');
    console.log(`To: ${booking.user.email}`);
    console.log(`Subject: Reservation Invoice Confirmed - VELORIX (ID: ${booking._id})`);
    console.log('Email Body Summary:\n', `User name: ${booking.user.name}\n`, `Vehicle: ${booking.vehicle.brand} ${booking.vehicle.name}\n`, `Total Cost: $${booking.pricingBreakdown.totalAmount}`);
    console.log('---------------------------------------------\n');
    return;
  }

  const mailOptions = {
    from: `"VELORIX Luxury Rentals" <${process.env.EMAIL_USER}>`,
    to: booking.user.email,
    subject: `Reservation Confirmed - Invoice: ${booking._id}`,
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched successfully: ${info.messageId}`);
  } catch (err) {
    console.error('SMTP Transport failed, email could not be sent:', err.message);
    throw err;
  }
};
