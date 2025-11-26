import * as React from 'react';
import { useRef, useState } from 'react';
import { readPdfText, type SyllabusData } from "../lib/read-pdf.ts";
import useSyllabus from "./hooks/useSyllabus.ts";

interface AddSyllabusModalProps {
    show: boolean;
    onClose: () => void;
}

interface SyllabusModalFieldProps {
    field: string;
    value: string | number | null;
}

const SyllabusModalField = ({ field, value }: SyllabusModalFieldProps) => {
    return (
        <div className="py-2 pl-4 bg-gray-800">
            <p className="text-gray-400 text-xs">{field}</p>
            <p className="font-medium capitalize">{value}</p>
        </div>
    );
};

const AddSyllabusModal = ({ show, onClose }: AddSyllabusModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<SyllabusData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { createSyllabus, loading: syllabusLoading } = useSyllabus();

    if (!show) return null;

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

    const handleSubmit = async () => {
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

    const handleClose = () => {
        setSelectedFile(null);
        setError(null);
        setExtractedData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    const handleConfirm = async () => {
        if (!extractedData || !selectedFile) {
            setError('No hay datos para confirmar');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('📤 Subiendo sílabo...');
            const result = await createSyllabus(extractedData, selectedFile);

            if (result) {
                console.log('✅ Sílabo creado exitosamente:', result);
                // Cerrar el modal y limpiar todo
                handleClose();
            } else {
                setError('Error al crear el sílabo. Por favor intenta nuevamente.');
            }
        } catch (err) {
            console.error('Error al crear sílabo:', err);
            setError(err instanceof Error ? err.message : 'Error al guardar el sílabo');
        } finally {
            setIsLoading(false);
        }
    };

    // Combinar estados de carga
    const isProcessing = isLoading || syllabusLoading;

    return (
        <div className={'fixed z-50 w-screen h-screen flex items-center justify-center'}>
            <div
                className={'h-full w-full bg-gray-950/50 absolute -z-1 backdrop-blur-sm'}
                onClick={handleClose}
            />
            <div className={'rounded-xl relative min-w-72 w-1/3 max-h-[90vh] overflow-y-auto bg-gray-800 p-4 text-center text-white flex flex-col gap-4 items-center'}>
                <h1 className={'text-cyan-400 text-2xl font-bold'}>Agrega un Sílabo</h1>
                <p className={'text-md'}>Peso máximo 1MB y formato PDF.</p>

                <input
                    ref={fileInputRef}
                    className={'text-sm bg-gray-500 w-1/2 min-w-60 rounded-lg py-1 px-2'}
                    type={'file'}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />

                {selectedFile && !extractedData && (
                    <p className={'text-sm text-green-400'}>
                        ✓ {selectedFile.name}
                    </p>
                )}

                {error && (
                    <p className={'text-sm text-red-400'}>⚠ {error}</p>
                )}

                {!extractedData ? (
                    <button
                        className={'btn-primary py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed'}
                        onClick={handleSubmit}
                        disabled={!selectedFile || isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : 'Extraer Datos'}
                    </button>
                ) : (
                    <div className="w-11/12 space-y-3 text-start">
                        <h2 className="text-lg font-bold text-cyan-400">Datos Extraídos:</h2>
                        <div className="w-full bg-gray-600 rounded-2xl flex flex-col gap-[1px] overflow-hidden">
                            <SyllabusModalField
                                field={"Código"}
                                value={extractedData.courseCode}
                            />
                            <SyllabusModalField
                                field={"Periodo académico"}
                                value={extractedData.academicCode}
                            />
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button
                                className={'bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'}
                                onClick={handleConfirm}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Guardando...' : 'Confirmar'}
                            </button>
                            <button
                                className={'bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg transition-colors disabled:opacity-50'}
                                onClick={() => {
                                    setExtractedData(null);
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                disabled={isProcessing}
                            >
                                Volver a cargar
                            </button>
                        </div>
                    </div>
                )}

                <button
                    className={'hover:text-gray-200 absolute text-2xl font-bold right-3 top-2'}
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default AddSyllabusModal;