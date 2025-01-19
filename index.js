const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const swaggerDocument = require('./swagger-output.json');

require('./models');

// const authenticateToken = require('./src/middleware/authMiddleware'); // Import authentication middleware
const auth = require('./src/router/authRouter');
const vaRouter = require('./src/router/vaRouter');
const clientRouter = require('./src/router/clientRouter');
const adminRouter = require('./src/router/adminRouter');
const managerRouter = require('./src/router/managerRouter');

const { handleVerify } = require('./src/middleware/verifyToken');
const roleVerify = require('./src/middleware/roleVerify');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// const whiteList = ['https://mysite.com','http://localhost:4000', 'http://localhost:3000'];
// const corsOptions = {
// 	origin: (origin,callback) => {
// 		if (whiteList.indexOf(origin) !== -1 || !origin) {
// 			callback(null,true)
// 		}else {
// 			callback(new Error("CORS BLOCKED THIS REQUEST!!"));
// 		}
// 	},
// 	OptionsSucessStatus: 200
// }

// app.use(cors(corsOptions));

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/example', (req, res) => {
  res.send('Hello, World!');
});

app.use(auth);

//Authenticated User Access
app.use(handleVerify);

//Router For Admin
app.use('/admin', roleVerify('admin'), adminRouter);

//Router For Project Manager.
app.use('/manager', roleVerify('manager'), managerRouter);

//Router For Virtual Assistant.
app.use('/member', roleVerify('member'), vaRouter);

//Router For Client.
app.use('/client', roleVerify('client'), clientRouter);

app.listen(PORT, () => {
  console.log('The server is running at localhost:' + PORT);
});
