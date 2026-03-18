-- ========================================================
-- PRIMERO: Eliminar triggers anteriores si existen
-- ========================================================
DROP TRIGGER IF EXISTS on_recommendation_change ON public.teacher_recommendation;
DROP TRIGGER IF EXISTS on_note_change ON public.note;

-- ========================================================
-- Trigger: teacher_recommendation -> actualiza course.updated_at
-- ========================================================
CREATE OR REPLACE FUNCTION update_course_timestamp_from_recommendation()
RETURNS TRIGGER
SECURITY DEFINER          -- Ejecuta con permisos del dueño (bypasea RLS)
SET search_path = public  -- Seguridad contra inyección de schema
AS $$
DECLARE
    target_course_id BIGINT;
BEGIN
    -- Determinar el course_id según la operación
    IF TG_OP = 'DELETE' THEN
        target_course_id := OLD.course_id;
    ELSE
        target_course_id := NEW.course_id;
    END IF;

    UPDATE public.course
    SET updated_at = now()
    WHERE id = target_course_id;

    -- AFTER triggers deben retornar NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_recommendation_change
AFTER INSERT OR UPDATE OR DELETE ON public.teacher_recommendation
FOR EACH ROW EXECUTE FUNCTION update_course_timestamp_from_recommendation();

-- ========================================================
-- Trigger: note -> actualiza course.updated_at y course.difficulty
-- ========================================================
CREATE OR REPLACE FUNCTION update_course_from_note()
RETURNS TRIGGER
SECURITY DEFINER          -- Ejecuta con permisos del dueño (bypasea RLS)
SET search_path = public  -- Seguridad contra inyección de schema
AS $$
DECLARE
    target_course_id BIGINT;
    majority_difficulty public.course_difficulty;
BEGIN
    -- Determinar el course_id según la operación
    IF TG_OP = 'DELETE' THEN
        target_course_id := OLD.course_id;
    ELSE
        target_course_id := NEW.course_id;
    END IF;

    -- Calcular la dificultad más votada para este curso
    SELECT define_difficulty INTO majority_difficulty
    FROM public.note
    WHERE course_id = target_course_id AND define_difficulty IS NOT NULL
    GROUP BY define_difficulty
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Actualizar dificultad y timestamp del curso
    UPDATE public.course
    SET 
        difficulty = majority_difficulty,
        updated_at = now()
    WHERE id = target_course_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_note_change
AFTER INSERT OR UPDATE OR DELETE ON public.note
FOR EACH ROW EXECUTE FUNCTION update_course_from_note();
