export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      <h1 className="text-4xl font-serif text-hotpink-600 mb-8">
        Contact Us
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8 space-y-5">

        <p>
          We'd love to hear from you!
        </p>

        <div>
          <strong>Email</strong>
          <p>support@knotify.com</p>
        </div>

        <div>
          <strong>Phone</strong>
          <p>+91 98765 43210</p>
        </div>

        <div>
          <strong>Working Hours</strong>
          <p>Monday – Saturday</p>
          <p>9:00 AM – 6:00 PM</p>
        </div>

      </div>

    </div>
  )
}