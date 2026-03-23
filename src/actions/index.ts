import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El email no es válido'),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  producto: z.string().min(1, 'Selecciona un producto de interés'),
  mensaje: z.string().min(1, 'El mensaje es obligatorio'),
  turnstile_token: z.string().optional(),
});

export const server = {
  sendContactEmail: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async (input) => {
      try {
        const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
        if (TURNSTILE_SECRET_KEY && input.turnstile_token) {
          try {
            const formData = new URLSearchParams();
            formData.append('secret', TURNSTILE_SECRET_KEY);
            formData.append('response', input.turnstile_token);

            const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
              method: 'POST',
              body: formData,
            });
            if (!response.ok) {
              throw new Error(`Turnstile verify HTTP ${response.status}`);
            }
            const result = await response.json();

            if (!result.success) {
              throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'La verificación de seguridad falló. Por favor, intenta nuevamente.',
              });
            }
          } catch (error) {
            if (error instanceof ActionError) throw error;
            console.error('Error al validar Turnstile:', error);
            throw new ActionError({
              code: 'BAD_REQUEST',
              message: 'Error al validar la verificación de seguridad. Por favor, intenta nuevamente.',
            });
          }
        } else if (TURNSTILE_SECRET_KEY && !input.turnstile_token) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Por favor, completa la verificación de seguridad.',
          });
        }

        const SMTP_HOST = import.meta.env.SMTP_HOST;
        const SMTP_PORT = Number(import.meta.env.SMTP_PORT);
        const SMTP_SECURE_RAW = import.meta.env.SMTP_SECURE;
        const secure =
          SMTP_SECURE_RAW === 'true' ||
          SMTP_SECURE_RAW === 'ssl' ||
          SMTP_SECURE_RAW === 'tls';
        const requireTLS =
          SMTP_SECURE_RAW === 'tls' || SMTP_SECURE_RAW === 'starttls';
        const SMTP_USER = import.meta.env.SMTP_USER;
        const SMTP_PASS = import.meta.env.SMTP_PASS;
        const SMTP_FROM = import.meta.env.SMTP_FROM || SMTP_USER;
        const SMTP_TO = import.meta.env.SMTP_TO || SMTP_USER;
        const SITE_NAME = import.meta.env.SITE_NAME || 'Sitio';

        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'La configuración del servidor de correo no está completa. Por favor, contacta al administrador.',
          });
        }

        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure,
          requireTLS,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        await transporter.verify();

        const mailOptions = {
          from: `"${input.nombre}" <${SMTP_FROM}>`,
          to: SMTP_TO,
          replyTo: input.email,
          subject: `[${SITE_NAME}] Cotización: ${input.producto}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #fed441; padding-bottom: 10px;">
                Nueva solicitud de cotización
              </h2>
              <div style="margin-top: 20px;">
                <p><strong>Nombre:</strong> ${input.nombre}</p>
                <p><strong>Email:</strong> <a href="mailto:${input.email}">${input.email}</a></p>
                ${input.telefono ? `<p><strong>Teléfono:</strong> <a href="tel:${input.telefono}">${input.telefono}</a></p>` : ''}
                ${input.empresa ? `<p><strong>Empresa:</strong> ${input.empresa}</p>` : ''}
                <p><strong>Producto de interés:</strong> ${input.producto}</p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #fed441;">
                <p><strong>Mensaje:</strong></p>
                <p style="white-space: pre-wrap;">${input.mensaje}</p>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>Este mensaje fue enviado desde el formulario de contacto del sitio.</p>
              </div>
            </div>
          `,
          text: `
Nueva solicitud de cotización - ${SITE_NAME}

Nombre: ${input.nombre}
Email: ${input.email}
${input.telefono ? `Teléfono: ${input.telefono}` : ''}
${input.empresa ? `Empresa: ${input.empresa}` : ''}
Producto de interés: ${input.producto}

Mensaje:
${input.mensaje}

---
Este mensaje fue enviado desde el formulario de contacto del sitio web.
          `.trim(),
        };

        const info = await transporter.sendMail(mailOptions);

        return {
          success: true,
          message: 'Tu mensaje ha sido enviado correctamente. Te responderemos pronto.',
          messageId: info.messageId,
        };
      } catch (error) {
        if (error instanceof ActionError) throw error;
        console.error('Error al enviar email:', error);
        const devMessage =
          import.meta.env.DEV
            ? (error instanceof Error ? error.message : String(error))
            : 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente más tarde.';
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: devMessage,
        });
      }
    },
  }),
};
