import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VideoBlock } from '@/components/VideoBlock';

export const ScreensPage: React.FC = () => {
    const [numScreens, setNumScreens] = useState(1);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        const popup = window.open('https://www.france.tv/', 'FranceTV', 'width=800,height=600');
        
        // Listen for popup close
        const checkPopup = setInterval(() => {
            if (popup?.closed) {
                clearInterval(checkPopup);
                setIsConnected(true);
            }
        }, 500);
    };

    return (
        <div className="h-full flex flex-col">
            <Helmet>
                <title>RGScreens | RG Multi screens</title>
                <link rel="canonical" href="https://rgscreens.app/" />
                <meta name="description"
                    content="Get the best RG Multi screens." />
                <meta name="keywords"
                    content="RG Multi screens" />
            </Helmet>
            
            <header className="p-4 border-b">
                <h1 className="text-2xl font-bold">RG Multi screens</h1>
            </header>

            <div className="flex-1 flex flex-col p-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-64">
                        <Slider
                            defaultValue={[1]}
                            max={6}
                            min={1}
                            step={1}
                            onValueChange={(value) => setNumScreens(value[0])}
                        />
                    </div>
                    <span className="text-lg font-medium">{numScreens} screens</span>
                    <Button onClick={handleConnect}>
                        {isConnected ? 'Connected' : 'Connect to France TV'}
                    </Button>
                </div>

                <div 
                    className="flex-1 grid gap-4"
                    style={{
                        gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(numScreens))}, 1fr)`,
                        gridTemplateRows: `repeat(${Math.ceil(numScreens / Math.ceil(Math.sqrt(numScreens)))}, 1fr)`,
                    }}
                >
                    {Array.from({ length: numScreens }).map((_, index) => (
                        <VideoBlock key={index} id={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScreensPage; 