import { User } from "../../domain/entities/user";
import { UserCreationDto } from "../dtos/userCreationDto";
import { UserDetailsDto } from "../dtos/userDetailsDto";
import { UserModifyDto } from "../dtos/userModifyDto";

export const getUsersAsync = async (): Promise<UserDetailsDto[]> => {
    const users = await User.find({});
    const userDetails: UserDetailsDto[] = [];
    users.forEach((user) => {
        userDetails.push(
            new UserDetailsDto(
                user.name,
                user.email,
                user.role,
                user.createdOn
            )
        )
    });
    return userDetails;
}

export const getUserByEmailAsync = async (userEmail: string): Promise<UserDetailsDto> => {
    const user = await User.findOne({email: userEmail});
    if(!user){
        throw new Error("User not found");
    }

    return new UserDetailsDto(user.name, user.email, user.role, user.createdOn);
}

export const modifyUser = async (userEmail: string, editDto: UserModifyDto): Promise<boolean> => {
  const user = await User.findOne({email: userEmail});
  if(!user){
    throw new Error("User not found");
  }

  user.email = editDto.email;
  user.name = editDto.name;
  user.password = editDto.password;
  user.role = editDto.role;

  const saveResult = await user.save();
  return !!saveResult;
}

export const createUserAsync = async (userData: UserCreationDto): Promise<boolean> => {
    const newUser = new User({email: userData.email, password: userData.password, name: userData.name, role: userData.role})

    const existingUser = await User.findOne({email: newUser.email})

    if(existingUser){
        throw new Error("User already exists.");
    }

    newUser.createdOn = new Date();
    const insertResult = await newUser.save();
    return !!insertResult
}

export const deleteUserAsync = async (userEmail: string): Promise<boolean> => {
    const deleteResult = await User.deleteOne({email: userEmail})
    return !!deleteResult;
}
