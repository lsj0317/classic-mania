// src/material-tailwind.d.ts
import "@material-tailwind/react";

declare module "@material-tailwind/react" {
    interface NavbarProps {
        placeholder?: any;
        onPointerEnterCapture?: any;
        onPointerLeaveCapture?: any;
    }
    interface TypographyProps {
        placeholder?: any;
        onPointerEnterCapture?: any;
        onPointerLeaveCapture?: any;
    }
    interface ButtonProps {
        placeholder?: any;
        onPointerEnterCapture?: any;
        onPointerLeaveCapture?: any;
    }
}