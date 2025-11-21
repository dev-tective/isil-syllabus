import { SupabaseProvider } from "./contexts/SupabaseContext.tsx"
import SyllabusFilterOptions, {type OptionType} from "./components/SyllabusFilterOptions.tsx";
import useSyllabus from "./components/hooks/useSyllabus.ts";
import SyllabusCard from "./components/SyllabusCard.tsx";
import * as React from "react";
import AddSyllabusModal from "./components/AddSyllabusModal.tsx";
import {useState} from "react";

const semesterOptions: OptionType[] = [
    { value: "1", label: "Verano" },
    { value: "2", label: "Regular 1" },
    { value: "3", label: "Regular 2" },
]

function AppContent() {
    const {
        totalYears,
        error,
        syllables,
        loading,
        getAllSyllabus,
        setName,
        setSemesters,
        setYears
    } = useSyllabus();
    const [showModal, setShowModal] = useState(false);

    const yearsOption = totalYears.map(option => ({
        value: String(option),
        label: String(option),
    }))

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <main className={'bg-gray-800 min-h-screen'}>
            <AddSyllabusModal
                show={showModal}
                onClose={() => setShowModal(false)}
            />
            <div className={'sticky top-0 bg-gray-800'}>
                <header className={'flex justify-between w-full bg-gray-900 py-3 px-5 text-white font-bold'}>
                    <h1 className={'text-3xl'}>
                        <strong className={'text-cyan-400 '}>ISIL</strong> Syllabus
                    </h1>
                    <button
                        title={'Agregar Sílabo'}
                        className={'btn-primary py-2 px-3'}
                        onClick={() => setShowModal(true)}
                    >+ Sílabo</button>
                </header>
                <section className={'flex flex-wrap justify-center gap-3 py-6'}>
                    <input
                        onChange={handleNameChange}
                        type={'text'}
                        className={'placeholder:text-white/50 text-white bg-gray-600 py-2 px-6 rounded-lg min-w-48 w-[30dvw]'}
                        placeholder={'Buscar por nombre del curso'}
                    />
                    <SyllabusFilterOptions
                        placeholder={'Años'}
                        options={yearsOption}
                        setFilterValue={setYears}
                    />
                    <SyllabusFilterOptions
                        placeholder={'Semestres'}
                        options={semesterOptions}
                        setFilterValue={setSemesters}
                    />
                </section>
            </div>
            <div className={'w-full h-fit flex justify-center flex-wrap gap-5 pb-7'}>
                {error && (
                    <h1 className={'text-red-500 text-xl font-bold mt-5 text-center'}>{error}</h1>
                )}
                {loading && !error && (
                    <h1 className={'text-white text-xl font-bold mt-5'}>Cargando...</h1>
                )}
                {!loading && !error && syllables.map((syllabus, index) => (
                    <SyllabusCard key={index} syllabus={syllabus} />
                ))}
            </div>
            <section className={`flex gap-3 fixed z-20 right-5 bottom-5`}>
                <button
                    disabled={loading}
                    className={'btn-primary rounded-xl p-3 text-3xl'}
                    onClick={getAllSyllabus}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4.75 10.75h-3m12.5-2c0 3-2.79822 5.5-6.25 5.5-3.75 0-6.25-3.5-6.25-3.5v3.5m9.5-9h3m-12.5 2c0-3 2.79822-5.5 6.25-5.5 3.75 0 6.25 3.5 6.25 3.5v-3.5"/></svg>
                </button>
            </section>
        </main>
    )
}

function App() {
    return (
        <SupabaseProvider>
            <AppContent />
        </SupabaseProvider>
    )
}

export default App