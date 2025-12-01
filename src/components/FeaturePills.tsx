const features = [
  { icon: 'fas fa-sync-alt', title: 'Lifetime warranty', subtitle: 'on repair parts', color: 'text-red-600' },
  { icon: 'fas fa-box', title: 'Ready to sell', subtitle: 'pre-owned devices', color: 'text-purple-600' },
  { icon: 'fas fa-infinity', title: 'Retail ready', subtitle: 'accessories', color: 'text-green-600' },
  { icon: 'fas fa-tools', title: 'Tools & supplies', subtitle: 'for your business', color: 'text-orange-600' }
];

export default function FeaturePills() {
  return (
    <section className="py-10 px-5">
      <div className="max-w-6xl mx-auto flex gap-5 overflow-x-auto scrollbar-hide">
        {features.map((feature, index) => (
          <div
            key={index}
            className="min-w-[250px] bg-white rounded-full p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex-shrink-0"
          >
            <i className={`${feature.icon} text-2xl ${feature.color}`} />
            <div>
              <div className="font-semibold">{feature.title}</div>
              <div className="text-sm text-gray-600">{feature.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
