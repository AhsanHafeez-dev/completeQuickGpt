// import Stripe from 'stripe';
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/AsyncHandler.js";
// import {stripe} from "../configs/stripe.js"
// import { httpCodes } from '../constants.js';
// import { prisma } from '../prisma/index.js';
// const stripeWebhook = asyncHandler(async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event=stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
//     }
//     catch (err) {
//         throw new ApiError(httpCodes.unauthorized,err.message)
//     }

//         switch (event.type) {
//             case "payment_intent.succeeded": {
//                 const paymentIntent = event.data.object;
//                 const sessionsList = await stripe.checkout.sessions.list({ payment_intent: paymentIntent.id })
//                 const session = sessionsList.data[0];
//                 const { transactionId, appId } = session.metadata;
//                 if (appId === 'quickgpt') {
//                     const trasaction = await prisma.transaction.update({ where: { id: transactionId }, data: { isPaid: true } });
//                     await prisma.user.update({ where: { id: trasaction.userId }, data: { credits: { increment: trasaction.credits } } });
//                 } else {
//                     return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,{},"ignored event invalid app"))
//                 }
//                 break;

//             }
//             default: { console.log("unhandlere event type",event.type); break; }

//         }

//     return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,{recieved:true},"success"))

// })

// export {stripeWebhook}

import Stripe from "stripe";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { stripe } from "../configs/stripe.js";
import { httpCodes } from "../constants.js";
import { prisma } from "../prisma/index.js";

const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    throw new ApiError(httpCodes.unauthorized, err.message);
  }

  switch (event.type) {
    // Change the event type to checkout.session.completed
    case "checkout.session.completed": {
      // The object is directly the session! No extra API calls needed.
      const session = event.data.object;

      // Safely check if metadata exists
      if (!session || !session.metadata) {
        console.log("No metadata found on session");
        break;
      }

      const { transactionId, appId } = session.metadata;

      if (appId === "quickgpt") {
        const transaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: { isPaid: true },
        });
        await prisma.user.update({
          where: { id: transaction.userId },
          data: { credits: { increment: transaction.credits } },
        });
      } else {
        return res
          .status(httpCodes.ok)
          .json(new ApiResponse(httpCodes.ok, {}, "ignored event invalid app"));
      }
      break;
    }

    // You can safely ignore payment_intent.succeeded if you are handling fulfillment in checkout.session.completed
    case "payment_intent.succeeded": {
      console.log(
        "Payment intent succeeded, but fulfilling order via checkout.session.completed",
      );
      break;
    }

    default: {
      console.log("Unhandled event type", event.type);
      break;
    }
  }

  return res
    .status(httpCodes.ok)
    .json(new ApiResponse(httpCodes.ok, { received: true }, "success"));
});

export { stripeWebhook };