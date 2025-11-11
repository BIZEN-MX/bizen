-- =====================================================
-- UPDATE PROFESSIONS TO SPANISH
-- Translate profession names and descriptions
-- =====================================================

-- Update professions with Spanish names and descriptions
UPDATE professions SET name = 'Conserje', description = 'Comienzos humildes, ingresos más bajos pero también gastos más bajos' WHERE id = 1;
UPDATE professions SET name = 'Secretaria', description = 'Profesional administrativa con ingresos moderados' WHERE id = 2;
UPDATE professions SET name = 'Profesor', description = 'Educador con ingresos estables y deuda moderada' WHERE id = 3;
UPDATE professions SET name = 'Camionero', description = 'Trabajador de cuello azul con buenos ingresos' WHERE id = 4;
UPDATE professions SET name = 'Mecánico', description = 'Profesional de oficio especializado' WHERE id = 5;
UPDATE professions SET name = 'Enfermera', description = 'Profesional de la salud con ingresos moderados y deuda' WHERE id = 6;
UPDATE professions SET name = 'Policía', description = 'Servidor público con ingresos estables' WHERE id = 7;
UPDATE professions SET name = 'Ingeniero', description = 'Profesional técnico con mayores ingresos y deuda' WHERE id = 8;
UPDATE professions SET name = 'Abogado', description = 'Profesional de altos ingresos con deuda significativa' WHERE id = 9;
UPDATE professions SET name = 'Doctor', description = 'Mayores ingresos pero también mayores gastos y deuda' WHERE id = 10;
UPDATE professions SET name = 'Piloto de Avión', description = 'Altos ingresos con gastos significativos' WHERE id = 11;
UPDATE professions SET name = 'Gerente de Negocios', description = 'Profesional corporativo con buenos ingresos' WHERE id = 12;

-- =====================================================
-- Run this in Supabase SQL Editor to translate professions
-- =====================================================

