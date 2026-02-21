import { openai } from "../configs/llm.config.js";

const getResponseFromAI = async (messages) => {
    const respose = await openai.chat.completions.create({
        model: 'gemini-2.5-flash', messages
    })
    return {...respose.choices[0].message};
}


export {getResponseFromAI};