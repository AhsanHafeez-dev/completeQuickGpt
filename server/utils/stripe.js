import {stripe} from "../configs/stripe.js"

const createPaymentGatewayOrder = async (plan,origin,transactionId) => {


    return  await stripe.checkout.sessions.create({
        success_url: `${origin}/loading`,
        cancel_url: `${origin}`,
        
        metadata: {
                transactionId,appId:'quickgpt'
        },
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: plan.name
                    },
                    unit_amount:plan.price*100
                },
                quantity:1
            }
        ],
        mode:"payment"
    });



}


export { createPaymentGatewayOrder };