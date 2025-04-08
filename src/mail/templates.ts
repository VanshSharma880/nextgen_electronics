import { formatDate } from "@/helpers/formatDate";

export const successEmailTemplate = (order: any) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f9fc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        background-color: #4CAF50;
        color: white;
        padding: 20px 0;
        border-radius: 8px 8px 0 0;
      }
      .content {
        margin: 20px 0;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #555555;
        font-size: 12px;
      }
      .btn {
        display: inline-block;
        margin: 20px auto;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
      }
      .order-details {
        background-color: #f1f1f1;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .order-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .order-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 15px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Payment Successful!</h1>
      </div>
      <div class="content">
        <p>Hi <b>${order.address.name}</b>,</p>
        <p>Thank you for your purchase from <b>NextGenElectronics</b>. Your order is now being processed.</p>
        
        <div class="order-details">
          <p><b>Order ID:</b> #${order._id.toString().slice(-6)}</p>
          <p><b>Order Date:</b> ${formatDate(order.createdAt)}</p>
          <p><b>Payment Status:</b> ${order.paymentStatus.toUpperCase()}</p>
          <p><b>Delivery Status:</b> ${order.deliveryStatus.toUpperCase()}</p>
          <p><b>Transaction Amount:</b> ₹${order.totalAmount}</p>
        </div>

        <h3>Order Summary:</h3>
        ${order.items
          .map(
            (item: any) => `
          <div class="order-item">
            <img src="${item.productImage[0]}" alt="${item.productName}" />
            <div>
              <p><b>${item.productName}</b></p>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: ₹${item.price}</p>
            </div>
          </div>
        `
          )
          .join("")}

        <h3>Shipping Address:</h3>
        <p>${order.address.name}</p>
        <p>${order.address.addressLine}, ${order.address.city}</p>
        <p>ZIP Code: ${order.address.zipCode}</p>
        <p>Phone: ${order.address.phone}</p>

        <a class="btn" href="${process.env.FRONT_URL}/orders">View Order</a>
      </div>
      <div class="footer">
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Thank you for choosing NextGenElectronics!</p>
      </div>
    </div>
  </body>
</html>
`;

export const failedEmailTemplate = (order: any) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f9fc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        background-color: #FF6347;
        color: white;
        padding: 20px 0;
        border-radius: 8px 8px 0 0;
      }
      .content {
        margin: 20px 0;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #555555;
        font-size: 12px;
      }
      .btn {
        display: inline-block;
        margin: 20px auto;
        background-color: #FF6347;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
      }
      .order-details {
        background-color: #f1f1f1;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .order-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .order-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 15px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Payment Failed</h1>
      </div>
      <div class="content">
        <p>Hi <b>${order.address.name}</b>,</p>
        <p>We regret to inform you that your payment for the following order was **unsuccessful**.</p>
        
        <div class="order-details">
          <p><b>Order ID:</b> #${order._id.toString().slice(-6)}</p>
          <p><b>Order Date:</b> ${formatDate(order.createdAt)}</p>
          <p><b>Transaction Amount:</b> ₹${order.totalAmount}</p>
          <p><b>Payment Status:</b> Failed ❌</p>
        </div>

        <h3>Order Summary:</h3>
        ${order.items
          .map(
            (item: any) => `
          <div class="order-item">
            <img src="${item.productImage[0]}" alt="${item.productName}" />
            <div>
              <p><b>${item.productName}</b></p>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: ₹${item.price}</p>
            </div>
          </div>
        `
          )
          .join("")}

        <p>Please try again or use a different payment method.</p>
        <p>If the amount was deducted from your account but the payment failed, it will be refunded automatically within **5-7 business days**.</p>

        <a class="btn" href="${
          process.env.FRONT_URL
        }/checkout">Retry Payment</a>
      </div>
      <div class="footer">
        <p>If you need assistance, contact our support team at <a href="mailto:support@nextgenelectronics.com">support@nextgenelectronics.com</a>.</p>
        <p>Thank you for shopping with NextGenElectronics!</p>
      </div>
    </div>
  </body>
</html>
`;
