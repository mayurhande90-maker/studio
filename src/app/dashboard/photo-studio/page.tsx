'use client';

export const dynamic = 'force-dynamic';
// Remove or DO NOT export `revalidate` as an object here.
// If you need revalidation put a number OR `false`. For now remove it entirely
// or set it to a single numeric value (example: 0 or 60).
// export const revalidate = 0;

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Download, Sparkles, Loader2, UploadCloud, RefreshCw, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';
import { EnhanceUploadedImageOutput, EnhanceUploadedImageInput, ProductImageAnalysis } from '@/ai/flows/enhance-uploaded-image';
import { enhanceUploadedImage } from '@/ai/flows/enhance-uploaded-image';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/use-user';


const generationMessages = [
    { text: "Analyzing product...", percentage: 10 },
    { text: "Enhancing lighting...", percentage: 30 },
    { text: "Creating cinematic scene...", percentage: 60 },
    { text: "Polishing details...", percentage: 80 },
    { text: "Finalizing your image...", percentage: 95 },
];

const GENERATION_COST = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AIPhotoStudioPage() {
    const [file, setFile] = useState<{blob: Blob, dataUri: string} | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false); // This state will now represent the whole generation process start
    const [generationStep, setGenerationStep] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<EnhanceUploadedImageOutput['analysis'] | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    const [postGenerationAnalysis, setPostGenerationAnalysis] = useState<EnhanceUploadedImageOutput['postGenerationAnalysis'] | null>(null);
    
    const outputRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const { credits, deductCredits } = useCredits();
    const { user } = useUser();
    
    const handleReset = useCallback(() => {
        setFile(null);
        setPreview(null);
        setGeneratedImage(null);
        setAnalysisResult(null);
        setPostGenerationAnalysis(null);
        setIsGenerating(false);
        setIsAnalyzing(false);
        setGenerationProgress(0);
    }, []);
    
    const compressImage = (file: File): Promise<{blob: Blob, dataUri: string}> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject(new Error('Could not get canvas context'));

                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Compress to 80% quality JPEG

                    canvas.toBlob((blob) => {
                         if (!blob) return reject(new Error('Canvas to Blob conversion failed'));
                         resolve({ blob, dataUri: dataUrl });
                    }, 'image/jpeg', 0.8);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };


    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.errors[0].code === 'file-too-large') {
                toast({
                    variant: 'destructive',
                    title: 'Upload Failed',
                    description: `File is larger than 5MB. Please upload a smaller image.`,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Upload Failed',
                    description: rejection.errors[0].message,
                });
            }
            return;
        }

        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            handleReset();
            setIsAnalyzing(true); // Indicate processing starts now
            setAnalysisResult(null); // Reset previous analysis

            try {
                 const compressedFile = await compressImage(selectedFile);
                 setFile(compressedFile);
                 const objectUrl = URL.createObjectURL(compressedFile.blob);
                 setPreview(objectUrl);
            } catch (error) {
                console.error("Image compression error:", error);
                toast({
                    variant: 'destructive',
                    title: 'Upload Failed',
                    description: 'Could not process the image. Please try another one.',
                });
                 setIsAnalyzing(false);
            }
        }
    }, [toast, handleReset]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false,
        maxSize: MAX_FILE_SIZE,
        noClick: true, // We'll trigger the file dialog manually
    });
    
    
    const handleGenerate = async () => {
        if (!file) return;
        if (credits === null || credits < GENERATION_COST) {
            setShowInsufficientCredits(true);
            return;
        }

        setIsGenerating(true);
        setIsAnalyzing(false); // Analysis is part of generation now
        setGeneratedImage(null);
        setPostGenerationAnalysis(null);
        setGenerationStep(0);
        setGenerationProgress(0);
        
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });

        const stepInterval = setInterval(() => {
            setGenerationStep(prev => {
                const nextStep = (prev + 1) % generationMessages.length;
                setGenerationProgress(generationMessages[nextStep].percentage);
                return nextStep;
            });
        }, 2000);

        try {
            const input: EnhanceUploadedImageInput = { photoDataUri: file.dataUri, mimeType: 'image/jpeg' };
            const result: EnhanceUploadedImageOutput = await enhanceUploadedImage(input);

            setAnalysisResult(result.analysis);
            setGeneratedImage(result.enhancedPhotoDataUri);
            setPostGenerationAnalysis(result.postGenerationAnalysis);
            deductCredits(GENERATION_COST);
            setGenerationProgress(100);
            toast({
                title: 'Success! Image Generated',
                description: `${GENERATION_COST} credits were deducted.`,
            });
        } catch (error: any) {
            console.error('Generation Error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: error.message || 'Something went wrong. Please try again.',
            });
        } finally {
            clearInterval(stepInterval);
            setIsGenerating(false);
        }
    };
    
    const handleRegenerate = () => {
        setGeneratedImage(null);
        setPostGenerationAnalysis(null);
        handleGenerate();
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'magicpixa-studio-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Use effect to automatically trigger generation after file is processed
    useEffect(() => {
        if (file && preview && !isGenerating) {
            handleGenerate();
        }
    }, [file, preview]);


    return (
        <div className="w-full space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gradient">AI Photo Studio</h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Transform your raw product photo into a hyper-realistic image ready to post.
                </p>
            </div>

            <div ref={outputRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <Card className="rounded-3xl shadow-lg overflow-hidden bg-background flex-1">
                    <CardContent className="p-0 relative h-full flex items-center justify-center min-h-[450px]">
                        <input {...getInputProps()} />
                        {preview && (
                            <Image 
                                src={generatedImage || preview} 
                                alt={generatedImage ? "Generated" : "Preview"}
                                fill
                                objectFit="cover"
                                className={cn('transition-all duration-500', {
                                    'blur-lg scale-105': isGenerating,
                                })}
                            />
                        )}
                        
                        {(isGenerating || isAnalyzing) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-8 text-center">
                                <ImageIcon className="w-16 h-16 text-primary animate-pulse" />
                                <p className="font-bold text-2xl text-primary-foreground mt-4">{isAnalyzing ? "Processing upload..." : generationMessages[generationStep].text}</p>
                                <p className="text-muted-foreground mt-2">{isAnalyzing ? "Getting your image ready." : "Our AI is creating magic. Please wait a moment."}</p>
                                {isGenerating && <Progress value={generationProgress} className="w-3/4 mt-6 h-3" />}
                                {isGenerating && <p className="text-primary-foreground font-mono text-sm mt-2">{generationProgress}%</p>}
                            </div>
                        )}

                        {preview && !generatedImage && !isGenerating && !isAnalyzing && (
                            <div className="absolute top-4 right-4 z-10">
                                <Button onClick={open} variant="outline" size="icon" className="rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 text-white">
                                    <Upload className="h-5 w-5" />
                                    <span className="sr-only">Upload new image</span>
                                </Button>
                            </div>
                        )}

                        {generatedImage && !isGenerating && (
                            <div className="absolute top-4 right-4 z-10">
                                <Button onClick={handleRegenerate} variant="outline" size="icon" className="rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 text-white">
                                <RefreshCw className="h-5 w-5" />
                                <span className="sr-only">Regenerate</span>
                                </Button>
                            </div>
                        )}
                        
                        {!preview && (
                            <div
                                {...getRootProps({
                                    onClick: (event) => event.stopPropagation(),
                                    className: cn(
                                        'flex flex-col items-center justify-center text-center p-12 rounded-3xl cursor-pointer transition-all duration-300 w-full h-full hover-gradient-border',
                                        isDragActive ? 'bg-primary/10' : 'border-border',
                                        'border-2 border-dashed'
                                    )
                                })}
                                onClick={open}
                            >
                                <UploadCloud className="w-16 h-16 text-primary mb-4" />
                                <p className="text-xl font-bold">Drop your product photo here</p>
                                <p className="text-muted-foreground">or click to upload (JPG, PNG, max 5MB)</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col space-y-6">
                    <Card className="rounded-3xl shadow-lg bg-background">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4 rounded-2xl min-h-[90px]">
                                <Sparkles className={cn("w-6 h-6 text-yellow-500 flex-shrink-0 mt-1", { 'animate-pulse': isGenerating || isAnalyzing })} />
                                <div className="space-y-1 w-full">
                                    {(isGenerating || isAnalyzing) ? (
                                        <p className="font-semibold text-foreground animate-pulse">
                                            {isAnalyzing ? "Analyzing your photo..." : "Generating your masterpiece..."}
                                        </p>
                                    ) : postGenerationAnalysis ? (
                                        <>
                                            <p className="font-semibold text-foreground">
                                                {postGenerationAnalysis.description}
                                            </p>
                                            <div className="text-xs text-muted-foreground">
                                                <strong>Marketing Tip:</strong> {postGenerationAnalysis.marketingTip}
                                            </div>
                                        </>
                                    ) : (
                                            <>
                                            <p className="font-semibold text-foreground">
                                                {analysisResult ? analysisResult.friendlyCaption : 'Upload a clear, front-facing photo for best results.'}
                                            </p>
                                            {analysisResult && (
                                            <div className="text-xs text-muted-foreground">
                                                <span>Detected: <strong>{analysisResult.productType}</strong></span> | <span>Quality: <strong>{analysisResult.imageQuality}</strong></span>
                                            </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl shadow-lg flex-1">
                        <CardHeader>
                                <CardTitle className="text-2xl font-bold">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {generatedImage && !isGenerating ? (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button onClick={handleDownload} size="lg" className="rounded-2xl">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                        <Button onClick={handleReset} variant="secondary" size="lg" className="rounded-2xl">
                                            <UploadCloud className="mr-2 h-4 w-4" />
                                            Start New
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                            <>
                                <Button onClick={handleGenerate} variant="gradient" size="lg" className="w-full font-bold text-lg py-7 rounded-2xl hover:shadow-lg hover:shadow-primary/40" disabled={!file || isGenerating || isAnalyzing}>
                                    {(isGenerating || isAnalyzing) ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating Magic...
                                        </>
                                    ) : (
                                        <>
                                            Generate Image <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-sm text-muted-foreground">
                                    This will cost {GENERATION_COST} credits.
                                </p>
                            </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={showInsufficientCredits} onOpenChange={setShowInsufficientCredits}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Insufficient Credits</AlertDialogTitle>
                        <AlertDialogDescription>
                            You do not have enough credits to generate this image. Please recharge your credits to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowInsufficientCredits(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
