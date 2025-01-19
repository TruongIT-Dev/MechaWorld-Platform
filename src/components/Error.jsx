import { Link } from 'react-router-dom'
const Error = () => {
    return (
        <>
            <div className="container mx-auto py-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="max-w-lg">
                            <i className="text-6xl text-primary bi bi-exclamation-triangle"></i>
                            <h1 className="text-8xl font-bold">404</h1>
                            <h1 className="mb-4 text-2xl font-semibold">Page Not Found</h1>
                            <p className="mb-6 text-gray-600">
                                We’re sorry, the page you have looked for does not exist in our website! Maybe go to
                                our home page or try to use a search?
                            </p>
                            <Link
                                className="bg-primary text-white rounded-full py-3 px-6 transition hover:bg-primary-dark"
                                to="/"
                            >
                                Go Back To Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error