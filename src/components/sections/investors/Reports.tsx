import Button from '@/components/ui/Button';

type Report = {
  title: string;
  type: string;
  date: string;
  fileSize: string;
};

const reports: Report[] = [
  {
    title: 'Q4 2023 Earnings Report',
    type: 'PDF',
    date: 'February 15, 2024',
    fileSize: '3.2 MB'
  },
  {
    title: 'Q3 2023 Earnings Report',
    type: 'PDF',
    date: 'November 12, 2023',
    fileSize: '2.8 MB'
  },
  {
    title: 'Q2 2023 Earnings Report',
    type: 'PDF',
    date: 'August 10, 2023',
    fileSize: '3.1 MB'
  },
  {
    title: 'Q1 2023 Earnings Report',
    type: 'PDF',
    date: 'May 15, 2023',
    fileSize: '2.9 MB'
  },
  {
    title: '2023 Annual Shareholder Meeting Presentation',
    type: 'PDF',
    date: 'March 25, 2023',
    fileSize: '8.5 MB'
  },
  {
    title: '2022 Annual Report',
    type: 'PDF',
    date: 'February 28, 2023',
    fileSize: '12.4 MB'
  }
];

export default function InvestorsReports() {
  return (
    <section id="financial-reports" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-6">
            Financial Reports & Documents
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Access our quarterly and annual financial reports, investor presentations, and other important documents.
          </p>
          
          <div className="bg-[var(--taupe)] rounded-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Document</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr 
                      key={index}
                      className={`${index < reports.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-[var(--sage-green)]">{report.title}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{report.type}</td>
                      <td className="py-4 px-4 text-gray-700">{report.date}</td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {report.fileSize}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mb-4">Investor Email Updates</h3>
            <p className="text-gray-700 mb-6">
              Stay informed about our financial performance, future plans, and investment opportunities.
              Sign up to receive our quarterly investor newsletter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]"
              />
              <Button variant="primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 