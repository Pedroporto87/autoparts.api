import app from './app.js';
import { sequelize } from '../models/index.js';

const PORT = process.env.PORT || 4000; 

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
        app.listen(PORT, () => {
            console.log(` 🚀 Server is running on port ${PORT}.`);
        }); 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();