import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ReportData {
    school: string
    kpis: {
        totalStudents: number
        avgModulesCompleted: number
        totalCompletedLessons: number
        avgAttemptsPerQuiz: number
        institutionalROI: number
        diagnosticStats: {
            avgScore: number
            participation: number
            strengths: string[]
            weaknesses: string[]
        }
        currentQuizAvg: number
        nationalAvg: number
    }
    students: any[]
}

export const generateImpactReport = (data: ReportData) => {
    const doc = new jsPDF()
    const { school, kpis } = data
    const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })

    // --- Estilos Base ---
    const primaryColor = [15, 98, 254] // BIZEN Blue
    const accentColor = [124, 58, 237] // Purple
    const textColor = [30, 41, 59]
    const lightText = [148, 163, 184]

    // --- Header ---
    doc.setFillColor(15, 23, 42) // Dark Blue background for header
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('REPORTE EJECUTIVO DE IMPACTO', 20, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Institución: ${school.toUpperCase()}`, 20, 30)
    doc.text(`Fecha de emisión: ${date}`, 140, 30)

    // --- 1. Resumen General ---
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(16)
    doc.text('Resumen de Participación', 20, 55)
    
    const summaryData = [
        ['Alumnos Inscritos', kpis.totalStudents.toString()],
        ['Lecciones Completadas', kpis.totalCompletedLessons.toString()],
        ['Promedio de Módulos', `${kpis.avgModulesCompleted} por alumno`],
        ['Eficiencia (Intentos/Quiz)', kpis.avgAttemptsPerQuiz.toString()]
    ]

    ;(doc as any).autoTable({
        startY: 60,
        head: [['Métrica', 'Resultado']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 20, right: 20 }
    })

    // --- 2. Impacto de Aprendizaje (IQ Financiero) ---
    const lastY = (doc as any).lastAutoTable.finalY + 20
    doc.setFontSize(16)
    doc.text('Impacto de Aprendizaje (IQ Financiero)', 20, lastY)
    
    doc.setFontSize(10)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('Comparativa entre el Diagnóstico Inicial y el desempeño en Quizzes actuales.', 20, lastY + 6)

    const initialIQ = kpis.diagnosticStats.avgScore
    const currentIQ = kpis.currentQuizAvg
    const increment = initialIQ > 0 ? (((currentIQ - initialIQ) / initialIQ) * 100).toFixed(1) : '100+'

    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(30)
    doc.text(`+${increment}%`, 20, lastY + 25)
    doc.setFontSize(12)
    doc.text('Incremento Promedio de Retención', 65, lastY + 23)

    // Bars for visual comparison
    const barWidth = 120
    const startX = 20
    const barY = lastY + 35

    // Initial IQ bar
    doc.setFillColor(241, 245, 249)
    doc.rect(startX, barY, barWidth, 6, 'F')
    doc.setFillColor(148, 163, 184)
    doc.rect(startX, barY, (initialIQ / 100) * barWidth, 6, 'F')
    doc.setFontSize(9)
    doc.text(`IQ Inicial: ${initialIQ}%`, startX + barWidth + 5, barY + 5)

    // Current IQ bar
    doc.setFillColor(241, 245, 249)
    doc.rect(startX, barY + 12, barWidth, 6, 'F')
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(startX, barY + 12, (currentIQ / 100) * barWidth, 6, 'F')
    doc.text(`IQ Actual: ${currentIQ}%`, startX + barWidth + 5, barY + 17)

    // --- 3. ROI Institucional & Simulador ---
    const roiY = barY + 35
    doc.setFontSize(16)
    doc.text('Retorno de Inversión (Simulador de Bolsa)', 20, roiY)
    
    const roiColor = kpis.institutionalROI >= 0 ? [5, 150, 105] : [220, 38, 38]
    doc.setTextColor(roiColor[0], roiColor[1], roiColor[2])
    doc.setFontSize(28)
    doc.text(`${kpis.institutionalROI >= 0 ? '+' : ''}${kpis.institutionalROI}%`, 20, roiY + 15)
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(10)
    doc.text('ROI Promedio Institucional sobre capital inicial simulado ($10,000 USD/alumno).', 20, roiY + 22)

    // --- 4. Fortalezas de la Generación ---
    const strengthsY = roiY + 45
    doc.setFontSize(16)
    doc.text('Top Áreas de Fortaleza', 20, strengthsY)
    
    const strengths = kpis.diagnosticStats.strengths.length > 0 ? kpis.diagnosticStats.strengths : ['No disponible']
    strengths.forEach((s, i) => {
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2], 0.1)
        doc.roundedRect(20 + (i * 60), strengthsY + 8, 55, 12, 2, 2, 'F')
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setFontSize(10)
        doc.text(s, 20 + (i * 60) + 27, strengthsY + 16, { align: 'center' })
    })

    // --- 5. Comparativa Nacional ---
    const benchmarkY = strengthsY + 45
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(16)
    doc.text('Benchmark: Escuela vs. Promedio Nacional', 20, benchmarkY)

    const myAvg = currentIQ
    const natAvg = kpis.nationalAvg

    doc.setFontSize(10)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('Competitividad institucional comparada con el promedio de otras academias financieras.', 20, benchmarkY + 6)

    const benchData = [
        ['Institución', `${myAvg}%`, myAvg >= natAvg ? '+ Superior' : '- Bajo'],
        ['Promedio Nacional', `${natAvg}%`, 'Referencia']
    ]

    ;(doc as any).autoTable({
        startY: benchmarkY + 12,
        body: benchData,
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 5 },
        columnStyles: {
            0: { fontStyle: 'bold' },
            1: { halign: 'center' },
            2: { halign: 'right', textColor: myAvg >= natAvg ? [5, 150, 105] : [220, 38, 38] }
        },
        margin: { left: 20, right: 20 }
    })

    // --- Footer / Page Number ---
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(lightText[0], lightText[1], lightText[2])
        doc.text(`Generado por BIZEN Learning Analytics · Página ${i} de ${pageCount}`, 105, 285, { align: 'center' })
    }

    doc.save(`Reporte_Impacto_${school.replace(/\s+/g, '_')}.pdf`)
}
