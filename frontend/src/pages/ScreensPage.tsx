import React from 'react';

import { Helmet } from 'react-helmet-async';

export const ScreensPage: React.FC = () => {

    return (
        <main className="container mx-auto max-w-4xl">
            <Helmet>
                <title>RGScreens | RG Multi screens</title>
                <link rel="canonical" href="https://rgscreens.app/" />
                <meta name="description"
                    content="Get the best RG Multi screens." />
                <meta name="keywords"
                    content="RG Multi screens" />
            </Helmet>
            <section>
                <h1>RG Multi screens</h1>
            </section>
        </main>
    );
};

export default ScreensPage; 