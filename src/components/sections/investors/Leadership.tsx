import Image from 'next/image';

type Leader = {
  name: string;
  title: string;
  image: string;
  bio: string;
};

const leaders: Leader[] = [
  {
    name: 'Emma Richards',
    title: 'Chief Executive Officer',
    image: '/images/about/team-1.jpg',
    bio: 'Emma brings 15 years of experience in the events industry, having previously led growth at EventBrite and founded her own successful event marketplace. She holds an MBA from Stanford and is passionate about connecting people through shared experiences.'
  },
  {
    name: 'Michael Chen',
    title: 'Chief Technology Officer',
    image: '/images/about/team-2.jpg',
    bio: 'Prior to co-founding Zafo, Michael was a senior engineering leader at Airbnb and Amazon. He holds a PhD in Computer Science from MIT and has multiple patents in recommendation systems and marketplace dynamics.'
  },
  {
    name: 'Sophia Rodriguez',
    title: 'Chief Financial Officer',
    image: '/images/about/team-3.jpg',
    bio: 'Sophia joined Zafo from Goldman Sachs, where she was a VP in the technology investment banking division. She has helped guide multiple tech companies through successful IPOs and has a track record of sustainable financial growth strategies.'
  },
  {
    name: 'David Kim',
    title: 'Chief Product Officer',
    image: '/images/about/team-4.jpg',
    bio: 'David previously led product teams at Instagram and Meta, focusing on community building and engagement features. He specializes in creating intuitive user experiences that drive both customer satisfaction and business growth.'
  }
];

export default function InvestorsLeadership() {
  return (
    <section className="py-20 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-6">
          Leadership Team
        </h2>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Our leadership team combines decades of experience in technology, events, finance, and 
          community building from some of the world&apos;s leading companies.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="relative h-64 w-full">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--sage-green)] mb-1">{leader.name}</h3>
                <p className="text-[var(--cognac)] font-medium mb-4">{leader.title}</p>
                <p className="text-gray-700 text-sm">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/about" 
            className="inline-flex items-center text-[var(--sage-green)] font-semibold hover:underline"
          >
            Meet our full team
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 