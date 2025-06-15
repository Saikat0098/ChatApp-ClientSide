import React from "react";

const About: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen   text-white">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg max-w-md text-center">
                Welcome to our chat application! We are dedicated to providing a seamless and enjoyable chatting experience for our users. Our team is constantly working to improve the platform and add new features. Thank you for being a part of our community!
            </p>
        </div>
    );
};

export default About;