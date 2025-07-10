
import dotenv from 'dotenv'
dotenv.config()
import  connectDB  from './db/index.js';

import { app } from './app.js';

const port = process.env.PORT || 3000;
console.log(process.env.MONGODB_URI)

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
.catch((error) => {
    console.error('---------------Failed to connect to the database:-----------------------', error);
    
})



































/*
app.listen(3000, () => {
    console.log('Server is running on port 3000 ')
})

app.get('/', (req, res) => {
    res.send('Hello, World! jaisa kuch nhi hota hai')
})
    */