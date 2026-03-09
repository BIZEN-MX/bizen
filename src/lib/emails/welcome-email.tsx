// BIZEN Welcome Email Template

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export const BizenWelcomeEmail = ({ name, dashboardUrl }: WelcomeEmailProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #0B71FE 0%, #0E4A7A 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: 500;
            margin-bottom: 10px;
            letter-spacing: 2px;
          }
          .header-subtitle {
            font-size: 14px;
            opacity: 0.95;
            margin-top: 8px;
          }
          .content {
            padding: 40px 30px;
            background-color: #ffffff;
          }
          .greeting {
            font-size: 24px;
            color: #0E4A7A;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .message {
            font-size: 16px;
            color: #444;
            line-height: 1.8;
            margin-bottom: 20px;
          }
          .highlight-box {
            background-color: #f0f7ff;
            border-left: 4px solid #0B71FE;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #0B71FE;
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 16px;
            text-align: center;
            margin: 25px 0;
            box-shadow: 0 4px 12px rgba(11, 113, 254, 0.3);
            transition: all 0.3s ease;
          }
          .button:hover {
            background-color: #0E4A7A;
            box-shadow: 0 6px 16px rgba(11, 113, 254, 0.4);
          }
          .features {
            margin: 30px 0;
          }
          .feature-item {
            padding: 15px 0;
            border-bottom: 1px solid #eee;
          }
          .feature-item:last-child {
            border-bottom: none;
          }
          .feature-icon {
            font-size: 24px;
            margin-right: 10px;
          }
          .feature-title {
            font-weight: 500;
            color: #0E4A7A;
            margin-bottom: 5px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-link {
            color: #0B71FE;
            text-decoration: none;
            margin: 0 10px;
          }
          .social-links {
            margin-top: 20px;
          }
          @media only screen and (max-width: 600px) {
            .header {
              padding: 30px 20px;
            }
            .content {
              padding: 30px 20px;
            }
            .greeting {
              font-size: 20px;
            }
            .message {
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <img 
              src="https://bizen.mx/bsmx-logo.png" 
              alt="BIZEN Logo" 
              style="max-width: 220px; height: auto; margin: 0 auto 15px; display: block;"
            />
            <div class="header-subtitle">Tu plataforma de aprendizaje digital</div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">¡Hola ${name}! 👋</div>
            
            <p class="message">
              ¡Tu viaje con <strong>BIZEN</strong> comienza ahora! Nos emociona tenerte con nosotros en este camino de aprendizaje y crecimiento profesional.
            </p>

            <p class="message">
              Tu cuenta ha sido verificada exitosamente, <strong>${name}</strong>, y ya tienes acceso completo a todos nuestros módulos y recursos educativos.
            </p>

            <div class="highlight-box">
              <strong>🎯 ¿Qué puedes hacer ahora?</strong>
              <ul style="margin-top: 12px; margin-left: 20px; line-height: 1.8;">
                <li>Accede a tu dashboard personalizado</li>
                <li>Explora nuestros módulos de aprendizaje</li>
                <li>Comienza tu primer curso</li>
                <li>Rastrea tu progreso en tiempo real</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">
                Ir a mi Dashboard →
              </a>
            </div>

            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">📚</div>
                <div class="feature-title">Contenido de calidad</div>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">
                  Accede a módulos diseñados por expertos en la industria.
                </p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📈</div>
                <div class="feature-title">Seguimiento de progreso</div>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">
                  Visualiza tu avance y logros en tiempo real.
                </p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🎓</div>
                <div class="feature-title">Certificaciones</div>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">
                  Obtén certificados al completar los módulos.
                </p>
              </div>
            </div>

            <p class="message" style="margin-top: 30px;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos en 
              <a href="mailto:soporte@bizen.site" style="color: #0B71FE; text-decoration: none;">
                soporte@bizen.site
              </a>
            </p>

            <p class="message" style="font-size: 14px; color: #666;">
              ¡Feliz aprendizaje! 🚀
            </p>

            <p style="margin-top: 25px; font-weight: 500; color: #0E4A7A;">
              El equipo de BIZEN
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-links">
              <a href="${dashboardUrl.split('/dashboard')[0]}/modules/menu" class="footer-link">Explorar Módulos</a> •
              <a href="mailto:soporte@bizen.site" class="footer-link">Soporte</a>
            </div>
            
            <p style="margin-top: 15px; font-size: 13px;">
              © ${new Date().getFullYear()} BIZEN. Todos los derechos reservados.
            </p>
            
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
              Recibiste este email porque creaste una cuenta en BIZEN.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to send BIZEN welcome email
export const sendBizenWelcomeEmail = async (
  to: string,
  name: string,
  dashboardUrl: string
) => {
  const { resend } = await import('@/lib/resend');
  
  return await resend.emails.send({
    from: 'BIZEN <onboarding@resend.dev>', // Change to your verified domain like: 'BIZEN <bienvenida@bizen.site>'
    to,
    subject: `${name}, ¡tu viaje con BIZEN comienza ahora! 🚀`,
    html: BizenWelcomeEmail({ name, dashboardUrl }),
  });
};

