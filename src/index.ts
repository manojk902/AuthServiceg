import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import defaultRoute from './routes/default.route'
import signupRoute from './routes/signup.route'
import loginRoute from './routes/login.route'
import forgotPasswordRoute from './routes/forgotPassword.route'
import accountDeactivateRoute from './routes/accountDeactivate.route'
import deleteAccountRoute from './routes/deleteAccount.route';
import suspendAccountRoute from './routes/suspendAccount.route'
import recoveryEmailRoute from './routes/recoveryEmail.route';
import userInfoRoute from './routes/userInfo.route';
import { swaggerSpec, swaggerUi } from './swagger';

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
// cors
app.use(cors())

// middleware body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT ;
const BASE_URL_SERVER = process.env.BASE_URL_SERVER ;

// Swagger route---------------------------------------------------SWAGGER ROUTE "/api/v1/auth/docs"
app.use('/api/v1/auth/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// default route------------------------------------------------------------------DEFAULT ROUTE "/"
app.use('/',defaultRoute)

// signup root -------------------------------------------------------------------SIGNUP ROUTE 
app.use("/api/v1/auth",signupRoute)
// signup(app, pool)

// login route--------------------------------------------------------------------LOGIN ROUTE 
app.use("/api/v1/auth", loginRoute)

// forgot password route----------------------------------------------------------FORGOT PASSWORD 
app.use('/api/v1/auth',forgotPasswordRoute)
// app.use('/api/v1/auth',resetPasswordRoute)

// deactivate account route----------------------------------------------------DEACTIVATE ACCOUNT 
app.use('/api/v1/auth',accountDeactivateRoute)
// app.use('/api/v1/auth',reactivateUserAccountRoute)

// delete account route----------------------------------------------------DELETE ACCOUNT 
app.use('/api/v1/auth',deleteAccountRoute)
// app.use('/api/v1/auth',recoverAccountRoute)

// suspend account route----------------------------------------------------SUSPEND ACCOUNT 
app.use('/api/v1/auth',suspendAccountRoute)
// app.use('/api/v1/auth',unsuspendAccountRoute)

// recovery Email route----------------------------------------------------RECOVERY EMAIL 
app.use('/api/v1/auth', recoveryEmailRoute)

// user info route----------------------------------------------------USER INFO 
app.use('/api/v1/auth', userInfoRoute)


server.listen(PORT, () => {
  console.log(`AuthService is running on URL ${BASE_URL_SERVER}`);
});
