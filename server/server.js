import express from "express"
import 'dotenv/config';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { errorHandler } from "./utils/ErrorHandler.js";
import { stripeWebhook } from "./controllers/webhooks.js";

const app = express();
app.route('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(cors());
app.use(cookieParser())
app.use(express.json());

app.get('/', (req, res) => res.send('server is live'));

import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import creditRouter from "./routes/credit.routes.js";


app.use('/api/user', userRouter);
app.use("/api/chat", chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/credit',creditRouter)

app.use(errorHandler);
// app.listen( 3000, () => { console.log(`server is runiing on port 3000`);
// })

export default app;