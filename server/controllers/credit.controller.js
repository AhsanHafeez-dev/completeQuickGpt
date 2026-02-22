import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { prisma } from "../prisma/index.js";
import { httpCodes, plans } from "../constants.js";
import { createPaymentGatewayOrder } from "../utils/stripe.js";

const getPlans = asyncHandler((req, res) => {
    return res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, plans, "plans fetched succesfully"));
})

const purchasePlan = asyncHandler(async (req, res) => {
    const { planId } = req.body;
    const userId = req.user.id;
    const { origin } = req.headers;
    
    const plan = plans.filter((plan) => plan._id == planId)[0];
    console.log(planId);
    
    if (!plan) { throw new ApiError(httpCodes.badRequest, "invalid plam"); }
    

    // when webhooks start working cameback here
    // const transaction = await prisma.transaction.create({ data: { planId, userId, amount: plan.price, credits: plan.credits, isPaid: false } });


    const transaction = await prisma.transaction.create({ data: { planId, userId, amount: plan.price, credits: plan.credits, isPaid: true } });
    await prisma.user.update({ where: { id: transaction.userId }, data: { credits: { increment: transaction.credits } } });
    const session = await createPaymentGatewayOrder(plan, origin, transaction.id);
    
    return res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, { url: session.url }, "order created succesfully"));


    
})
export { getPlans,purchasePlan };
