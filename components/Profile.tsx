'use client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProfileProps {
  name: string;
  image: string;
}

const Profile = ({ name, image }: ProfileProps) => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer mb-3">
      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-md font-medium">{name.split(" ")[0]}</div>
    </div>
  );
};

export default Profile;
