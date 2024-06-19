import express from 'express';
import dotenv from "dotenv";
import connectDatabase from './config/mongodb.js';
import productRoute from './routes/product.route.js';
import { errorHandler, notFound } from './middleware/errors.js';
import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';
import categoryRouter from './routes/category.route.js';
import discountRouter from './routes/discount.route.js';
import imageRouter from './routes/image.route.js';
import cors from 'cors';

dotenv.config()
connectDatabase()
const app = express()
app.use(express.json())

// API
//app.use("/api/import", ImportData)
//app.use(cors())
//app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4000']}))
app.use(cors({ 
    origin: ["http://localhost:3000", "http://localhost:4000", 'https://frontend-clothes-store.vercel.app', 'https://admin-dashboard-clothes-store.vercel.app/'], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use("/api/products", productRoute)
app.use("/api/users", userRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/orders", orderRouter)
app.use("/api/discounts", discountRouter)
app.use("/api/images", imageRouter)
app.get("/api/config/paypal", (req,res) => {
    res.send(process.env.PAYPAL_CLIENT_ID)
})

//ERROR HANDLER
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 1000

app.listen(PORT, console.log(`server running in port ${PORT}`))