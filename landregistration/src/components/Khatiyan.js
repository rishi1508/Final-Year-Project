import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

const Khatiyan = ({ web3Instance }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({
    register: false,
    settings: false
  });
  const [plotNumber, setPlotNumber] = useState('');
  const [currentOwner, setCurrentOwner] = useState({
    name: '',
    location: ''
  });
  const [vendors, setVendors] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const toggleSubmenu = (menu) => {
    setSubmenuStates(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const fetchVendorList = async () => {
    if (!web3Instance || !plotNumber) return;

    try {
      setShowResults(true);
      
      //  contract instance
      const contract = web3Instance.contract;
      const khatiyanData = await contract.methods.get_khatiyan(plotNumber).call();
      
      const vendorAddresses = khatiyanData[0];
      const totalVendors = khatiyanData[1];
      
      // Current owner details
      const currentOwnerAddress = vendorAddresses[totalVendors - 1];
      const currentOwnerData = await contract.methods.get_user(currentOwnerAddress).call();
      setCurrentOwner({
        name: currentOwnerData[0],
        location: currentOwnerData[2]
      });

      // Fetching all vendors details
      const vendorPromises = vendorAddresses
        .slice(0, totalVendors)
        .reverse()
        .map(async (address, index) => {
          const userData = await contract.methods.get_user(address).call();
          return {
            id: totalVendors - index,
            name: userData[0]
          };
        });

      const vendorList = await Promise.all(vendorPromises);
      setVendors(vendorList);
    } catch (error) {
      console.error('Error fetching vendor list:', error);
      
    }
  };

  useEffect(() => {
    // Fetch vendor list logic here
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Menu Button */}
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
          <X className="h-6 w-6" />
        </button>

        <nav className="p-4 mt-8">
          <div className="space-y-4">
            <a href="/dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded">
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
                  <a href="/users" className="block p-2 hover:bg-gray-100 rounded">Users</a>
                  <a href="/assets" className="block p-2 hover:bg-gray-100 rounded">Assets</a>
                </div>
              )}
            </div>

            <a href="/search" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Search</span>
            </a>
            
            <a href="/mutation" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Mutation</span>
            </a>

            <a href="/records" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <span>Records</span>
            </a>

            <a href="/vendor-list" className="flex items-center p-2 hover:bg-gray-100 rounded">
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
                  <a href="/user-profile" className="block p-2 hover:bg-gray-100 rounded">User Profile</a>
                  <a href="/land-data" className="block p-2 hover:bg-gray-100 rounded">Land Data</a>
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
            <CardTitle className="text-center">Vendor List</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <fieldset className="border rounded-md p-4">
                <legend className="text-center px-2">Plot Information</legend>
                <Input
                  type="text"
                  placeholder="Enter the plot number"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  className="w-full"
                />
                <Button 
                  onClick={fetchVendorList}
                  className="w-full mt-4"
                >
                  Click to show the vendor list
                </Button>
              </fieldset>

              {showResults && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-center mb-4">Current Owner</h2>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold">Plot No.</h3>
                        <p className="text-red-600 font-bold">{plotNumber}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Name</h3>
                        <p>{currentOwner.name}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Location</h3>
                        <p>{currentOwner.location}</p>
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            Vendor: {vendor.id} - {vendor.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Khatiyan;