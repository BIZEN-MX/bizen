import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    // Security: Only allow files from uploads directory
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    // Construct full file path
    const fullPath = join(process.cwd(), 'public', filePath)

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file content
    const fileContent = await readFile(fullPath, 'utf-8')
    const fileName = filePath.split('/').pop() || 'file'
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''

    // Determine content type based on file extension
    let contentType = 'text/plain'
    let shouldDisplayAsText = true

    switch (fileExtension) {
      case 'pdf':
        contentType = 'application/pdf'
        shouldDisplayAsText = false
        break
      case 'png':
        contentType = 'image/png'
        shouldDisplayAsText = false
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        shouldDisplayAsText = false
        break
      case 'txt':
        contentType = 'text/plain'
        shouldDisplayAsText = true
        break
      default:
        contentType = 'text/plain'
        shouldDisplayAsText = true
    }

    // If it's a binary file (image, pdf), serve it directly
    if (!shouldDisplayAsText) {
      const fileBuffer = await readFile(fullPath)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${fileName}"`,
        },
      })
    }

    // For text files, create a nice HTML viewer
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ver Archivo - ${fileName}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
            color: #333;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #0F62FE, #2563EB);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .file-info {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
            color: #666;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
            font-size: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 70vh;
            overflow-y: auto;
          }
          .actions {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 8px;
            background: #0F62FE;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          .btn:hover {
            background: #0842A0;
            transform: translateY(-1px);
          }
          .btn-secondary {
            background: #6c757d;
          }
          .btn-secondary:hover {
            background: #545b62;
          }
          .file-type {
            display: inline-block;
            padding: 4px 8px;
            background: #e3f2fd;
            color: #1976d2;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 ${fileName}</h1>
            <span class="file-type">${fileExtension}</span>
          </div>
          
          <div class="file-info">
            <strong>Archivo:</strong> ${fileName} | 
            <strong>Tamaño:</strong> ${(fileContent.length / 1024).toFixed(1)} KB | 
            <strong>Tipo:</strong> ${contentType}
          </div>
          
          <div class="content">
${fileContent}
          </div>
          
          <div class="actions">
            <a href="${filePath}" download="${fileName}" class="btn">
              💾 Descargar Archivo
            </a>
            <a href="javascript:window.close()" class="btn btn-secondary">
              ❌ Cerrar
            </a>
          </div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Error viewing file:', error)
    return NextResponse.json(
      { error: 'Error al leer el archivo: ' + error.message },
      { status: 500 }
    )
  }
}
