export default function Layout({ children }: { children: React.ReactNode}) {
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col items-center justify-center max-w-[700px] w-4/5 leading-relaxed">
                {children}
            </div>
        </div>
    )
}