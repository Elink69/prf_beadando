import { User } from "../../domain/entities/user";
import { collections } from "../dbContext/dbContext";
import { UserCreationDto } from "../dtos/userCreationDto";
import { UserDetailsDto } from "../dtos/userDetailsDto";
import { mapper } from "../mappers/mapper";

export const getUsersAsync = async (): Promise<UserDetailsDto[]> => {
    const users = (await collections?.users?.find({}).toArray()) as User[];
    return await mapper.mapArrayAsync(users, User, UserDetailsDto);
}

export const getUserByEmailAsync = async (userEmail: string): Promise<UserDetailsDto> => {
    const query = { email: userEmail };
    const user = await collections.users?.findOne(query);
    return await mapper.mapAsync(user, User, UserDetailsDto)
}

export const createUserAsync = async (userData: UserCreationDto): Promise<boolean> => {
        const newUser = await mapper.mapAsync(userData, UserCreationDto, User)
        const insertResult = await collections?.users?.insertOne(newUser);
        
        if (!insertResult){       
            return false;
        } else {
            return insertResult.acknowledged;
        }
}
