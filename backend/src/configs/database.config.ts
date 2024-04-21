import {connect, ConnectOptions} from "mongoose";

export const dbConnect = () => {
    connect(process.env.MONGO_URI!, {
    } as ConnectOptions).then(
        () => console.log("database connected successefully"),
        (error) => console.log(error)
    )
}