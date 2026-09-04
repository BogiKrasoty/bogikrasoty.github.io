import React from "react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Контактная форма</h1>
      <form action="/send.php" method="POST" className="space-y-4">
        <div>
          <label className="block font-medium" htmlFor="name">Имя</label>
          <input type="text" name="name" id="name" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium" htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium" htmlFor="phone">Телефон</label>
          <input type="tel" name="phone" id="phone" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium" htmlFor="message">Сообщение</label>
          <textarea name="message" id="message" rows={4} required className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Отправить
        </button>
      </form>
    </div>
  );
}
