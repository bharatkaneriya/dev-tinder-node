const connectDB = require('./src/config/database');
const app = require('./src/app')

const port = process.env.PORT || 3000

connectDB().then(() => {
    console.log("Database connection successfully!");
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}).catch((err) => {
    console.log('Database connection failed!');
    console.error(err);
});

