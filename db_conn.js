import mongoose, { set, connect } from 'mongoose';
import 'dotenv/config';

set('strictQuery',true);

connect(
    process.env.DB_URL,
    // {userNewUrlParser: true}, 
    (err)=>{
        if(!err) console.log('Connected successfully')
        else
            console.log('Connection error : '+err);
    }
)

export default mongoose;