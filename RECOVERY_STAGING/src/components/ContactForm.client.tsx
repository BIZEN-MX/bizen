"use client";
import * as React from "react";

export default function ContactForm() {
  return (
    <form
      className="card contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        alert("¡Gracias!");
      }}
    >
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" type="text" required placeholder="Tu nombre" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="tucorreo@ejemplo.com" />
      </div>
      <div className="field">
        <label htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" rows={4} required placeholder="Cuéntanos en qué podemos ayudarte…" />
      </div>
      <button className="btn primary" type="submit">Enviar mensaje</button>
    </form>
  );
}
