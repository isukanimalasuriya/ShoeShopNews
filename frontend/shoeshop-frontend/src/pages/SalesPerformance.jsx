import { useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { Calendar, Award, BookOpen, User, DollarSign, TrendingUp, Clock, CheckCircle, Play } from 'lucide-react';

// Mock data for sales performance
const salesData = [
  { name: 'Jan', sales: 4000, target: 3500 },
  { name: 'Feb', sales: 3000, target: 3500 },
  { name: 'Mar', sales: 5000, target: 3500 },
  { name: 'Apr', sales: 3800, target: 3500 },
  { name: 'May', sales: 4200, target: 3500 },
  { name: 'Jun', sales: 5100, target: 4000 },
];

// Mock data for training modules
const trainingModules = [
  { id: 1, title: 'New Season Collection Introduction', duration: '45 mins', progress: 100, category: 'Product Knowledge' },
  { id: 2, title: 'Advanced Customer Service Techniques', duration: '1 hour', progress: 75, category: 'Customer Service' },
  { id: 3, title: 'Shoe Fitting Masterclass', duration: '1.5 hours', progress: 50, category: 'Technical Skills' },
  { id: 4, title: 'Inventory Management Basics', duration: '30 mins', progress: 0, category: 'Operations' },
  { id: 5, title: 'Upselling Strategies', duration: '45 mins', progress: 25, category: 'Sales' },
];

// Mock data for upcoming training sessions
const upcomingTraining = [
  { id: 1, title: 'Summer Collection Preview', date: 'May 10, 2025', time: '9:00 AM', trainer: 'Sarah Johnson' },
  { id: 2, title: 'Sales Techniques Workshop', date: 'May 15, 2025', time: '2:00 PM', trainer: 'Michael Chen' },
  { id: 3, title: 'Team Building Session', date: 'May 22, 2025', time: '1:00 PM', trainer: 'Lisa Taylor' },
];

// Main component
export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState('sales');
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        
     
        
        
        <nav className="mt-2">
        
          <SidebarItem icon={<TrendingUp size={18} />} text="Sales Performance" active={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
          <SidebarItem icon={<BookOpen size={18} />} text="Training Portal" active={activeTab === 'training'} onClick={() => setActiveTab('training')} />
          <div className="mt-auto pt-20">
            <SidebarItem icon={<LogoutIcon size={18} />} text="Logout" active={false} />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sales' ? <SalesPerformance /> : <TrainingPortal />}
      </div>
    </div>
  );
}

// Custom logout icon that matches the style
function LogoutIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// Sidebar item component
function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div 
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-indigo-900 border-l-4 border-white' : 'hover:bg-indigo-700'}`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

// Sales Performance Page
function SalesPerformance() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Performance</h1>
        <p className="text-gray-600">Track your sales metrics and achievements</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<DollarSign size={20} className="text-green-500" />}
          title="Monthly Sales" 
          value="$12,450" 
          change="+8.2%" 
          isPositive={true} 
        />
        <StatCard 
          icon={<Award size={20} className="text-purple-500" />}
          title="Sales Ranking" 
          value="#2" 
          change="Up 1 position" 
          isPositive={true} 
        />
        <StatCard 
          icon={<TrendingUp size={20} className="text-blue-500" />}
          title="Conversion Rate" 
          value="32%" 
          change="+2.5%" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Sales Performance</h2>
            <select className="text-sm border rounded px-2 py-1">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#6366F1" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94A3B8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            <ProductSaleItem 
              name="Urban Runner Pro" 
              category="Running Shoes" 
              sales={28} 
              imageSrc="/api/placeholder/40/40" 
            />
            <ProductSaleItem 
              name="Comfort Stride Loafers" 
              category="Casual Wear" 
              sales={23} 
              imageSrc="/api/placeholder/40/40" 
            />
            <ProductSaleItem 
              name="Elegant Step Heels" 
              category="Formal Wear" 
              sales={19} 
              imageSrc="/api/placeholder/40/40" 
            />
            <ProductSaleItem 
              name="Trail Blazer X2" 
              category="Outdoor" 
              sales={17} 
              imageSrc="/api/placeholder/40/40" 
            />
            <ProductSaleItem 
              name="Kids Fun Runners" 
              category="Children" 
              sales={15} 
              imageSrc="/api/placeholder/40/40" 
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Feedback</h2>
        <div className="space-y-4">
          <CustomerFeedback 
            name="Jennifer L." 
            date="April 30, 2025" 
            rating={5} 
            comment="Alex was incredibly helpful in finding the perfect running shoes for me. Very knowledgeable about the products!"
          />
          <CustomerFeedback 
            name="Michael T." 
            date="April 28, 2025" 
            rating={4} 
            comment="Good service and recommendations, though I had to wait a bit to get assistance."
          />
          <CustomerFeedback 
            name="Sarah K." 
            date="April 25, 2025" 
            rating={5} 
            comment="Excellent service! Alex went above and beyond to help me find comfortable shoes for my foot condition."
          />
        </div>
      </div>
    </div>
  );
}

