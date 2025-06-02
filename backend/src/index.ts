/*import express from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET = "!@#$"
import {ContentModel, LinkModel, UserModel} from "./db"
const bcrypt = require("bcrypt")
import {z} from "zod"
import { authMiddleware } from "./middleware";
import { random } from "./utils";
const app = express()
app.use(express.json())

app.post("/api/v1/signup",async(req,res)=>{
    //Zod validation,hash the password
    const {username,password} = req.body
    const hashed = await bcrypt.hash(password,10)
    const reqbody = z.object({
        username: z.string().min(3).max(10),
        password: z
              .string()
              .min(8)
              .refine((password) => /[A-Z]/.test(password), {
                message: "Required atleast one uppercase character",
               })
               .refine((password) => /[a-z]/.test(password), {
                message: "Required atleast one lowercase character",
              })
              .refine((password) => /[0-9]/.test(password), {
                message: "Required atleast one number",
             })
             .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "Required atleast one special character",
             })
    })
    const parsed = reqbody.safeParse(req.body)
    if(!parsed.success){
        res.status(411).json({
            message: "incorrect user inputs",
            error: parsed.error.issues[0].message
        })
        return
    }
    try{
        await UserModel.create({
            username: username,
            password: hashed
        })
        res.status(200).json({
            message: "User created"
        })

    }catch(e){
        res.status(403).json({
            message: "User already exists"
        })
    }
    
})

app.post("api/v1/signin",async(req,res)=>{
    try {
        const {username,password} = req.body
        const findUser = await UserModel.findOne({
            username: username
        })
        if(!findUser){
            res.status(403).json({
                message: "user not found"
            })
        }
        const isPasswordValid = await bcrypt.compare(password,findUser?.password)
        if(isPasswordValid){
            const token = jwt.sign({id: findUser?._id.toString()},JWT_SECRET)
            res.status(200).json({
                message: " user signed in ",
                token: token
            })
        }else{
            res.status(403).json({message: "incorrect credentials"})
        }

    }catch(e){
        res.status(500).json({message: "server error"})
    }
})
app.post("api/v1/content",authMiddleware,async (req,res)=>{
    const {link,type,title,userId} = req.body
    try{
        await ContentModel.create({
            link,
            type,
            title,
            userId,
            tags: []
        })
        res.status(200).json({
            message: "content created"
        })

    }catch(e){
       res.status(403).json("ivalid inputs")
    }
})
app.get("api/v1/content",authMiddleware,async (req,res)=>{
    const {userId} = req.body
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId","username")
    res.json({
        content: content 
    })
})
app.delete("api/v1/content",authMiddleware,async(req,res)=>{
    const {contentId} = req.body
    await ContentModel.deleteMany({
        contentId,
        userId:req.body.userId
    })
})
app.post("api/v1/brain/share",authMiddleware,async(req,res)=>{
    const share = req.body.share
    if(share){
        LinkModel.create({
            userId: req.body.userId, 
            hash: random(10)
        })
    }else{
        LinkModel.deleteOne({
            userId: req.body.userID
        })
    }
    res.json({
        message: "updated sharable.link"
    })
})
app.get("api/v1/brain/:shareLink",authMiddleware,async(req,res)=>{
    const hash = req.params.shareLink

    const link = await LinkModel.findOne({
         hash
    })
    if(!link){
        res.status(411).json({
            message: "sorry incorrect input"
        })
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        userId:link.userId
    })

    if(!user){
        res.status(411).json({
            message: " user not found   "
        })
    }

    res.json({
        username: user?.username,
        content: content
    })
})

app.listen(3000)*/
import express from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";
const bcrypt = require("bcrypt")
import {z} from "zod"

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password

    const {username,password} = req.body
    const hashed = await bcrypt.hash(password,10)
    const reqbody = z.object({
        username: z.string().min(3).max(10),
        password: z
              .string()
              .min(8)
              .refine((password) => /[A-Z]/.test(password), {
                message: "Required atleast one uppercase character",
               })
               .refine((password) => /[a-z]/.test(password), {
                message: "Required atleast one lowercase character",
              })
              .refine((password) => /[0-9]/.test(password), {
                message: "Required atleast one number",
             })
             .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "Required atleast one special character",
             })
    })
    const parsed = reqbody.safeParse(req.body)
    if(!parsed.success){
        res.status(411).json({
            message: "incorrect user inputs",
            error: parsed.error.issues[0].message
        })
        return
    }
    try{
        await UserModel.create({
            username: username,
            password: hashed
        })
        res.status(200).json({
            message: "User created"
        })

    }catch(e){
        res.status(403).json({
            message: "User already exists"
        })
    }
    
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
    
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

app.listen(3000);