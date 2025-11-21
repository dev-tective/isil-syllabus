import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/
pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface SyllabusData {
    courseCode: number;
    academicCode: string | null;
}

export const readPdfText = async (file: File): Promise<SyllabusData | null> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    const sortedItems = textContent.items.sort((a: any, b: any) => {
        if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
            return b.transform[5] - a.transform[5];
        }
        return a.transform[4] - b.transform[4];
    });

    const pageText = sortedItems
        .map((item: any) => item.str)
        .join(' ');

    const getCourseCode = (): number => {
        // Busca "Código de la unidad didáctica:" y captura los números que siguen
        const regex = /Código de la unidad didáctica\s*:\s*(\d+)/;
        const match = pageText.match(regex);

        return match ? Number.parseInt(match[1]) : 0;
    };

    const getPeriodAcademic = (): string | null => {
        // Intenta primero con "Periodo académico"
        let regex = /Periodo académico\s*:\s*([\d\s\-]+)/;
        let match = pageText.match(regex);

        // Si no encuentra, intenta con "Periodo"
        if (!match) {
            regex = /Periodo\s*:\s*([\d\s\-]+)/;
            match = pageText.match(regex);
        }

        if (!match) return null;

        // Eliminar espacios y caracteres no numéricos excepto el guion
        let cleanedValue = match[1].replace(/[^\d\-]/g, '');

        // Si tiene formato YYYY-N (ej: 2025-1), convertir a YYYYN0 (ej: 202510)
        if (/^\d{4}-[12]$/.test(cleanedValue)) {
            cleanedValue = cleanedValue.replace('-', '') + '0';
        } else {
            // Si no tiene ese formato, solo eliminar todo lo que no sea dígito
            cleanedValue = cleanedValue.replace(/\D/g, '');
        }

        return cleanedValue || null;
    };

    // Mapear a la interfaz SyllabusData
    return {
        courseCode: getCourseCode(),
        academicCode: getPeriodAcademic()
    };
};