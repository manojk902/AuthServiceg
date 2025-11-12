import jwt from 'jsonwebtoken';

const jwtTokenGenerator = (
  userId: number, 
  userName: string, 
  userEmail: string, 
  appName: string | null // Allow null
) => {
  const payload: any = {
    id: userId,
    userName: userName, 
    email: userEmail,
  };

  // Only add appName to payload if it exists
  if (appName) {
    payload.appName = appName;
  }
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
}

export default jwtTokenGenerator;