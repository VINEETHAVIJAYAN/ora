import Header from "../../components/layout/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen font-figtree">
      <Header className="font-roboto" />
      <main className="py-8 px-4">
        <h1 className="text-4xl font-bold mb-4 text-gold-700 font-bricolage">
          About ORA Fashions
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          ORA Fashions is dedicated to bringing you the finest collection of
          traditional and contemporary jewelry. Our passion for authentic
          craftsmanship and elegant design is reflected in every piece we offer.
          Discover our story, values, and commitment to quality.
        </p>
        <h2 className="text-2xl font-bold mb-4 font-bricolage">Our Heritage</h2>
        <p className="text-lg text-gray-700 mb-6">
          ORA Fashions is dedicated to bringing you the finest collection of
          traditional and contemporary jewelry. Our passion for authentic
          craftsmanship and elegant design is reflected in every piece we offer.
          Discover our story, values, and commitment to quality.
        </p>
        <div className="bg-gold-100 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-2 font-bricolage">
            Our Story
          </h2>
          <p className="text-gray-700">
            Founded with a love for Indian and ethnic jewelry, ORA Fashions has
            grown into a trusted destination for customers seeking timeless
            beauty and modern luxury. We believe in celebrating tradition while
            embracing innovation.
          </p>
        </div>
      </main>
    </div>
  );
}
