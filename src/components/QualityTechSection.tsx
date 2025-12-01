export default function QualityTechSection() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Quality Standards */}
        <div className="space-y-4">
          <img src="https://via.placeholder.com/60x80" alt="Quality" className="w-16 h-20" />
          <h3 className="text-xl font-bold">Discover Our Quality Standards</h3>
          <p className="text-sm text-gray-600">
            <a href="/quality-standards" className="text-blue-600 hover:underline">
              Click here
            </a>{' '}
            to explore all the qualities that set us apart.
          </p>
        </div>

        {/* AO7 Technology */}
        <div className="text-right space-y-4">
          <img
            src="https://via.placeholder.com/80x80"
            alt="AO7 Tech"
            className="w-20 h-20 float-right"
          />
          <h3 className="text-xl font-bold">AO7 | TECHNOLOGY</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Unmatched Quality and Reliability<br/>
            Top-tier materials and rigorous Quality control for reliable performance.
          </p>
        </div>
      </div>
    </section>
  );
}
