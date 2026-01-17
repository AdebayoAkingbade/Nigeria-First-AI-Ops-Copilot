import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, FileText, Smartphone, Receipt, Lock, Info } from "lucide-react";

export default function UploadDataPage() {
    const providers = [
        { name: "Moniepoint", color: "bg-blue-600" },
        { name: "Opay", color: "bg-green-500" },
        { name: "Paystack", color: "bg-blue-400" },
        { name: "Flutterwave", color: "bg-orange-500" },
    ];

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload Your Financial Data</h1>
                <p className="text-muted-foreground mb-8">
                    Drag and drop your bank statements or POS reports. We'll extract transactions and generate insights automatically.
                </p>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group mb-8">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Drag & Drop Files Here</h3>
                    <p className="text-sm text-muted-foreground mb-6">or click to browse from your device</p>
                    <Button className="bg-primary hover:bg-primary/90 px-8">Choose Files</Button>
                    <p className="text-xs text-muted-foreground mt-4">Supported formats: PDF, CSV (Max 10MB per file)</p>
                </div>

                {/* Categories */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                        { title: "Bank Statements", sub: "PDF or CSV format", icon: <FileText className="h-6 w-6 text-white" />, color: "bg-purple-500" },
                        { title: "POS Reports", sub: "Moniepoint, Opay, Paystack", icon: <Smartphone className="h-6 w-6 text-white" />, color: "bg-green-500" },
                        { title: "Invoice Records", sub: "Optional for better insights", icon: <Receipt className="h-6 w-6 text-white" />, color: "bg-blue-600" },
                    ].map((cat, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl flex flex-col items-center text-center">
                            <div className={`h-10 w-10 ${cat.color} rounded-lg flex items-center justify-center mb-3 shadow-sm`}>
                                {cat.icon}
                            </div>
                            <h4 className="font-bold text-sm">{cat.title}</h4>
                            <p className="text-xs text-muted-foreground">{cat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Security Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 mb-8">
                    <div className="bg-blue-500 rounded-full p-1.5 mt-0.5 flex-shrink-0">
                        <Lock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-blue-900">Your Data is Secure</h4>
                        <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                            All files are encrypted during upload and storage. We use bank-level security to protect your financial information. Your data is never shared with third parties without your consent.
                        </p>
                    </div>
                </div>

                {/* Supported Providers */}
                <div className="mb-8">
                    <h4 className="font-semibold text-sm mb-4">Supported POS Providers</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {providers.map((p, i) => (
                            <div key={i} className="border rounded-lg p-4 flex flex-col items-center justify-center h-24 hover:border-gray-300 transition-colors">
                                <div className={`h-8 w-8 ${p.color} rounded-md flex items-center justify-center text-white font-bold mb-2`}>
                                    {p.name.charAt(0)}
                                </div>
                                <span className="text-xs font-semibold">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4">
                    <Button variant="outline" className="w-full sm:w-1/2 h-12" asChild>
                        <Link href="/onboarding/business-info">Skip for Now</Link>
                    </Button>
                    <Button className="w-full sm:w-1/2 h-12 bg-primary hover:bg-primary/90" asChild>
                        <Link href="/dashboard">Analyze My Data</Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl bg-yellow-50 p-6 flex flex-start gap-4 border border-yellow-100">
                <div className="bg-yellow-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-yellow-900">Tips for Better Results</h4>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-800 list-disc list-inside">
                        <li>Upload at least 3 months of data for more accurate insights</li>
                        <li>Include both bank statements and POS reports for complete analysis</li>
                        <li>Make sure files are clear and readable (not scanned images)</li>
                        <li>You can always add more data later from your dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
