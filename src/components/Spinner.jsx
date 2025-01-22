import { useEffect } from "react";

export default function Spinner() {
    useEffect(() => {
        const timer = setTimeout(() => {
            const spinner = document.getElementById("spinner");
            if (spinner) {
                spinner.classList.remove("show");
            }
        }, 1000); // Ẩn spinner sau 1000ms
        return () => clearTimeout(timer); // Dọn dẹp timer
    }, []);

    return (
        <>
            <div
                id="spinner"
                className="show bg-white fixed inset-0 flex items-center justify-center z-50"
            >
                <div
                    className="animate-spin rounded-full border-4 border-primary border-t-transparent w-12 h-12"
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </>
    );
}
