import { Play } from "lucide-react";

export function VideoDemo() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        See <span className="text-primary">OpsCopilot</span> in Action
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Watch how Nigerian SMBs are automating their operations, cutting costs, and growing profits in minutes.
                    </p>
                </div>

                <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-video mb-12 group cursor-pointer">
                    {/* Main Video Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700 to-blue-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Play className="h-8 w-8 text-primary fill-primary" />
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-left">
                        <p className="text-white font-semibold text-lg">The 5-Minute Setup</p>
                        <p className="text-white/80 text-sm">How to setup the autopilot for sales</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl overflow-hidden bg-gray-100 aspect-video relative group cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                            <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-green-400 to-green-600' : i === 2 ? 'from-blue-400 to-blue-600' : 'from-pink-400 to-pink-600'}`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pl-0.5 group-hover:bg-white transition-colors">
                                    <Play className="h-4 w-4 text-white group-hover:text-primary fill-white group-hover:fill-primary" />
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3 text-left">
                                <p className="text-white font-medium text-sm">Tutorial {i}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
