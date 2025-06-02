"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const bcrypt = require("bcrypt");
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: zod validation , hash the password
    const { username, password } = req.body;
    const hashed = yield bcrypt.hash(password, 10);
    const reqbody = zod_1.z.object({
        username: zod_1.z.string().min(3).max(10),
        password: zod_1.z
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
    });
    const parsed = reqbody.safeParse(req.body);
    if (!parsed.success) {
        res.status(411).json({
            message: "incorrect user inputs",
            error: parsed.error.issues[0].message
        });
        return;
    }
    try {
        yield db_1.UserModel.create({
            username: username,
            password: hashed
        });
        res.status(200).json({
            message: "User created"
        });
    }
    catch (e) {
        res.status(403).json({
            message: "User already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrrect credentials"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({
        contentId,
        userId: req.userId
    });
    res.json({
        message: "Deleted"
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = yield db_1.ContentModel.find({
        userId: link.userId
    });
    console.log(link);
    const user = yield db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(3000);
