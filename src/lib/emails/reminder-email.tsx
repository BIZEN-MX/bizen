// BIZEN Reminder Email Template
interface ReminderEmailProps {
  name: string;
  personalizedMessage: string;
  ctaUrl: string;
}

export const BizenReminderEmail = ({ name, personalizedMessage, ctaUrl }: ReminderEmailProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
          .header { text-align: center; padding-bottom: 20px; }
          .logo { max-width: 150px; }
          .billy-msg { background: #f0f7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0B71FE; font-style: italic; }
          .button { display: inline-block; padding: 12px 24px; background: #0B71FE; color: white !important; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://bizen.mx/bsmx-logo.png" alt="BIZEN" class="logo" />
          </div>
          <p>¡Hola <strong>${name}</strong>!</p>
          <p>Billy tiene un mensaje para ti sobre tu progreso en BIZEN:</p>
          
          <div class="billy-msg">
            "${personalizedMessage}"
          </div>
          
          <p>No dejes que se te enfríe el conocimiento. Entra hoy y sigue sumando puntos.</p>
          
          <div style="text-align: center;">
            <a href="${ctaUrl}" class="button">Regresar a BIZEN</a>
          </div>
          
          <div class="footer">
            © ${new Date().getFullYear()} BIZEN. Si no quieres recibir estos correos, puedes gestionar tus notificaciones en ajustes.
          </div>
        </div>
      </body>
    </html>
  `;
};
