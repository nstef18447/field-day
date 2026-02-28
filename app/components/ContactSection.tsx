"use client";

import { FormEvent } from "react";

export default function ContactSection() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Thanks for reaching out!");
  };

  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title reveal">Say Hello</h2>
      <p className="section-subtitle reveal">We&apos;d love to hear from you</p>
      <form className="contact-form reveal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" placeholder="e.g. Sarah" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="hello@example.com" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Tell us what you're looking for..."></textarea>
        </div>
        <button type="submit" className="submit-btn">Send It</button>
      </form>
    </section>
  );
}
