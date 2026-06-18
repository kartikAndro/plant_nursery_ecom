import React from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Stock', icon: Sprout },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers List', icon: Users },
    { id: 'blogs', label: 'Care Articles', icon: BookOpen },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-neutral-100 flex flex-col shrink-0 min-h-screen">
      {/* Brand/Header */}
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-800">Admin Control</h2>
          <p className="text-xs text-neutral-450 mt-0.5">Nursery Operations</p>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-nursery-50 text-nursery-700 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <IconComponent className={`h-5 w-5 mr-3 ${isActive ? 'text-nursery-600' : 'text-neutral-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-4 border-t border-neutral-100">
        <Link
          to="/"
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-3 text-neutral-400" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
