import { User as UserIcon } from "lucide-react";
import type { ProfileIconType } from "@/types";

interface ProfileAvatarProps {
    name: string;
    nickname?: string;
    profileImage?: string;
    profileIconType?: ProfileIconType;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const SIZE_MAP = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
};

const ICON_SIZE_MAP = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
};

const TEXT_SIZE_MAP = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
    xl: "text-2xl",
};

function getInitial(name: string, nickname?: string): string {
    const source = nickname || name;
    if (!source) return "U";
    // Check if starts with English letter
    const firstChar = source.charAt(0);
    if (/[a-zA-Z]/.test(firstChar)) {
        return firstChar.toUpperCase();
    }
    // For Korean names, use first character
    return firstChar;
}

const ProfileAvatar = ({
    name,
    nickname,
    profileImage,
    profileIconType = "default",
    size = "md",
    className = "",
}: ProfileAvatarProps) => {
    const sizeClass = SIZE_MAP[size];
    const iconSize = ICON_SIZE_MAP[size];
    const textSize = TEXT_SIZE_MAP[size];

    // If image type and has image
    if (profileIconType === "image" && profileImage) {
        return (
            <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
                <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // Initial type - show first letter of nickname/name
    if (profileIconType === "initial") {
        const initial = getInitial(name, nickname);
        return (
            <div className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 ${className}`}>
                <span className={`${textSize} font-bold text-white`}>{initial}</span>
            </div>
        );
    }

    // Default type - generic user icon
    return (
        <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${className}`}>
            <UserIcon className={`${iconSize} text-gray-500`} />
        </div>
    );
};

export default ProfileAvatar;
