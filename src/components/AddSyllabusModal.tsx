import * as React from 'react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from "@iconify/react";
import { readPdfText, type SyllabusData } from "../lib/read-pdf";
import { useCreateSyllabus } from "../hooks/useSyllabus";

interface SyllabusModalFieldProps {
    field: string;
    value: string | number | null;
}

const SyllabusModalField = ({ field, value }: SyllabusModalFieldProps) => {
    return (
        <div className="py-3 px-4 bg-brand-dark/50 border-b border-brand-cyan/10 last:border-0">
            <p className="text-gray-400 text-xs mb-1">{field}</p>
            <p className="text-white font-medium capitalize">{value}</p>
        </div>
    );
};

interface AddSyllabusModalProps {
    show: boolean;
    onClose: () => void;
}

export const AddSyllabusModal = ({ show, onClose }: AddSyllabusModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<SyllabusData | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createSyllabusMutation = useCreateSyllabus();

    if (!show) return null;

    const handleClose = () => {
        setSelectedFile(null);
        setError(null);
        setExtractedData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null);
        setExtractedData(null);

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.size > 1048576) {
            setError('El archivo excede 1MB');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setSelectedFile(file);
    };

    const handleExtractData = async () => {
        if (!selectedFile) {
            setError('Por favor selecciona un archivo PDF');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await readPdfText(selectedFile);

            if (data) {
                setExtractedData(data);
                console.log('✅ Datos extraídos del sílabo:', data);
            } else {
                setError('No se pudieron extraer los datos del PDF');
            }
        } catch (err) {
            console.error('Error al procesar PDF:', err);
            setError(err instanceof Error ? err.message : 'Error al leer el PDF. Intenta con otro archivo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!extractedData || !selectedFile) {
            setError('No hay datos para confirmar');
            return;
        }

        setError(null);

        createSyllabusMutation.mutate(
            { 
                syllabus: {
                    courseCode: extractedData.courseCode,
                    academicCode: extractedData.academicCode ?? undefined
                }, 
                file: selectedFile 
            },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: (err) => {
                    setError(err.message || 'Error al guardar el sílabo');
                }
            }
        );
    };

    const isProcessing = isLoading || createSyllabusMutation.isPending;

    return createPortal(
            <div className="
                fixed inset-0 z-9999
                flex items-center justify-center 
                w-dvw h-dvh overflow-hidden
            ">
                <div
                    className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm cursor-pointer"
                    onClick={(e) => {
                        // Prevent closing when clicking inner modal content
                        if (e.target === e.currentTarget && !isProcessing) {
                            handleClose();
                        }
                    }}
                />
                <div className="relative w-11/12 max-w-md bg-brand-dark/95 border border-brand-cyan/20 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-6 items-center">
                    <button
                        className="absolute top-4 right-4 text-brand-cyan/50 hover:text-brand-cyan transition-colors"
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        <Icon icon="mingcute:close-fill" className="text-2xl" />
                    </button>

                    <div className="text-center space-y-2 w-full">
                        <h2 className="text-2xl font-bold text-white">Agrega un Sílabo</h2>
                        <p className="text-gray-400 text-sm">Peso máximo 1MB y formato PDF.</p>
                    </div>

                    {!extractedData ? (
                        <div className="w-full flex flex-col gap-4 items-center">
                            <div className="w-full flex items-center justify-center">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-cyan/20 border-dashed rounded-xl cursor-pointer bg-brand-cyan/5 hover:bg-brand-cyan/10 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Icon icon="mingcute:upload-2-line" className="w-8 h-8 mb-3 text-brand-cyan/60" />
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold text-brand-cyan">Haz clic</span> o arrastra el PDF
                                        </p>
                                    </div>
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                    />
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="w-full p-3 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl flex items-center gap-3">
                                    <Icon icon="mingcute:pdf-fill" className="text-red-400 text-xl shrink-0" />
                                    <span className="text-sm text-white font-medium truncate shrink">
                                        {selectedFile.name}
                                    </span>
                                    <button 
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if(fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="ml-auto text-gray-400 hover:text-white shrink-0"
                                        disabled={isProcessing}
                                    >
                                        <Icon icon="mingcute:close-circle-line" className="text-lg" />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm">
                                    <Icon icon="mingcute:warning-line" className="text-lg shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                className="w-full h-12 flex items-center justify-center gap-2 bg-brand-cyan text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-cyan-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                onClick={handleExtractData}
                                disabled={!selectedFile || isProcessing}
                            >
                                {isProcessing ? (
                                    <><Icon icon="mingcute:loading-line" className="animate-spin text-lg" /> Procesando...</>
                                ) : (
                                    <><Icon icon="mingcute:magic-2-line" className="text-lg" /> Extraer Datos</>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full space-y-4">
                            <div className="w-full p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-500/90 text-xs md:text-sm"> 
                                <Icon icon="mingcute:time-line" className="text-lg shrink-0" />
                                <p>Esto puede tomar unos segundos mientras escaneamos el documento.</p>
                            </div>
                            <h3 className="text-brand-cyan font-bold flex items-center gap-2 shrink-0">
                                <Icon icon="mingcute:check-circle-fill" className="text-lg" />
                                Datos Extraídos
                            </h3>
                            
                            <div className="w-full bg-brand-cyan/5 border border-brand-cyan/10 rounded-xl overflow-hidden flex flex-col">
                                <SyllabusModalField field="Código de Curso" value={extractedData.courseCode} />
                                <SyllabusModalField field="Periodo Académico" value={extractedData.academicCode} />
                            </div>
                            
                            {error && (
                                <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex gap-2">
                                    <Icon icon="mingcute:warning-line" className="text-lg shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    className="flex-1 py-3 px-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                                    onClick={() => {
                                        setExtractedData(null);
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    disabled={isProcessing}
                                >
                                    Volver a cargar
                                </button>
                                <button
                                    className="flex-1 py-3 px-4 bg-brand-cyan text-brand-dark font-bold rounded-xl hover:bg-brand-cyan-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <><Icon icon="mingcute:loading-line" className="animate-spin text-lg" /> Guardando...</>
                                    ) : (
                                        <><Icon icon="mingcute:check-line" className="text-lg" /> Confirmar</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>,
            document.body
        );
};