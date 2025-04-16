// Configuration settings for the application
const config = {
    // Contract settings
    CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '0xE2B49B1a6fc0b97c64252Ca617779Ccb14a965bf',
    ADMIN_ADDRESS: process.env.REACT_APP_ADMIN_ADDRESS || '0x7F585D7A9751a7388909Ed940E29732306A98f0c',
    
    // Network settings
    NETWORK_ID: 11155111, // Sepolia
    NETWORK_NAME: 'Sepolia',
    
    // UI settings
    ADDRESS_DISPLAY_LENGTH: 8, // How many characters to show at beginning/end of ethereum addresses
    
    // Helper functions
    shortenAddress: (address) => {
      if (!address) return '';
      return `${address.substring(0, config.ADDRESS_DISPLAY_LENGTH)}...${address.substring(address.length - 4)}`;
    }
  };
  
  export default config;