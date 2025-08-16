import Header from "../../components/layout/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen font-figtree">
      <Header className="font-roboto" />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gold-700 font-bricolage">Contact ORA Fashions</h1>
          <p className="text-lg text-gray-700 mb-6">
            Have questions or need personalized recommendations? Our team is here to help! Reach out to us using the details below or fill out our contact form.
          </p>
          <div className="bg-gold-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-2 font-bricolage">Contact Details</h2>
            <ul className="text-gray-700">
              <li>Email: <a href="mailto:info@orafashionz.com" className="text-gold-700 underline">info@orafashionz.com</a></li>
              <li>Phone: <a href="tel:+918089715616" className="text-gold-700 underline">+91 80897 15616</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
