import { useState } from 'react';
import CollectionContainer from './CollectionContainer';
import AddCollection from "./AddNewGundam/AddCollection";

const GundamCollectionApp = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      {isCreating ? (
        <AddCollection setIsCreating={setIsCreating} />
      ) : (
        <CollectionContainer setIsCreating={setIsCreating} />
      )}
    </div>
  );
};

export default GundamCollectionApp;