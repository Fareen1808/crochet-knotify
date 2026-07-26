export default function ShippingInfo() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-hotpink-600 mb-8">
        Shipping Information
      </h1>

      <div className="space-y-6 text-gray-700 leading-8">

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Processing Time
          </h2>

          <p>
            Every crochet product is handmade with care.
            Orders are usually processed within
            <strong> 1–3 business days </strong>
            before shipping.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Delivery Time
          </h2>

          <ul className="list-disc ml-6 space-y-2">
            <li>Within India: 3–7 business days</li>
            <li>International: 7–15 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Shipping Charges
          </h2>

          <p>
            Free shipping on orders above <strong>₹999</strong>.
            Orders below ₹999 are charged based on location.
          </p>
        </section>

      </div>
    </div>
  )
}