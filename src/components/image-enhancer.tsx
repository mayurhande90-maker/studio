'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Loader2,
  Sparkles,
  Download,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { enhanceUploadedImage } from '@/ai/flows/enhance-uploaded-image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from './ui/alert';

export function ImageEnhancer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setEnhancedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleEnhance = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await enhanceUploadedImage({ photoDataUri: originalImage });
      if (result.enhancedPhotoDataUri) {
        setEnhancedImage(result.enhancedPhotoDataUri);
      } else {
        throw new Error('Enhancement failed to produce an image.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Enhancement Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'magicpixa_enhanced.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="p-6 md:p-8">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center">
          MagicPixa AI Enhancer
        </DialogTitle>
        <DialogDescription className="text-center text-lg mt-2">
          Upload a photo to see the magic happen.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6">
        {!originalImage && (
          <div
            {...getRootProps()}
            className={cn(
              'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {isDragActive
                ? 'Drop the image here...'
                : "Drag 'n' drop an image here, or click to select"}
            </p>
          </div>
        )}

        {originalImage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md bg-muted flex items-center justify-center">
                 <Image
                    src={originalImage}
                    alt="Original"
                    fill
                    className="object-contain"
                  />
                 <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 text-sm rounded-full">Original</div>
              </div>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md bg-muted flex items-center justify-center">
                {isLoading && (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="mt-4 font-medium">Enhancing...</p>
                  </div>
                )}
                {enhancedImage && !isLoading && (
                  <>
                    <Image
                      src={enhancedImage}
                      alt="Enhanced"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute top-2 left-2 text-gradient bg-primary-foreground/80 px-3 py-1 text-sm rounded-full font-bold">Enhanced</div>
                  </>
                )}
                {!isLoading && !enhancedImage && (
                  <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                    <ImageIcon className="w-12 h-12" />
                    <p className="mt-4 font-medium">Your enhanced image will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!enhancedImage ? (
                <Button
                  onClick={handleEnhance}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Processing...' : 'Enhance Image'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity rounded-xl shadow-lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download
                  </Button>
                   <Button onClick={handleReset} variant="outline" size="lg" className="w-full rounded-xl">
                    <X className="mr-2 h-5 w-5" />
                    Start Over
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
