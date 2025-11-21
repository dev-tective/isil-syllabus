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
        // Buscar número de 5 dígitos que empiece con 3 (30000-39999)
        const regex = /3\d{4}/;
        const match = pageText.match(regex);

        return match ? Number.parseInt(match[0]) : 0;
    };

    const getPeriodAcademic = (): string | null => {
        // MÉTODO 1: Buscar año 20XX seguido de números, guiones o espacios
        const regex = /20\d{2}[\d\-\s]*/;
        let match = pageText.match(regex);

        if (match) {
            // Eliminar espacios y todo lo que no sea dígito o guion
            let cleanedValue = match[0].replace(/[^\d\-]/g, '');

            // Si tiene formato YYYY-N (ej: 2025-1, 2021-0), convertir a YYYYN0 (ej: 202510, 202100)
            if (/^\d{4}-\d$/.test(cleanedValue)) {
                cleanedValue = cleanedValue.replace('-', '') + '0';
            } else {
                // Eliminar guiones restantes y tomar solo los primeros 6 dígitos
                cleanedValue = cleanedValue.replace(/-/g, '').substring(0, 6);
            }

            if (cleanedValue.length === 6) {
                return cleanedValue;
            }
        }

        // MÉTODO 2: Si no encontró nada, buscar después de "Periodo académico"
        const periodRegex = /periodo[\s\S]{0,20}acad[\s\S]{0,10}mico[\s\S]{0,5}:?/gi;
        let periodIndex = pageText.search(periodRegex);

        // Si no encuentra "Periodo académico", buscar solo "Periodo"
        if (periodIndex === -1) {
            const simpleRegex = /periodo[\s\S]{0,5}:?/gi;
            periodIndex = pageText.search(simpleRegex);
        }

        if (periodIndex !== -1) {
            // Obtener los siguientes 50 caracteres después de "Periodo"
            const afterPeriod = pageText.substring(periodIndex).substring(0, 50);

            // Extraer TODOS los dígitos (eliminando cualquier carácter no numérico)
            const digitsOnly = afterPeriod.replace(/[^\d]/g, '');

            // Buscar patrón 20XXXX (6 dígitos que empiecen con 20)
            const periodMatch = digitsOnly.match(/20\d{4}/);

            if (periodMatch) {
                return periodMatch[0];
            }
        }

        return null;
    };

    // Mapear a la interfaz SyllabusData
    return {
        courseCode: getCourseCode(),
        academicCode: getPeriodAcademic()
    };
};