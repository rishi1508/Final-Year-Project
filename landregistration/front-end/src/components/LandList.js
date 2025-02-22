import React, { useEffect, useState } from 'react';

const LandList = ({ landRegistry }) => {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    const loadLands = async () => {
      const landCount = await landRegistry.methods.landCount().call();
      const lands = [];
      for (let i = 1; i <= landCount; i++) {
        const land = await landRegistry.methods.lands(i).call();
        lands.push(land);
      }
      setLands(lands);
    };

    loadLands();
  }, [landRegistry]);

  return (
    <div>
      <h2>Registered Lands</h2>
      <ul>
        {lands.map((land) => (
          <li key={land.id}>
            ID: {land.id}, Location: {land.location}, Size: {land.size}, Owner: {land.owner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandList;