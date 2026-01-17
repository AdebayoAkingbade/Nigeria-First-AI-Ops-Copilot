import Link from "next/link";
import { Brain, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-950 text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary rounded-lg p-1.5">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">OpsCopilot</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your AI Operations Manager. Automating logistics, finance, and growth for African SMBs.
                        </p>
                        <div className="flex gap-4">
                            <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white">Features</Link></li>
                            <li><Link href="#" className="hover:text-white">Integration</Link></li>
                            <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white">Updates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} OpsCopilot. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
