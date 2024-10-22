import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LandRecordSearch = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({
    register: false,
    settings: false
  });
  const [searchData, setSearchData] = useState({
    name: '',
    gender: '',
    address: '',
    phone: '',
    location: '',
    district: '',
    plotNo: '',
    area: '',
    assetValue: ''
  });

  const toggleSubmenu = (menu) => {
    setSubmenuStates(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSearch = async () => {
    // Mock data for demonstration - replace with actual Web3 calls
    setSearchData({
      name: 'John Doe',
      gender: 'Male',
      address: '123 Main St',
      phone: '555-0123',
      location: 'Downtown',
      district: 'Central',
      plotNo: 'A123',
      area: '1000',
      assetValue: '500000'
    });
    setIsSearchVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Menu  */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-4 left-4 p-2 ${isSidebarOpen ? 'hidden' : 'block'}`}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4"
        >
          ×
        </button>

        <nav className="p-4 mt-8">
          <div className="space-y-4">
            <a href="#" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Dashboard</span>
            </a>
            
            <div>
              <button 
                onClick={() => toggleSubmenu('register')}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded"
              >
                <span>Register</span>
                <span className={`transform transition-transform ${submenuStates.register ? 'rotate-90' : ''}`}>›</span>
              </button>
              {submenuStates.register && (
                <div className="ml-4 space-y-2">
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">Users</a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">Assets</a>
                </div>
              )}
            </div>

            <a href="#" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Search</span>
            </a>
            
            <a href="#" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Mutation</span>
            </a>

            <a href="#" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Records</span>
            </a>

            <a href="#" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Vendor List</span>
            </a>

            <div>
              <button 
                onClick={() => toggleSubmenu('settings')}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded"
              >
                <span>Settings</span>
                <span className={`transform transition-transform ${submenuStates.settings ? 'rotate-90' : ''}`}>›</span>
              </button>
              {submenuStates.settings && (
                <div className="ml-4 space-y-2">
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">User Profile</a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">Land Data</a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className={`p-6 ${isSidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Search your Land Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <fieldset className="border rounded-md p-4">
                <legend className="text-center px-2">Land Record (Register II)</legend>
                <Input
                  type="text"
                  placeholder="Enter Account Number"
                  className="w-full"
                />
              </fieldset>
              
              <Button 
                onClick={handleSearch}
                className="w-full"
              >
                Search
              </Button>

              {isSearchVisible && (
                <div className="mt-8 space-y-6">
                  <h2 className="text-xl font-semibold text-center underline">Land Details</h2>
                  
                  <div>
                    <h3 className="font-bold text-green-800 mb-2">Personal Detail</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Name:</span>
                        <span>{searchData.name}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Gender:</span>
                        <span>{searchData.gender}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Address:</span>
                        <span>{searchData.address}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Phone:</span>
                        <span>{searchData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-green-800 mb-2">Property Detail</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Land Location:</span>
                        <span>{searchData.location}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">District:</span>
                        <span>{searchData.district}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Plot No:</span>
                        <span>{searchData.plotNo}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Area:</span>
                        <span>{searchData.area} (sqft)</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">Asset Value:</span>
                        <span className="text-red-600">₹{searchData.assetValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LandRecordSearch;