// Modules
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Environment variables
config();

// Database connection function
export const Connect = async () => {
    try {
        // We create the connection to the database with mongoose
        await mongoose.connect(process.env.DB_URL, {
            poolSize: 5,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        // If no error occurred we print the following message on the console
        console.log('Database is connected');
    } catch (error) {
        // In case of any error we return the following message
        console.error(`Connection error: ${error}`);
    }
};
