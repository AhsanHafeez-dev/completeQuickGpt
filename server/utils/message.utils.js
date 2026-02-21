import { prisma } from "../prisma/index.js";



const prepareHistory = async (content, chatId) => {
    let messages = await prisma.message.findMany({ where: { chatId } });
    messages = messages.map((message) => ({
        role: message.role,
        content:message.content
    }))
    

    messages.push({role:'user',content})
    return messages

 }


export { prepareHistory };