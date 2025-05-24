
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <main className="flex">
            <div className="w-full">
                {children}
            </div>
        </main>
    );
}
