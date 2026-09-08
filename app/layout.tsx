import type { Metadata } from "next";
import { Bricolage_Grotesque, Fustat } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin"],
});

const fustat = Fustat({
    variable: "--font-fustat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Diagnóstico de madurez de datos | DMA Analytics",
    description: "Evalúe la madurez analítica de su organización en pocos minutos.",
    icons: {
        icon: "/favicon.ico",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="h-full" suppressHydrationWarning>
            <body
                className={`
                    ${bricolage.variable}
                    ${fustat.variable}
                    h-full
                    min-h-screen
                    bg-black
                    text-cream
                    overflow-x-hidden
                `}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
