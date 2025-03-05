const mongoose = require('mongoose');
require('dotenv').config();

const getConnection = async () => {
    try {
        const url = 'mongodb://deinercalanche:123456Dei@cluster0-shard-00-00.ctbus.mongodb.net:27017,cluster0-shard-00-01.ctbus.mongodb.net:27017,cluster0-shard-00-02.ctbus.mongodb.net:27017/?ssl=true&replicaSet=atlas-rit1im-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

        await mongoose.connect(url);

        console.log('✅ Conexión a MongoDB Atlas exitosa');
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error);
    }
};

module.exports = {
    getConnection,
};