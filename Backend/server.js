import  {connectDB}  from "./src/db/db.js";
import app from "./app.js";

//Database connection
connectDB();
//start server

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//Error handling
process.on("unhandledRejection", (err) => {
    console.log(`unhandled Rejection: ${err.message}`);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.log(`uncaught Exception: ${err.message}`);
    process.exit(1);
})

export default server; 