// Training Portal Page
function TrainingPortal() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Training Portal</h1>
        <p className="text-gray-600">Access training materials and track your progress</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TrainingStatCard 
          icon={<BookOpen size={20} className="text-indigo-500" />}
          title="Completed" 
          value="12" 
          subtitle="Training modules" 
          bgColor="bg-indigo-50"
          textColor="text-indigo-500"
        />
        <TrainingStatCard 
          icon={<Clock size={20} className="text-amber-500" />}
          title="In Progress" 
          value="3" 
          subtitle="Training modules" 
          bgColor="bg-amber-50"
          textColor="text-amber-500"
        />
        <TrainingStatCard 
          icon={<CheckCircle size={20} className="text-green-500" />}
          title="Certifications" 
          value="4" 
          subtitle="Earned this year" 
          bgColor="bg-green-50"
          textColor="text-green-500"
        />
        <TrainingStatCard 
          icon={<Calendar size={20} className="text-blue-500" />}
          title="Upcoming" 
          value="3" 
          subtitle="Training sessions" 
          bgColor="bg-blue-50"
          textColor="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Learning Path</h2>
            <select className="text-sm border rounded px-2 py-1">
              <option>All Categories</option>
              <option>Product Knowledge</option>
              <option>Sales</option>
              <option>Customer Service</option>
            </select>
          </div>
          <div className="space-y-4">
            {trainingModules.map(module => (
              <TrainingModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Training</h2>
          <div className="space-y-4">
            {upcomingTraining.map(training => (
              <UpcomingTrainingCard key={training.id} training={training} />
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-800 mb-3">Featured Training</h3>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">New Season Collection</h4>
                <span className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1">Featured</span>
              </div>
              <p className="text-sm text-indigo-100 mb-3">Learn about our exciting new arrivals for the upcoming season.</p>
              <button className="flex items-center text-xs bg-white text-indigo-700 rounded-full px-3 py-1 font-medium">
                <Play size={12} className="mr-1" /> Watch Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Certifications</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CertificationCard 
            title="Footwear Specialist" 
            date="March 2025" 
            image="/api/placeholder/60/60"
          />
          <CertificationCard 
            title="Customer Service Excellence" 
            date="January 2025" 
            image="/api/placeholder/60/60"
          />
          <CertificationCard 
            title="Sports Shoe Expert" 
            date="November 2024" 
            image="/api/placeholder/60/60"
          />
          <CertificationCard 
            title="Sales Professional" 
            date="September 2024" 
            image="/api/placeholder/60/60"
          />
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ icon, title, value, change, isPositive }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="p-2 rounded-lg bg-gray-100">{icon}</span>
        <span className={`text-xs font-medium rounded-full px-2 py-1 ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

// Product Sale Item Component
function ProductSaleItem({ name, category, sales, imageSrc }) {
  return (
    <div className="flex items-center">
      <img src={imageSrc} alt={name} className="w-10 h-10 rounded object-cover" />
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{sales} sold</p>
        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
          <div 
            className="bg-indigo-600 h-1 rounded-full" 
            style={{ width: `${Math.min(sales / 0.3, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Customer Feedback Component
function CustomerFeedback({ name, date, rating, comment }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{name}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600">{comment}</p>
    </div>
  );
}

// Training Stats Card
function TrainingStatCard({ icon, title, value, subtitle, bgColor, textColor }) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="mb-4">{icon}</div>
      <p className={`${textColor} text-2xl font-bold`}>{value}</p>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

// Training Module Card
function TrainingModuleCard({ module }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 mb-2 inline-block">
            {module.category}
          </span>
          <h3 className="font-medium mb-1">{module.title}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Clock size={14} className="mr-1" /> {module.duration}
          </p>
        </div>
        {module.progress === 100 ? (
          <span className="bg-green-500 text-white p-1 rounded-full">
            <CheckCircle size={16} />
          </span>
        ) : (
          <button className="bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700">
            <Play size={16} />
          </button>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{module.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              module.progress === 100 ? 'bg-green-500' : 
              module.progress > 0 ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            style={{ width: `${module.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Upcoming Training Card
function UpcomingTrainingCard({ training }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <h3 className="font-medium">{training.title}</h3>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <Calendar size={14} className="mr-1" />
        <span>{training.date}</span>
      </div>
      <div className="flex items-center mt-1 text-sm text-gray-500">
        <Clock size={14} className="mr-1" />
        <span>{training.time}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">Trainer: {training.trainer}</span>
        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          Add to Calendar
        </button>
      </div>
    </div>
  );
}

// Certification Card
function CertificationCard({ title, date, image }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:border-indigo-300 transition-colors">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-100 mb-3">
        <img src={image} alt={title} className="w-10 h-10" />
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{date}</p>
      <button className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
        View Certificate
      </button>
    </div>
  );
}