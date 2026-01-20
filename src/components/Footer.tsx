// src/components/Footer.tsx
import { Typography } from "@material-tailwind/react";

const Footer = () => {
    return (
        <footer className="w-full border-t border-blue-gray-50 p-8 mt-auto bg-blue-gray-50">
            <div className="container mx-auto text-center">
                <Typography color="blue-gray" className="font-normal">
                    &copy; 2026 Classic Mania Community. All Rights Reserved.
                </Typography>
                <Typography color="blue-gray" className="mt-1 font-normal text-sm">
                    MUJUKI-FireWorks | 경기도 오산시 원동로 | 클래식 이벤트 및 매칭 서비스
                </Typography>
            </div>
        </footer>
    );
};

export default Footer;