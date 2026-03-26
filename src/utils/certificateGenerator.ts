import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface CertificateData {
  studentName: string
  topicTitle: string
  accuracy: number
  date: string
  lessonsCompleted: string[]
}

export async function generateBizenCertificate(data: CertificateData) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  })

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  // --- Background Decor ---
  // Background color (Slightly off-white)
  doc.setFillColor(252, 252, 252)
  doc.rect(0, 0, width, height, "F")

  // Sidebar (Spatial Blue)
  doc.setFillColor(15, 98, 254)
  doc.rect(0, 0, 45, height, "F")

  // Footer line
  doc.setDrawColor(15, 98, 254)
  doc.setLineWidth(1)
  doc.line(45, height - 20, width - 20, height - 20)

  // --- Branding ---
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(32)
  doc.text("BIZEN", 10, 30)
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("SISTEMA DE", 10, 40)
  doc.text("INGENIERÍA", 10, 45)
  doc.text("FINANCIERA", 10, 50)

  // --- Main Content ---
  doc.setTextColor(30, 41, 59) // Slate-800
  
  doc.setFontSize(48)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICADO", 60, 45)
  
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(71, 85, 105) // Slate-600
  doc.text("ESTE DOCUMENTO RECONOCE QUE", 60, 60)

  doc.setFontSize(36)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(15, 98, 254) // BIZEN Blue
  doc.text(data.studentName.toUpperCase(), 60, 80)

  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(71, 85, 105)
  doc.text("HA COMPLETADO CON ÉXITO EL BLOQUE DE", 60, 95)

  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 41, 59)
  doc.text(data.topicTitle.toUpperCase(), 60, 110)

  // --- Knowledge Metrics ---
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("MÉTRICAS DE DESEMPEÑO", 60, 130)
  
  doc.setFont("helvetica", "normal")
  doc.text(`Precisión Teórica: ${data.accuracy}%`, 60, 138)
  doc.text(`Fecha de Certificación: ${data.date}`, 60, 144)

  // --- Lessons List (Bullet points) ---
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text("MÓDULOS VALIDADOS:", 160, 130)
  data.lessonsCompleted.slice(0, 10).forEach((lesson, i) => {
    doc.text(`• ${lesson}`, 160, 138 + (i * 6))
  })

  // --- Signatures ---
  doc.setDrawColor(203, 213, 225)
  doc.line(60, height - 40, 110, height - 40)
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text("BILLY AI", 75, height - 34)
  doc.text("Director de Sistemas", 67, height - 29)

  doc.line(width - 70, height - 40, width - 20, height - 40)
  doc.text("BIZEN ACADEMY", width - 58, height - 34)
  doc.text("Verificación Blockchain", width - 60, height - 29)

  // Save the PDF
  doc.save(`Certificado_BIZEN_${data.topicTitle.replace(/\s+/g, '_')}.pdf`)
}
