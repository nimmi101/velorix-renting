import { useEffect } from 'react';

const PageSEO = ({ title, description }) => {
  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | VELORIX Premium Rentals` : 'VELORIX | Premium Vehicle Rental Service';

    // Update Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'Velorix is a premium vehicle rental platform for luxury self-drive, chauffeur tours, wedding event transportation, and corporate buses.');
  }, [title, description]);

  return null;
};

export default PageSEO;
