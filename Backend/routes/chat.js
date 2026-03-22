import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();


//test
router.post("/test" , async(req , res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating thread");
    }
});

//get all threads
router.get("/thread" , async(req , res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});  //most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching threads" });
    }
});

router.get("/thread/:threadId" , async(req , res) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.threadId });
        
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        } 

        res.json(thread);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching thread" });
    }
});

router.delete("/thread/:threadId" , async(req , res) => {
    try {
        const thread = await Thread.findOneAndDelete({ threadId: req.params.threadId });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ message: "Thread deleted successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error deleting thread" });
    }   
});

router.post("/chat" , async(req , res) => {

        const { threadId, message } = req.body;

        if (!threadId || !message) {
            return res.status(400).json({ error: "threadId and message are required" });
        }
        try{
            let thread = await Thread.findOne({ threadId });
            if (!thread) {
                thread = new Thread({
                    threadId,
                    title: message,
                    messages: [{ role: "user", content: message }]
                });
            }else{
                thread.messages.push({ role: "user", content: message });
            }

            const assistantResponse = await getGeminiResponse(message);
            thread.messages.push({ role: "assistant", content: assistantResponse });
            thread.updatedAt = new Date();

            await thread.save();
            res.json({reply : assistantResponse });
            
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Error processing chat message" });
        }
    });

export default router;