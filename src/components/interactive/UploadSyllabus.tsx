import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { AddSyllabusModal } from '../AddSyllabusModal';
import { supabase } from '../../lib/supabaseClient';

export const UploadSyllabus = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
            }
        };
        getSession();
    }, []);

    const handleOpenModal = () => {
        if (!userId) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="
                    max-w-2xl w-full h-12
                    flex items-center justify-center gap-2
                    text-brand-dark font-bold text-sm
                    rounded-2xl
                    bg-brand-cyan hover:bg-brand-cyan-hover
                    transition-colors
                "
            >
                <Icon icon="mingcute:file-upload-line" className="text-lg" />
                Subir tu sílabo
            </button>

            <AddSyllabusModal
                show={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};