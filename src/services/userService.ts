// import bcrypt from 'bcrypt';
// import { User } from '../entity/User';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// export const getAllUser = async () => {
//   console.log("here");
  
//   const allUser = await User.find();
//   return allUser;
//   };

// export const register = async ({ username, password }: { username: string, password: string }) => {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       throw new Error('Username already exists');
//     }
  
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
  
//     return newUser;
//   };
  
//   export const login = async ({ username, password }: { username: string, password: string }) => {
//     const user = await User.findOne({ username });
//     if (!user) {
//       throw new Error("User not found");
//     }
  
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new Error("Invalid Password");
//     }
  
//     const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
//     return { token };
//   };